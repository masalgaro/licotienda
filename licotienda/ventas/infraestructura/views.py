from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from shared.permissions import EsAdministrador
from ventas.dominio.excepciones import (
    ConfiguracionInvalidaError,
    ConflictoNegocioError,
    OperacionNoPermitidaError,
    RecursoNoEncontradoError,
    ValidacionError,
)

from .dependencias import (
    crear_caso_uso_agregar_producto,
    crear_caso_uso_aprobar_comprobante,
    crear_caso_uso_confirmar_pedido,
    crear_caso_uso_consultar_carrito,
    crear_caso_uso_consultar_estado,
    crear_caso_uso_consultar_pedido_admin,
    crear_caso_uso_crear_carrito,
    crear_caso_uso_liberar_vencidos,
    crear_caso_uso_listar_pedidos_admin,
    crear_caso_uso_quitar_producto,
    crear_caso_uso_rechazar_comprobante,
    crear_caso_uso_subir_comprobante,
)
from .serializers import (
    AgregarProductoCarritoEntradaSerializer,
    CarritoDetalleSerializer,
    ConfirmarPedidoEntradaSerializer,
    CrearCarritoSalidaSerializer,
    ListarPedidosAdminQuerySerializer,
    PedidoAdminDetalleSerializer,
    PedidoAdminResumenSerializer,
    PedidoEstadoSerializer,
    RechazarComprobanteEntradaSerializer,
    SubirComprobanteEntradaSerializer,
)


class VistaBaseVentas(APIView):
    def responder_error(self, error):
        if isinstance(error, RecursoNoEncontradoError):
            return Response({'detail': str(error)}, status=status.HTTP_404_NOT_FOUND)
        if isinstance(error, ValidacionError):
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        if isinstance(error, (ConflictoNegocioError, OperacionNoPermitidaError)):
            return Response({'detail': str(error)}, status=status.HTTP_409_CONFLICT)
        if isinstance(error, ConfiguracionInvalidaError):
            return Response({'detail': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        raise error


class CrearCarritoView(VistaBaseVentas):
    def post(self, request):
        try:
            resultado = crear_caso_uso_crear_carrito().ejecutar()
        except Exception as error:
            return self.responder_error(error)
        serializer = CrearCarritoSalidaSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ConsultarCarritoView(VistaBaseVentas):
    def get(self, request, token_carrito):
        try:
            resultado = crear_caso_uso_consultar_carrito().ejecutar(str(token_carrito))
        except Exception as error:
            return self.responder_error(error)
        serializer = CarritoDetalleSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AgregarProductoCarritoView(VistaBaseVentas):
    def post(self, request, token_carrito):
        serializer_entrada = AgregarProductoCarritoEntradaSerializer(data=request.data)
        serializer_entrada.is_valid(raise_exception=True)

        try:
            resultado = crear_caso_uso_agregar_producto().ejecutar(
                token_carrito=str(token_carrito),
                producto_id=serializer_entrada.validated_data['producto_id'],
                cantidad=serializer_entrada.validated_data['cantidad'],
            )
        except Exception as error:
            return self.responder_error(error)

        serializer = CarritoDetalleSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuitarProductoCarritoView(VistaBaseVentas):
    def delete(self, request, token_carrito, producto_id):
        try:
            resultado = crear_caso_uso_quitar_producto().ejecutar(str(token_carrito), producto_id)
        except Exception as error:
            return self.responder_error(error)

        serializer = CarritoDetalleSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConfirmarPedidoView(VistaBaseVentas):
    def post(self, request, token_carrito):
        serializer_entrada = ConfirmarPedidoEntradaSerializer(data=request.data)
        serializer_entrada.is_valid(raise_exception=True)

        try:
            crear_caso_uso_liberar_vencidos().ejecutar()
            resultado = crear_caso_uso_confirmar_pedido().ejecutar(
                token_carrito=str(token_carrito),
                telefono=serializer_entrada.validated_data['telefono'],
                nombre=serializer_entrada.validated_data['nombre'],
                direccion=serializer_entrada.validated_data['direccion'],
                observaciones=serializer_entrada.validated_data['observaciones'],
            )
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoEstadoSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubirComprobantePagoView(VistaBaseVentas):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, token_pedido):
        serializer_entrada = SubirComprobanteEntradaSerializer(data=request.data)
        serializer_entrada.is_valid(raise_exception=True)

        try:
            resultado = crear_caso_uso_subir_comprobante().ejecutar(
                token_pedido=str(token_pedido),
                archivo=serializer_entrada.validated_data['archivo'],
                notas=serializer_entrada.validated_data['notas'],
            )
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoEstadoSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsultarEstadoPedidoView(VistaBaseVentas):
    def get(self, request, token_pedido):
        try:
            resultado = crear_caso_uso_consultar_estado().ejecutar(str(token_pedido))
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoEstadoSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarPedidosAdminView(VistaBaseVentas):
    permission_classes = [IsAuthenticated, EsAdministrador]

    def get(self, request):
        serializer_entrada = ListarPedidosAdminQuerySerializer(data=request.query_params)
        serializer_entrada.is_valid(raise_exception=True)

        try:
            crear_caso_uso_liberar_vencidos().ejecutar()
            resultado = crear_caso_uso_listar_pedidos_admin().ejecutar(serializer_entrada.validated_data.get('estado'))
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoAdminResumenSerializer(resultado, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsultarPedidoAdminView(VistaBaseVentas):
    permission_classes = [IsAuthenticated, EsAdministrador]

    def get(self, request, pedido_id):
        try:
            resultado = crear_caso_uso_consultar_pedido_admin().ejecutar(pedido_id)
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoAdminDetalleSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AprobarComprobantePagoView(VistaBaseVentas):
    permission_classes = [IsAuthenticated, EsAdministrador]

    def post(self, request, pedido_id):
        try:
            resultado = crear_caso_uso_aprobar_comprobante().ejecutar(pedido_id, request.user.id)
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoEstadoSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RechazarComprobantePagoView(VistaBaseVentas):
    permission_classes = [IsAuthenticated, EsAdministrador]

    def post(self, request, pedido_id):
        serializer_entrada = RechazarComprobanteEntradaSerializer(data=request.data)
        serializer_entrada.is_valid(raise_exception=True)

        try:
            resultado = crear_caso_uso_rechazar_comprobante().ejecutar(
                pedido_id=pedido_id,
                administrador_id=request.user.id,
                motivo_rechazo=serializer_entrada.validated_data['motivo_rechazo'],
            )
        except Exception as error:
            return self.responder_error(error)

        serializer = PedidoEstadoSerializer(resultado)
        return Response(serializer.data, status=status.HTTP_200_OK)
