from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UsuarioAdministrador, Cliente, DireccionCliente

class DireccionInline(admin.TabularInline):
    model = DireccionCliente
    extra = 0

@admin.register(UsuarioAdministrador)
class UsuarioAdministradorAdmin(UserAdmin):
    list_display = ('username', 'email', 'rol', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Información de Rol', {'fields': ('rol',)}),
    )

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('telefono', 'nombre', 'creado_en')
    search_fields = ('telefono', 'nombre')
    inlines = [DireccionInline]

@admin.register(DireccionCliente)
class DireccionClienteAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'direccion', 'creado_en')
    list_filter = ('creado_en',)
    search_fields = ('cliente__telefono', 'cliente__nombre', 'direccion')
