from django.db import models
from usuarios.infraestructura.models import Cliente

class MensajeSoporte(models.Model):
    """
    HU 6 - Enviar Soporte.
    Permite que un cliente envíe un mensaje a la tienda.
    """
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='mensajes_soporte'
    )
    # Teléfono de respaldo por si el cliente no existe en BD
    telefono_remitente = models.CharField(max_length=20)
    asunto = models.CharField(max_length=255)
    cuerpo = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Mensaje de Soporte'
        verbose_name_plural = 'Mensajes de Soporte'
        ordering = ['-creado_en']

    def __str__(self):
        return f"[{self.telefono_remitente}] {self.asunto}"


class InfoContacto(models.Model):
    """
    HU 12 - Mostrar Contacto.
    Modelo Singleton con la información de contacto de la tienda.
    Solo debe existir un registro. El admin lo edita desde el panel.
    """
    nombre_tienda = models.CharField(max_length=200, default='LaLico')
    telefono = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    direccion = models.TextField()
    horario = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'Info de Contacto'
        verbose_name_plural = 'Info de Contacto'

    def __str__(self):
        return f"Contacto - {self.nombre_tienda}"
