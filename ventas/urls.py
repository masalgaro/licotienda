from django.urls import path
from .infraestructura.views import CrearPedidoView, ListarMisPedidosView, ListarTodosPedidosView, GestionarPagoPedidoView

urlpatterns = [
    path('pedidos/', CrearPedidoView.as_view(), name='ventas_crear_pedido'),
    path('mis-pedidos/', ListarMisPedidosView.as_view(), name='ventas_listar_pedidos'),
    path('todos/', ListarTodosPedidosView.as_view(), name='ventas_todos_pedidos'),
    path('gestionar-pago/', GestionarPagoPedidoView.as_view(), name='ventas_gestionar_pago'),
]
