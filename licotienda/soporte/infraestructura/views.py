from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MensajeSoporteSerializer, InfoContactoSerializer
from ..aplicacion.servicios import enviar_mensaje_soporte, obtener_info_contacto

class EnviarSoporteView(APIView):
    """
    HU 6 - Enviar Soporte.
    Endpoint: POST /api/v1/soporte/mensajes/
    Público. El cliente envía su teléfono, asunto y cuerpo del mensaje.
    """
    def post(self, request):
        telefono = request.data.get('telefono')
        asunto = request.data.get('asunto')
        cuerpo = request.data.get('cuerpo')

        if not all([telefono, asunto, cuerpo]):
            return Response(
                {'error': 'Teléfono, asunto y cuerpo son requeridos.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        mensaje = enviar_mensaje_soporte(telefono=telefono, asunto=asunto, cuerpo=cuerpo)
        serializer = MensajeSoporteSerializer(mensaje)
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
