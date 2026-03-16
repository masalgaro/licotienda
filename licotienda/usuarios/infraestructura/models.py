from django.db import models
from django.contrib.auth.models import AbstractUser

class UsuarioAdministrador(AbstractUser):
    """
    Modelo de usuario para el panel de administración.
    Solo utilizado por el personal interno de la tienda.
    """
    rol = models.CharField(
        max_length=20,
        choices=[('admin', 'Administrador')],
        default='admin'
    )

    class Meta:
        verbose_name = 'Usuario Administrador'
        verbose_name_plural = 'Usuarios Administradores'


class Cliente(models.Model):
    """
    Modelo de cliente público que compra en la tienda.
    Identificado por su número de teléfono. No usa contraseñas.
    """
    telefono = models.CharField(max_length=20, primary_key=True)
    nombre = models.CharField(max_length=200)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nombre} - {self.telefono}"


class DireccionCliente(models.Model):
    """
    Historial de direcciones asociadas a un cliente.
    """
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='direcciones')
    direccion = models.TextField()
    observaciones = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Dirección de Cliente'
        verbose_name_plural = 'Direcciones de Clientes'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.direccion} ({self.cliente.telefono})"
