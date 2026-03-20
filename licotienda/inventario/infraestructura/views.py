from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import ProductoModelo, CategoriaModelo
from .serializers import ProductoInventarioSerializer, CategoriaInventarioSerializer

class InventarioProductoListCreateView(APIView):
    """
    HU 7: Agregar Producto Inventario (Admin).
    Listar todos los productos (incluyendo inactivos) para administración.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        productos = ProductoModelo.objects.all()
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
    permission_classes = [IsAdminUser]

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
        producto = self.get_object(pk)
        if not producto:
            return Response(status=status.HTTP_404_NOT_FOUND)
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InventarioCategoriaListCreateView(APIView):
    permission_classes = [IsAdminUser]

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
