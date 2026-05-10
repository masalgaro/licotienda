from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingrediente
from .serializers import (
    AdminIngredienteSerializer,
    AgregarGranizadoCarritoSerializer,
    CrearGranizadoSerializer,
    GranizadoSerializer,
    IngredienteSerializer,
    construir_item_carrito,
)


class ListarIngredientesDisponiblesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        agrupados = {categoria: [] for categoria, _ in Ingrediente.CATEGORIAS}
        ingredientes = Ingrediente.objects.filter(disponible=True).order_by("categoria", "nombre")

        for ingrediente in ingredientes:
            agrupados[ingrediente.categoria].append(IngredienteSerializer(ingrediente).data)

        return Response(agrupados, status=status.HTTP_200_OK)


class CrearGranizadoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CrearGranizadoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        granizado = serializer.save()
        return Response(GranizadoSerializer(granizado).data, status=status.HTTP_201_CREATED)


class AgregarGranizadoCarritoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AgregarGranizadoCarritoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        granizado = serializer.validated_data["granizado_id"]
        return Response(construir_item_carrito(granizado), status=status.HTTP_200_OK)


class AdminIngredientesView(APIView):
    """Admin: listar todos los ingredientes (incluye no disponibles) y crear nuevos."""

    permission_classes = [AllowAny]

    def get(self, request):
        ingredientes = Ingrediente.objects.all().order_by("categoria", "nombre")
        return Response(AdminIngredienteSerializer(ingredientes, many=True).data)

    def post(self, request):
        serializer = AdminIngredienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminIngredienteDetalleView(APIView):
    """Admin: editar o eliminar un ingrediente por ID."""

    permission_classes = [AllowAny]

    def _get_object(self, pk):
        try:
            return Ingrediente.objects.get(pk=pk)
        except Ingrediente.DoesNotExist:
            return None

    def patch(self, request, pk):
        ingrediente = self._get_object(pk)
        if not ingrediente:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AdminIngredienteSerializer(ingrediente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        ingrediente = self._get_object(pk)
        if not ingrediente:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ingrediente.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
