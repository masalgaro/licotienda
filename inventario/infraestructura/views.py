from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CategoriaModelo, ProductoModelo
from .serializers import CategoriaInventarioSerializer, ProductoInventarioSerializer


class InventarioProductoListCreateView(APIView):
    """
    HU 7: Agregar Producto Inventario (Admin).
    Listar todos los productos (incluyendo inactivos) para administración.
    """

    permission_classes = [AllowAny]  # Simplificado para pruebas

    def get(self, request):
        productos = ProductoModelo.objects.all().order_by("-id")
        serializer = ProductoInventarioSerializer(productos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductoInventarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InventarioProductoDetailView(APIView):
    """
    HU 8: Eliminar Producto Inventario (Admin).
    HU 9: Editar Cantidad de Producto Inventario (Admin).
    HU 10: Marcar Producto Agotado (Admin).
    """

    permission_classes = [AllowAny]  # Simplificado para pruebas

    def get_object(self, pk):
        try:
            return ProductoModelo.objects.get(pk=pk)
        except ProductoModelo.DoesNotExist:
            return None

    def get(self, request, pk):
        producto = self.get_object(pk)
        if not producto:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductoInventarioSerializer(producto)
        return Response(serializer.data)

    def put(self, request, pk):
        producto = self.get_object(pk)
        if not producto:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoInventarioSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        from django.db.models import ProtectedError

        producto = self.get_object(pk)
        if not producto:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            producto.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar porque tiene pedidos asociados."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class InventarioCategoriaListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categorias = CategoriaModelo.objects.all()
        serializer = CategoriaInventarioSerializer(categorias, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategoriaInventarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InventarioCategoriaDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return CategoriaModelo.objects.get(pk=pk)
        except CategoriaModelo.DoesNotExist:
            return None

    def put(self, request, pk):
        categoria = self.get_object(pk)
        if not categoria:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CategoriaInventarioSerializer(categoria, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        from django.db.models import ProtectedError

        categoria = self.get_object(pk)
        if not categoria:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            categoria.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {
                    "error": f"No se puede eliminar la categoría '{categoria.nombre}' porque tiene productos asociados. Reasigna los productos primero."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
