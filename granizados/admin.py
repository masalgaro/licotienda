from django.contrib import admin

from .infraestructura.models import Granizado, Ingrediente


@admin.register(Ingrediente)
class IngredienteAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "precio_adicional", "disponible")
    list_filter = ("categoria", "disponible")
    search_fields = ("nombre",)


@admin.register(Granizado)
class GranizadoAdmin(admin.ModelAdmin):
    list_display = ("id", "tiene_alcohol", "precio_base", "precio_total", "creado_en")
    list_filter = ("tiene_alcohol",)
    filter_horizontal = ("ingredientes",)

# Register your models here.
