from rest_framework import serializers

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaModelo
        fields = ["id", "nombre"]


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source="categoria.nombre")

    class Meta:
        model = ProductoModelo
        fields = [
            "id",
            "nombre",
            "precio",
            "descripcion",
            "imagen",
            "categoria",
            "categoria_nombre",
            "esta_activo",
            "existencias",
            "en_oferta",
            "descuento_porcentaje",
        ]
