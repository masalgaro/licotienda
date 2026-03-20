from rest_framework import serializers
from inventario.infraestructura.models import ProductoModelo, CategoriaModelo

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaModelo
        fields = ['id', 'nombre']

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = ProductoModelo
        fields = ['id', 'nombre', 'precio', 'descripcion', 'imagen_url', 'categoria', 'categoria_nombre', 'esta_activo']
