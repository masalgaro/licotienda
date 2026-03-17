from django.urls import path

from .infraestructura.views import (
    AgregarProductoCarritoView,
    AprobarComprobantePagoView,
    ConfirmarPedidoView,
    ConsultarCarritoView,
    ConsultarEstadoPedidoView,
    ConsultarPedidoAdminView,
    CrearCarritoView,
    ListarPedidosAdminView,
    QuitarProductoCarritoView,
    RechazarComprobantePagoView,
    SubirComprobantePagoView,
)

urlpatterns = [
    path('carritos/', CrearCarritoView.as_view(), name='ventas_crear_carrito'),
    path('carritos/<uuid:token_carrito>/', ConsultarCarritoView.as_view(), name='ventas_consultar_carrito'),
    path('carritos/<uuid:token_carrito>/items/', AgregarProductoCarritoView.as_view(), name='ventas_agregar_producto_carrito'),
    path('carritos/<uuid:token_carrito>/items/<int:producto_id>/', QuitarProductoCarritoView.as_view(), name='ventas_quitar_producto_carrito'),
    path('carritos/<uuid:token_carrito>/confirmar/', ConfirmarPedidoView.as_view(), name='ventas_confirmar_pedido'),
    path('pedidos/<uuid:token_pedido>/comprobante/', SubirComprobantePagoView.as_view(), name='ventas_subir_comprobante'),
    path('pedidos/<uuid:token_pedido>/estado/', ConsultarEstadoPedidoView.as_view(), name='ventas_consultar_estado_pedido'),
    path('admin/pedidos/', ListarPedidosAdminView.as_view(), name='ventas_listar_pedidos_admin'),
    path('admin/pedidos/<int:pedido_id>/', ConsultarPedidoAdminView.as_view(), name='ventas_consultar_pedido_admin'),
    path('admin/pedidos/<int:pedido_id>/aprobar-comprobante/', AprobarComprobantePagoView.as_view(), name='ventas_aprobar_comprobante'),
    path('admin/pedidos/<int:pedido_id>/rechazar-comprobante/', RechazarComprobantePagoView.as_view(), name='ventas_rechazar_comprobante'),
]
