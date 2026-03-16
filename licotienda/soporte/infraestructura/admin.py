from django.contrib import admin
from .models import MensajeSoporte, InfoContacto

@admin.register(MensajeSoporte)
class MensajeSoporteAdmin(admin.ModelAdmin):
    list_display = ('telefono_remitente', 'asunto', 'creado_en')
    list_filter = ('creado_en',)
    search_fields = ('telefono_remitente', 'asunto', 'cuerpo')
    readonly_fields = ('creado_en',)

@admin.register(InfoContacto)
class InfoContactoAdmin(admin.ModelAdmin):
    list_display = ('nombre_tienda', 'telefono', 'email')
    
    def has_add_permission(self, request):
        # Solo permitir un registro (Singleton)
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
