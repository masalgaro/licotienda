from django.contrib import admin

from .models import CarritoCompraModelo, ComprobantePagoModelo, ItemCarritoModelo, ItemPedidoModelo, PedidoModelo


class ItemCarritoInline(admin.TabularInline):
    model = ItemCarritoModelo
    extra = 0


@admin.register(CarritoCompraModelo)
class CarritoCompraAdmin(admin.ModelAdmin):
    list_display = ('token_publico', 'estado', 'creado_en')
    list_filter = ('estado',)
    search_fields = ('token_publico',)
    inlines = [ItemCarritoInline]


class ItemPedidoInline(admin.TabularInline):
    model = ItemPedidoModelo
    extra = 0
    readonly_fields = ('producto_id', 'nombre_producto', 'precio_unitario', 'cantidad', 'subtotal_linea')


@admin.register(PedidoModelo)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'token_publico', 'cliente_telefono', 'estado', 'total', 'reservado_hasta', 'creado_en')
    list_filter = ('estado',)
    search_fields = ('token_publico', 'cliente_telefono', 'nombre_cliente')
    readonly_fields = ('creado_en', 'actualizado_en')
    inlines = [ItemPedidoInline]


@admin.register(ComprobantePagoModelo)
class ComprobantePagoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'estado_validacion', 'subido_en', 'validado_en')
    list_filter = ('estado_validacion',)
    search_fields = ('pedido__token_publico', 'ruta_archivo')
