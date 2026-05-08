from django.conf import settings
from django.db import models

from granizados.infraestructura.models import Granizado
from inventario.infraestructura.models import ProductoModelo


class Pedido(models.Model):
    ESTADOS = [
        ("PENDIENTE_PAGO", "Pendiente de Pago"),
        ("PAGO_SUBIDO", "Pago Subido"),
        ("PAGO_VERIFICADO", "Pago Verificado"),
        ("PAGO_RECHAZADO", "Pago Rechazado"),
        ("PREPARANDO", "Preparando"),
        ("DESPACHADO", "Despachado"),
    ]

    METODOS_PAGO = [
        ("EFECTIVO", "Efectivo"),
        ("TRANSFERENCIA", "Transferencia"),
    ]

    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="pedidos"
    )
    estado = models.CharField(max_length=20, choices=ESTADOS, default="PENDIENTE_PAGO")
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, default="EFECTIVO")
    costo_envio = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    direccion = models.TextField()
    notas = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def __str__(self):
        return f"Pedido {self.id} - {self.cliente}"


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(
        ProductoModelo, on_delete=models.PROTECT, null=True, blank=True
    )
    granizado = models.ForeignKey(Granizado, on_delete=models.PROTECT, null=True, blank=True)
    cantidad = models.PositiveIntegerField(default=1)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Item de Pedido"
        verbose_name_plural = "Items de Pedido"

    def __str__(self):
        if self.producto:
            return f"{self.cantidad}x {self.producto.nombre}"
        return f"{self.cantidad}x Granizado #{self.granizado_id}"
