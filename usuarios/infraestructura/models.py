from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    es_cliente = models.BooleanField(default=True)
    es_administrador = models.BooleanField(default=False)
    telefono = models.CharField(max_length=40, unique=True, blank=True, null=True)
    direccion_base = models.CharField(max_length=220, blank=True)
    notas = models.TextField(blank=True)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.username


class UsuarioDireccion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="direcciones")
    direccion = models.CharField(max_length=255)
    es_predeterminada = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Dirección de Usuario"
        verbose_name_plural = "Direcciones de Usuario"

    def __str__(self):
        return f"{self.usuario.username} - {self.direccion}"
