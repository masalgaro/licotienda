from rest_framework import serializers

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaModelo
        fields = ["id", "nombre"]


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source="categoria.nombre")
    imagen = serializers.SerializerMethodField()

    def get_imagen(self, obj):
        if not obj.imagen:
            return None
        name = obj.imagen.name if hasattr(obj.imagen, 'name') else str(obj.imagen)
        if name.startswith('/'):
            return name
        return f'/{name}'

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
