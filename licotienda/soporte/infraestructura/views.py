from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SoportePagoSerializer, InfoContactoSerializer
from ..aplicacion.servicios import registrar_soporte_pago, obtener_info_contacto

class RegistrarSoportePagoView(APIView):
    """
    HU 6 - Enviar Soporte de Pago.
    Endpoint: POST /api/v1/soporte/mensajes/
    Público. El cliente envía su teléfono y la URL del comprobante de pago.
    """
    def post(self, request):
        telefono = request.data.get('telefono')
        comprobante_url = request.data.get('comprobante_url')
        notas = request.data.get('notas', '')

        if not all([telefono, comprobante_url]):
            return Response(
                {'error': 'Teléfono y comprobante_url son requeridos.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        soporte = registrar_soporte_pago(
            telefono=telefono,
            comprobante_url=comprobante_url,
            notas=notas
        )
        serializer = SoportePagoSerializer(soporte)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InfoContactoView(APIView):
    """
    HU 12 - Mostrar Contacto.
    Endpoint: GET /api/v1/soporte/contacto/
    Público. Retorna la información de contacto de la tienda.
    """
    def get(self, request):
        info = obtener_info_contacto()
        if not info:
            return Response(
                {'detail': 'Información de contacto no configurada aún.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = InfoContactoSerializer(info)
        return Response(serializer.data, status=status.HTTP_200_OK)
