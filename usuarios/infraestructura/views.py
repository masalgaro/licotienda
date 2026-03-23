from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Usuario
from .serializers import UsuarioSerializer


class MiPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BuscarUsuarioPorTelefonoView(APIView):
    """
    Busca un usuario por su número de teléfono para autocompletar el checkout.
    Incluye la lista de direcciones registradas.
    """

    def get(self, request):
        telefono = request.query_params.get("telefono")
        if not telefono:
            return Response(
                {"error": "Teléfono no proporcionado"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Limpiamos el teléfono de caracteres no numéricos
            import re

            tel_limpio = re.sub(r"\D", "", telefono)

            # Busqueda flexible
            usuario = Usuario.objects.filter(telefono__icontains=tel_limpio).first()
            if usuario:
                # Obtenemos sus direcciones
                direcciones = list(
                    usuario.direcciones.order_by(
                        "-es_predeterminada", "-fecha_creacion"
                    ).values_list("direccion", flat=True)
                )

                # Si no tiene direcciones en la tabla UsuarioDireccion pero tiene direccion_base, la agregamos
                if not direcciones and usuario.direccion_base:
                    direcciones = [usuario.direccion_base]

                return Response(
                    {
                        "encontrado": True,
                        "nombre": usuario.first_name,
                        "apellido": usuario.last_name,
                        "direcciones": direcciones,
                        "telefono": usuario.telefono,
                    }
                )
            else:
                return Response({"encontrado": False})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
