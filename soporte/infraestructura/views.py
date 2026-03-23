from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InfoContactoSerializer, SoportePagoSerializer
from .models import InfoContacto, SoportePago

class ContactoView(APIView):
    """
    HU 12: Contacto y Redes.
    """
    def get(self, request):
        info = InfoContacto.objects.first()
        if not info:
            return Response({"error": "No hay información de contacto configurada"}, status=status.HTTP_404_NOT_FOUND)
        serializer = InfoContactoSerializer(info)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SubirSoportePagoView(APIView):
    """
    HU 6: Soporte de Pago.
    """
    def post(self, request):
        serializer = SoportePagoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_RECOGNIZED)
