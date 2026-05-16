from django.urls import path

from .infraestructura.views import (
    BuscarPedidosPorTelefonoView,
    CambiarEstadoPedidoView,
    CrearPedidoView,
    GestionarPagoPedidoView,
    ListarMisPedidosView,
    ListarTodosPedidosView,
    ValidarCarritoView,
)

urlpatterns = [
    path("pedidos/", CrearPedidoView.as_view(), name="ventas_crear_pedido"),
    path("validar-carrito/", ValidarCarritoView.as_view(), name="ventas_validar_carrito"),
    path("mis-pedidos/", ListarMisPedidosView.as_view(), name="ventas_listar_pedidos"),
    path("todos/", ListarTodosPedidosView.as_view(), name="ventas_todos_pedidos"),
    path("gestionar-pago/", GestionarPagoPedidoView.as_view(), name="ventas_gestionar_pago"),
    path("cambiar-estado/", CambiarEstadoPedidoView.as_view(), name="ventas_cambiar_estado"),
    path("seguimiento/", BuscarPedidosPorTelefonoView.as_view(), name="ventas_seguimiento"),
]
