from rest_framework import serializers
from .models import SoportePago, InfoContacto

class SoportePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoportePago
        fields = ['id', 'telefono_remitente', 'comprobante_url', 'notas', 'creado_en']
        read_only_fields = ['id', 'creado_en']

class InfoContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoContacto
        fields = ['nombre_tienda', 'telefono', 'whatsapp_link', 'facebook_url', 'instagram_url', 'email', 'direccion', 'horario']
