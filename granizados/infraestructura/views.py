from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingrediente
from .serializers import (
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
