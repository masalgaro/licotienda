from django.db import transaction
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
        en_oferta = request.query_params.get("en_oferta")
        productos = ProductoModelo.objects.all().order_by("-id")

        if en_oferta is not None:
            en_oferta_normalizado = en_oferta.strip().lower()
            if en_oferta_normalizado in {"true", "false"}:
                productos = productos.filter(en_oferta=en_oferta_normalizado == "true")

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


class SurtirInventarioView(APIView):
    """
    HU-26: Surtir inventario en bulk.
    POST /api/v1/inventario/surtir/
    Body: {"items": [{"producto_id": 1, "cantidad_adicional": 10}, ...]}
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from .serializers import SurtirBulkSerializer

        serializer = SurtirBulkSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        items = serializer.validated_data["items"]
        resultados = []

        with transaction.atomic():
            ids = [item["producto_id"] for item in items]
            productos = {
                p.pk: p
                for p in ProductoModelo.objects.select_for_update().filter(pk__in=ids)
            }
            for item in items:
                producto = productos[item["producto_id"]]
                producto.existencias += item["cantidad_adicional"]
                if producto.existencias > 0:
                    producto.esta_activo = True
                producto.save(update_fields=["existencias", "esta_activo"])
                resultados.append({
                    "producto_id": producto.pk,
                    "nombre": producto.nombre,
                    "existencias_nuevas": producto.existencias,
                })

        return Response({"actualizados": resultados}, status=status.HTTP_200_OK)
