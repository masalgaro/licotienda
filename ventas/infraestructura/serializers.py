from rest_framework import serializers
from .models import Pedido, ItemPedido
from inventario.infraestructura.models import ProductoModelo

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['producto', 'cantidad', 'precio']

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)
    total_productos = serializers.SerializerMethodField()
    final_total = serializers.SerializerMethodField()
    soporte_pago_url = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente', 'estado', 'metodo_pago', 'costo_envio', 
            'direccion', 'notas', 'creado_en', 'items', 
            'total_productos', 'final_total', 'soporte_pago_url'
        ]

    def get_total_productos(self, obj):
        return sum(item.precio * item.cantidad for item in obj.items.all())

    def get_final_total(self, obj):
        return self.get_total_productos(obj) + (obj.costo_envio or 0)

    def get_soporte_pago_url(self, obj):
        try:
            soporte = obj.soporte_pago
            if soporte.comprobante:
                return soporte.comprobante.url
        except:
            pass
        return None

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        pedido = Pedido.objects.create(**validated_data)
        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        return pedido
