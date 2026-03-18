from django.db import models
from usuarios.infraestructura.models import Cliente

class SoportePago(models.Model):
    """
    HU 6 - Enviar Soporte de Pago.
    Permite que un cliente envíe el comprobante de transferencia.
    """
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='soportes_pago'
    )
    telefono_remitente = models.CharField(max_length=20)
    comprobante_url = models.URLField(max_length=500, help_text="URL de la imagen del comprobante en Supabase")
    notas = models.TextField(blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Pendiente', 'Pendiente'),
            ('Aprobado', 'Aprobado'),
            ('Rechazado', 'Rechazado')
        ],
        default='Pendiente'
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Soporte de Pago'
        verbose_name_plural = 'Soportes de Pago'
        ordering = ['-creado_en']

    def __str__(self):
        return f"Pago [{self.telefono_remitente}] - {self.creado_en.strftime('%d/%m/%Y')}"


class InfoContacto(models.Model):
    """
    HU 12 - Mostrar Contactos y Redes Sociales.
    Alberga los links a redes sociales y chat de WhatsApp.
    """
    nombre_tienda = models.CharField(max_length=200, default='LaLico')
    telefono = models.CharField(max_length=20)
    whatsapp_link = models.URLField(blank=True, null=True, help_text="Link directo al chat de WhatsApp")
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    direccion = models.TextField()
    horario = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'Info de Contacto y Redes'
        verbose_name_plural = 'Info de Contacto y Redes'

    def __str__(self):
        return f"Configuración de Contacto - {self.nombre_tienda}"
