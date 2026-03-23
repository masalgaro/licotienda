from rest_framework import serializers

from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "telefono",
            "direccion_base",
            "es_cliente",
            "es_administrador",
        ]
