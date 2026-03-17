from rest_framework import serializers

from ..dominio.entidades import EstadoPedido


class CrearCarritoSalidaSerializer(serializers.Serializer):
    token_carrito = serializers.UUIDField()
    estado = serializers.CharField()


class AgregarProductoCarritoEntradaSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField(min_value=1)
    cantidad = serializers.IntegerField(min_value=1)


class ItemCarritoDetalleSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    nombre_producto = serializers.CharField()
    cantidad = serializers.IntegerField()
    precio_unitario = serializers.DecimalField(max_digits=12, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)
    activo = serializers.BooleanField()
    agotado_manual = serializers.BooleanField()


class CarritoDetalleSerializer(serializers.Serializer):
    token_carrito = serializers.UUIDField()
    estado = serializers.CharField()
    items = ItemCarritoDetalleSerializer(many=True)
    total_items = serializers.IntegerField()
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)


class ConfirmarPedidoEntradaSerializer(serializers.Serializer):
    telefono = serializers.CharField(max_length=20)
    nombre = serializers.CharField(max_length=200)
    direccion = serializers.CharField()
    observaciones = serializers.CharField(required=False, allow_blank=True, default='')


class PedidoEstadoSerializer(serializers.Serializer):
    pedido_id = serializers.IntegerField()
    token_pedido = serializers.UUIDField()
    estado = serializers.CharField()
    reservado_hasta = serializers.DateTimeField(allow_null=True)
    tiene_comprobante = serializers.BooleanField()


class SubirComprobanteEntradaSerializer(serializers.Serializer):
    archivo = serializers.FileField()
    notas = serializers.CharField(required=False, allow_blank=True, default='')


class ListarPedidosAdminQuerySerializer(serializers.Serializer):
    estado = serializers.ChoiceField(
        choices=[estado.value for estado in EstadoPedido],
        required=False,
        allow_null=True,
    )


class PedidoAdminResumenSerializer(serializers.Serializer):
    pedido_id = serializers.IntegerField()
    token_pedido = serializers.UUIDField()
    cliente_telefono = serializers.CharField()
    nombre_cliente = serializers.CharField()
    estado = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)
    reservado_hasta = serializers.DateTimeField(allow_null=True)
    creado_en = serializers.DateTimeField(allow_null=True)


class ItemPedidoDetalleSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    nombre_producto = serializers.CharField()
    precio_unitario = serializers.DecimalField(max_digits=12, decimal_places=2)
    cantidad = serializers.IntegerField()
    subtotal_linea = serializers.DecimalField(max_digits=12, decimal_places=2)


class ComprobanteAdminDetalleSerializer(serializers.Serializer):
    estado_validacion = serializers.CharField()
    notas_cliente = serializers.CharField()
    motivo_rechazo = serializers.CharField()
    url_descarga = serializers.CharField(allow_null=True)
    subido_en = serializers.DateTimeField(allow_null=True)
    validado_en = serializers.DateTimeField(allow_null=True)
    administrador_validador_id = serializers.IntegerField(allow_null=True)


class PedidoAdminDetalleSerializer(PedidoAdminResumenSerializer):
    direccion_entrega = serializers.CharField()
    observaciones_entrega = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)
    items = ItemPedidoDetalleSerializer(many=True)
    comprobante = ComprobanteAdminDetalleSerializer(allow_null=True)


class RechazarComprobanteEntradaSerializer(serializers.Serializer):
    motivo_rechazo = serializers.CharField()
