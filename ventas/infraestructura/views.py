from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PedidoSerializer
from .models import Pedido
from usuarios.infraestructura.models import Usuario, UsuarioDireccion
import re

from soporte.infraestructura.models import SoportePago

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
        comprobante = request.FILES.get('comprobante')
        
        items_json = data.get('items')
        # Si items viene como string (por FormData), parseamos JSON
        import json
        if isinstance(items_json, str):
            try: items_data = json.loads(items_json)
            except: items_data = []
        else:
            items_data = items_json or []
            
        telefono_raw = data.get('telefono')
        nombres = data.get('nombres', '')
        apellidos = data.get('apellidos', '')
        direccion = data.get('direccion', '')
        recordar = data.get('recordar_direccion') == 'true' or data.get('recordar_direccion') is True
        metodo_pago = data.get('metodo_pago', 'EFECTIVO').upper()

        if not items_data or not telefono_raw:
            return Response({"error": "Datos incompletos"}, status=status.HTTP_400_BAD_REQUEST)
        
        if metodo_pago == 'TRANSFERENCIA' and not comprobante:
            return Response({"error": "Debe adjuntar el comprobante de pago para transferencias"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Identificar o Crear Usuario
        tel_limpio = re.sub(r'\D', '', telefono_raw)
        usuario = Usuario.objects.filter(telefono__icontains=tel_limpio).first()
        
        if not usuario:
            usuario = Usuario.objects.create_user(
                username=f"user_{tel_limpio}_{Usuario.objects.count()}",
                telefono=tel_limpio,
                first_name=nombres,
                last_name=apellidos
            )
        else:
            if nombres: usuario.first_name = nombres
            if apellidos: usuario.last_name = apellidos
            usuario.save()

        # 2. Dirección
        if recordar and direccion:
            UsuarioDireccion.objects.get_or_create(usuario=usuario, direccion=direccion, defaults={'es_predeterminada': True})
            usuario.direccion_base = direccion
            usuario.save()

        # 3. Serializar y Guardar Pedido
        # Adaptamos data para el serializer
        data['cliente'] = usuario.id
        data['items'] = items_data
        data['estado'] = 'PAGO_SUBIDO' if metodo_pago == 'TRANSFERENCIA' else 'PENDIENTE_PAGO'
        data['metodo_pago'] = metodo_pago
        
        serializer = PedidoSerializer(data=data)
        if serializer.is_valid():
            pedido = serializer.save()
            
            # 4. Crear Soporte de Pago if Transferencia
            if metodo_pago == 'TRANSFERENCIA' and comprobante:
                SoportePago.objects.create(
                    pedido=pedido,
                    comprobante=comprobante,
                    estado='PENDIENTE'
                )
            
            return Response({
                "exito": True,
                "msg": "Pedido creado con éxito",
                "pedido_id": pedido.id
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

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
    permission_classes = [AllowAny] # Temporal, idealmente IsAdminUser

    def get(self, request):
        pedidos = Pedido.objects.all().order_by("-creado_en")
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GestionarPagoPedidoView(APIView):
    """
    Módulo Administrativo: Aprobar o Rechazar un pago.
    """
    permission_classes = [AllowAny] # Temporal

    def post(self, request):
        pedido_id = request.data.get('pedido_id')
        accion = request.data.get('accion') # 'aprobar' o 'rechazar'
        motivo = request.data.get('motivo', '')

        try:
            pedido = Pedido.objects.get(id=pedido_id)
            soporte = getattr(pedido, 'soporte_pago', None)

            if accion == 'aprobar':
                pedido.estado = 'PAGO_VERIFICADO'
                if soporte:
                    soporte.estado = 'VERIFICADO'
                    soporte.save()
            elif accion == 'rechazar':
                pedido.estado = 'PAGO_RECHAZADO'
                if soporte:
                    soporte.estado = 'RECHAZADO'
                    soporte.motivo_rechazo = motivo
                    soporte.save()
            
            pedido.save()
            return Response({"exito": True, "estado_nuevo": pedido.estado})
        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
