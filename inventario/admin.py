from django.contrib import admin
from .infraestructura.models import ProductoModelo, CategoriaModelo

@admin.register(ProductoModelo)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'categoria', 'esta_activo')
    list_filter = ('categoria', 'esta_activo')
    search_fields = ('nombre', 'descripcion')

@admin.register(CategoriaModelo)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
