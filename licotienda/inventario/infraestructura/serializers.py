from rest_framework import serializers
from .models import ProductoModelo, CategoriaModelo

class ProductoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoModelo
        fields = '__all__'

class CategoriaInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaModelo
        fields = '__all__'
