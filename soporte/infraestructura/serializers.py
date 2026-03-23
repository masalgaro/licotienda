from rest_framework import serializers

from .models import InfoContacto, SoportePago


class InfoContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoContacto
        fields = "__all__"


class SoportePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoportePago
        fields = "__all__"
