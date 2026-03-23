from django.db import models
from django.conf import settings

class InfoContacto(models.Model):
    whatsapp_url = models.URLField(max_length=300, blank=True)
    instagram_url = models.URLField(max_length=300, blank=True)
    facebook_url = models.URLField(max_length=300, blank=True)
    
    class Meta:
        verbose_name = "Información de Contacto"
        verbose_name_plural = "Información de Contactos"

    def __str__(self):
        return "Información de Contacto Oficial"

class SoportePago(models.Model):
    pedido = models.OneToOneField('ventas.Pedido', on_delete=models.CASCADE, related_name='soporte_pago', null=True)
    comprobante = models.ImageField(upload_to='comprobantes/', null=True, blank=True)
    estado = models.CharField(
        max_length=20, 
        choices=[('PENDIENTE', 'Pendiente'), ('VERIFICADO', 'Verificado'), ('RECHAZADO', 'Rechazado')],
        default='PENDIENTE'
    )
    motivo_rechazo = models.TextField(blank=True)
    subido_en = models.DateTimeField(auto_now_add=True)
    verificado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = "Soporte de Pago"
        verbose_name_plural = "Soportes de Pago"

    def __str__(self):
        return f"Soporte para {self.pedido} - {self.estado}"
