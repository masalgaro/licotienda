import uuid

from django.db import models

from ..dominio.entidades import EstadoCarrito, EstadoPedido, EstadoValidacionComprobante


class CarritoCompraModelo(models.Model):
    token_publico = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    estado = models.CharField(
        max_length=20,
        choices=[(estado.value, estado.value) for estado in EstadoCarrito],
        default=EstadoCarrito.ABIERTO.value,
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Carrito de Compra'
        verbose_name_plural = 'Carritos de Compra'
        ordering = ['-creado_en']

    def __str__(self):
        return f'Carrito {self.token_publico}'


class ItemCarritoModelo(models.Model):
    carrito = models.ForeignKey(CarritoCompraModelo, on_delete=models.CASCADE, related_name='items')
    producto_id = models.PositiveBigIntegerField()
    cantidad = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Item de Carrito'
        verbose_name_plural = 'Items de Carrito'
        unique_together = ('carrito', 'producto_id')

    def __str__(self):
        return f'Producto {self.producto_id} x {self.cantidad}'


class PedidoModelo(models.Model):
    token_publico = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    cliente_telefono = models.CharField(max_length=20)
    nombre_cliente = models.CharField(max_length=200)
    direccion_entrega = models.TextField()
    observaciones_entrega = models.TextField(blank=True)
    estado = models.CharField(
        max_length=30,
        choices=[(estado.value, estado.value) for estado in EstadoPedido],
        default=EstadoPedido.PENDIENTE_COMPROBANTE.value,
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reservado_hasta = models.DateTimeField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-creado_en']

    def __str__(self):
        return f'Pedido {self.token_publico}'


class ItemPedidoModelo(models.Model):
    pedido = models.ForeignKey(PedidoModelo, on_delete=models.CASCADE, related_name='items')
    producto_id = models.PositiveBigIntegerField()
    nombre_producto = models.CharField(max_length=255)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    cantidad = models.PositiveIntegerField()
    subtotal_linea = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'Item de Pedido'
        verbose_name_plural = 'Items de Pedido'

    def __str__(self):
        return f'{self.nombre_producto} x {self.cantidad}'


class ComprobantePagoModelo(models.Model):
    pedido = models.OneToOneField(PedidoModelo, on_delete=models.CASCADE, related_name='comprobante')
    ruta_archivo = models.CharField(max_length=500)
    notas_cliente = models.TextField(blank=True)
    motivo_rechazo = models.TextField(blank=True)
    estado_validacion = models.CharField(
        max_length=20,
        choices=[(estado.value, estado.value) for estado in EstadoValidacionComprobante],
        default=EstadoValidacionComprobante.PENDIENTE.value,
    )
    subido_en = models.DateTimeField(null=True, blank=True)
    validado_en = models.DateTimeField(null=True, blank=True)
    administrador_validador_id = models.PositiveBigIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Comprobante de Pago'
        verbose_name_plural = 'Comprobantes de Pago'

    def __str__(self):
        return f'Comprobante {self.pedido_id}'
