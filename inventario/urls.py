from django.urls import path

from .infraestructura.views import (
    InventarioCategoriaDetailView,
    InventarioCategoriaListCreateView,
    InventarioProductoDetailView,
    InventarioProductoListCreateView,
    SurtirInventarioView,
)

urlpatterns = [
    path("productos/", InventarioProductoListCreateView.as_view(), name="inventario_productos"),
    path(
        "productos/<int:pk>/",
        InventarioProductoDetailView.as_view(),
        name="inventario_producto_detalle",
    ),
    path("categorias/", InventarioCategoriaListCreateView.as_view(), name="inventario_categorias"),
    path(
        "categorias/<int:pk>/",
        InventarioCategoriaDetailView.as_view(),
        name="inventario_categoria_detalle",
    ),
    path("surtir/", SurtirInventarioView.as_view(), name="inventario_surtir"),
]
