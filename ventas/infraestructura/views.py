import json
import re
from json import JSONDecodeError

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from soporte.infraestructura.models import SoportePago
from usuarios.infraestructura.models import Usuario, UsuarioDireccion

from .models import Pedido
from .serializers import PedidoSerializer


def _normalizar_items_carrito(items):
    items_normalizados = []

    for item in items or []:
        if not isinstance(item, dict):
            items_normalizados.append(item)
            continue

        item_normalizado = item.copy()
        producto_id = item_normalizado.get("producto")

        if (
            not item_normalizado.get("granizado")
            and isinstance(producto_id, str)
            and producto_id.startswith("granizado-")
        ):
            item_normalizado["granizado"] = producto_id.replace("granizado-", "", 1)
            item_normalizado.pop("producto", None)

        if item_normalizado.get("producto") in ("", None):
            item_normalizado.pop("producto", None)
        if item_normalizado.get("granizado") in ("", None):
            item_normalizado.pop("granizado", None)

        items_normalizados.append(item_normalizado)

    return items_normalizados


class CrearPedidoView(APIView):
    """
    Endpoint: POST /api/v1/ventas/pedidos/
    HU 5: Pagar Producto (Checkout / Creación de Pedido).
    Soporta 'Checkout Rápido' por teléfono.
    HU 6: Gestión de Soporte de Pago.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        # Manejar multipart/form-data
        data = request.data.copy()
        comprobante = request.FILES.get("comprobante")

        items_json = data.get("items")
        # Si items viene como string (por FormData), parseamos JSON
        if isinstance(items_json, str):
            try:
                items_data = json.loads(items_json)
            except JSONDecodeError:
                items_data = []
        else:
            items_data = items_json or []
        items_data = _normalizar_items_carrito(items_data)

        telefono_raw = data.get("telefono")
        nombres = data.get("nombres", "")
        apellidos = data.get("apellidos", "")
        direccion = data.get("direccion", "")
        recordar = (
            data.get("recordar_direccion") == "true" or data.get("recordar_direccion") is True
        )
        metodo_pago = data.get("metodo_pago", "EFECTIVO").upper()

        if not items_data or not telefono_raw:
            return Response({"error": "Datos incompletos"}, status=status.HTTP_400_BAD_REQUEST)

        if metodo_pago == "TRANSFERENCIA" and not comprobante:
            return Response(
                {"error": "Debe adjuntar el comprobante de pago para transferencias"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1. Identificar o Crear Usuario
        tel_limpio = re.sub(r"\D", "", telefono_raw)
        usuario = Usuario.objects.filter(telefono__icontains=tel_limpio).first()

        if not usuario:
            usuario = Usuario.objects.create_user(
                username=f"user_{tel_limpio}_{Usuario.objects.count()}",
                telefono=tel_limpio,
                first_name=nombres,
                last_name=apellidos,
            )
        else:
            if nombres:
                usuario.first_name = nombres
            if apellidos:
                usuario.last_name = apellidos
            usuario.save()

        # 2. Dirección
        if recordar and direccion:
            UsuarioDireccion.objects.get_or_create(
                usuario=usuario, direccion=direccion, defaults={"es_predeterminada": True}
            )
            usuario.direccion_base = direccion
            usuario.save()

        # 3. Serializar y Guardar Pedido
        pedido_data = {
            "cliente": usuario.id,
            "items": items_data,
            "estado": "PAGO_SUBIDO" if metodo_pago == "TRANSFERENCIA" else "PENDIENTE_PAGO",
            "metodo_pago": metodo_pago,
            "direccion": direccion,
            "notas": request.data.get("notas", ""),
            "costo_envio": request.data.get("costo_envio", 6000),
        }

        serializer = PedidoSerializer(data=pedido_data)
        if serializer.is_valid():
            # --- NUEVO: Validar y Decrementar Stock (HU 9 & 10) ---
            from django.db import transaction
            from rest_framework.exceptions import ValidationError

            from granizados.infraestructura.models import Granizado
            from inventario.infraestructura.models import ProductoModelo

            try:
                with transaction.atomic():
                    for item_data in items_data:
                        producto_id = item_data.get("producto")
                        granizado_id = item_data.get("granizado")
                        cantidad_req = int(item_data.get("cantidad", 1))

                        if producto_id:
                            producto = ProductoModelo.objects.select_for_update().get(id=producto_id)

                            if producto.existencias < cantidad_req:
                                raise ValidationError(
                                    f"Lamentablemente, el producto '{producto.nombre}' ya no cuenta con el stock solicitado. Por favor, ajusta tu carrito."
                                )

                            # Decrementar
                            producto.existencias -= cantidad_req

                            producto.save()
                        elif granizado_id:
                            Granizado.objects.get(id=granizado_id)
                        else:
                            raise ValidationError(
                                "Cada item debe tener exactamente un producto o un granizado."
                            )

                    # Si todo bien, guardamos el pedido
                    pedido = serializer.save()

                    # 4. Crear Soporte de Pago if Transferencia
                    if metodo_pago == "TRANSFERENCIA" and comprobante:
                        SoportePago.objects.create(
                            pedido=pedido, comprobante=comprobante, estado="PENDIENTE"
                        )

                    return Response(
                        {"exito": True, "msg": "Pedido creado con éxito", "pedido_id": pedido.id},
                        status=status.HTTP_201_CREATED,
                    )
            except ValidationError as ve:
                return Response(
                    {"error": ve.detail[0] if isinstance(ve.detail, list) else str(ve.detail)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception:
                return Response(
                    {"error": "Error procesando inventario."}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidarCarritoView(APIView):
    """
    Endpoint para que el Frontend valide el carrito antes de obligar al usuario a llenar datos.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        from granizados.infraestructura.models import Granizado
        from inventario.infraestructura.models import ProductoModelo

        items = _normalizar_items_carrito(request.data.get("items", []))

        for item in items:
            if not isinstance(item, dict):
                return Response(
                    {"error": "Formato de item inválido."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            prod_id = item.get("producto")
            granizado_id = item.get("granizado")
            cantidad = int(item.get("cantidad", 1))
            try:
                if prod_id:
                    prod = ProductoModelo.objects.get(id=prod_id)
                    if prod.existencias < cantidad:
                        return Response(
                            {
                                "error": f"El producto '{prod.nombre}' se ha agotado o no tiene suficiente stock."
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                elif granizado_id:
                    Granizado.objects.get(id=granizado_id)
                else:
                    return Response(
                        {"error": "Cada item debe tener exactamente un producto o un granizado."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ProductoModelo.DoesNotExist:
                return Response(
                    {"error": "Un producto de tu carrito ya no existe."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Granizado.DoesNotExist:
                return Response(
                    {"error": "Un granizado de tu carrito ya no existe."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response({"exito": True}, status=status.HTTP_200_OK)

class ListarMisPedidosView(APIView):
    """
    Listar los pedidos del cliente actual.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        pedidos = Pedido.objects.filter(cliente=request.user)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarTodosPedidosView(APIView):
    """
    Módulo Administrativo: Listar todos los pedidos.
    """

    permission_classes = [AllowAny]  # Temporal, idealmente IsAdminUser

    def get(self, request):
        pedidos = Pedido.objects.all().order_by("-creado_en")
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GestionarPagoPedidoView(APIView):
    """
    Módulo Administrativo: Aprobar o Rechazar un pago.
    """

    permission_classes = [AllowAny]  # Temporal

    def post(self, request):
        pedido_id = request.data.get("pedido_id")
        accion = request.data.get("accion")  # 'aprobar' o 'rechazar'
        motivo = request.data.get("motivo", "")

        try:
            pedido = Pedido.objects.get(id=pedido_id)
            soporte = getattr(pedido, "soporte_pago", None)

            if accion == "aprobar":
                pedido.estado = "PAGO_VERIFICADO"
                if soporte:
                    soporte.estado = "VERIFICADO"
                    soporte.save()
            elif accion == "rechazar":
                pedido.estado = "PAGO_RECHAZADO"
                if soporte:
                    soporte.estado = "RECHAZADO"
                    soporte.motivo_rechazo = motivo
                    soporte.save()

            pedido.save()
            return Response({"exito": True, "estado_nuevo": pedido.estado})
        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
