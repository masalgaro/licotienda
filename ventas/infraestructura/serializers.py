from rest_framework import serializers

from .models import ItemPedido, Pedido


class ItemPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.SerializerMethodField()
    granizado_nombre = serializers.SerializerMethodField()
    granizado_ingredientes = serializers.SerializerMethodField()
    tipo = serializers.SerializerMethodField()
    precio = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = ItemPedido
        fields = [
            "producto",
            "producto_nombre",
            "granizado",
            "granizado_nombre",
            "granizado_ingredientes",
            "tipo",
            "cantidad",
            "precio",
        ]
        extra_kwargs = {
            "producto": {"required": False, "allow_null": True},
            "granizado": {"required": False, "allow_null": True},
        }

    def get_producto_nombre(self, obj):
        if obj.producto:
            return obj.producto.nombre
        return None

    def get_granizado_nombre(self, obj):
        if obj.granizado:
            tipo = "con alcohol" if obj.granizado.tiene_alcohol else "sin alcohol"
            return f"Granizado {tipo}"
        return None

    def get_granizado_ingredientes(self, obj):
        if not obj.granizado:
            return []
        return [
            {
                "id": ingrediente.id,
                "nombre": ingrediente.nombre,
                "categoria": ingrediente.categoria,
                "precio_adicional": ingrediente.precio_adicional,
            }
            for ingrediente in obj.granizado.ingredientes.all()
        ]

    def get_tipo(self, obj):
        if obj.granizado:
            return "granizado"
        return "producto"

    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError("La cantidad debe ser mayor a cero.")
        return value

    def validate(self, attrs):
        producto = attrs.get("producto")
        granizado = attrs.get("granizado")

        if bool(producto) == bool(granizado):
            raise serializers.ValidationError(
                "Cada item debe tener exactamente un producto o un granizado."
            )

        if granizado:
            attrs["precio"] = granizado.precio_total
        elif producto and attrs.get("precio") is None:
            attrs["precio"] = producto.precio

        return attrs


class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)
    total_productos = serializers.SerializerMethodField()
    final_total = serializers.SerializerMethodField()
    soporte_pago_url = serializers.SerializerMethodField()
    direccion = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = Pedido
        fields = [
            "id",
            "cliente",
            "estado",
            "metodo_pago",
            "domicilio",
            "costo_envio",
            "direccion",
            "notas",
            "creado_en",
            "items",
            "total_productos",
            "final_total",
            "soporte_pago_url",
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
        items_data = validated_data.pop("items")
        pedido = Pedido.objects.create(**validated_data)
        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        return pedido
