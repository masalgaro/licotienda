from django.contrib import admin
from .models import SoportePago, InfoContacto

@admin.register(SoportePago)
class SoportePagoAdmin(admin.ModelAdmin):
    list_display = ('telefono_remitente', 'creado_en')
    list_filter = ('creado_en',)
    search_fields = ('telefono_remitente', 'notas')
    readonly_fields = ('creado_en',)

@admin.register(InfoContacto)
class InfoContactoAdmin(admin.ModelAdmin):
    list_display = ('nombre_tienda', 'telefono', 'whatsapp_link', 'email')
    
    def has_add_permission(self, request):
        # Solo permitir un registro (Singleton)
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
