from django.urls import path
from .infraestructura.views import InventarioProductoListCreateView, InventarioProductoDetailView, InventarioCategoriaListCreateView

urlpatterns = [
    path('productos/', InventarioProductoListCreateView.as_view(), name='inventario_productos_list_create'),
    path('productos/<int:pk>/', InventarioProductoDetailView.as_view(), name='inventario_producto_detail'),
    path('categorias/', InventarioCategoriaListCreateView.as_view(), name='inventario_categorias_list_create'),
]
