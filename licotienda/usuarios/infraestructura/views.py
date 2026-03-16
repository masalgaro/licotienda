from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ClienteSerializer
from ..aplicacion.servicios import buscar_cliente_por_telefono, guardar_o_actualizar_cliente

class CheckoutLookupView(APIView):
    """
    Endpoint: POST /api/v1/usuarios/checkout-lookup/
    Recibe un 'telefono' y busca si el cliente existe.
    Retorna 200 OK con los datos del cliente y sus direcciones si existe.
    Retorna 404 si es un cliente nuevo.
    """
    def post(self, request):
        telefono = request.data.get('telefono')
        
        if not telefono:
            return Response({'error': 'El teléfono es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        cliente = buscar_cliente_por_telefono(telefono)
        
        if cliente:
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Cliente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class CheckoutSaveView(APIView):
    """
    Endpoint: POST /api/v1/usuarios/checkout-save/
    Recibe 'telefono', 'nombre', 'direccion' y opcionalmente 'observaciones'.
    Guarda el nuevo cliente o actualiza el existente, y registra la dirección en su historial.
    """
    def post(self, request):
        telefono = request.data.get('telefono')
        nombre = request.data.get('nombre')
        direccion = request.data.get('direccion')
        observaciones = request.data.get('observaciones', '')

        if not all([telefono, nombre, direccion]):
            return Response(
                {'error': 'Teléfono, nombre y dirección son campos requeridos.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Usar el servicio de la capa de aplicación
        cliente, obj_direccion = guardar_o_actualizar_cliente(
            telefono=telefono,
            nombre=nombre,
            direccion_texto=direccion,
            observaciones=observaciones
        )

        # Devolver el cliente actualizado completo con sus direcciones
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
