from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo

from .serializers import CategoriaSerializer, ProductoSerializer


class ListarProductosView(APIView):
    """
    Endpoint: GET /api/v1/catalogo/productos/
    Listar productos activos, opcionalmente filtrados por buscador.
    HU 1: Listar Productos.
    HU 2: Buscar Nombre Producto.
    """

    def get(self, request):
        query = request.query_params.get("q", "")
        categoria_id = request.query_params.get("categoria", None)
        en_oferta = request.query_params.get("en_oferta")

        productos = ProductoModelo.objects.filter(esta_activo=True)

        if query:
            productos = productos.filter(
                Q(nombre__icontains=query) | Q(descripcion__icontains=query)
            )

        if categoria_id:
            productos = productos.filter(categoria_id=categoria_id)

        if en_oferta is not None:
            en_oferta_normalizado = en_oferta.strip().lower()
            if en_oferta_normalizado in {"true", "false"}:
                productos = productos.filter(en_oferta=en_oferta_normalizado == "true")

        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarCategoriasView(APIView):
    """
    Listar todas las categorías disponibles.
    """

    def get(self, request):
        categorias = CategoriaModelo.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
