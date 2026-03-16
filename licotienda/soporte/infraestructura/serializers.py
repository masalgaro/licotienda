from rest_framework import serializers
from .models import MensajeSoporte, InfoContacto

class MensajeSoporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MensajeSoporte
        fields = ['id', 'telefono_remitente', 'asunto', 'cuerpo', 'creado_en']
        read_only_fields = ['id', 'creado_en']

class InfoContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoContacto
        fields = ['nombre_tienda', 'telefono', 'whatsapp', 'email', 'direccion', 'horario']
