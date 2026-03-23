from django.urls import path

from .infraestructura.views import ListarCategoriasView, ListarProductosView

urlpatterns = [
    path("productos/", ListarProductosView.as_view(), name="catalogo_listar_productos"),
    path("categorias/", ListarCategoriasView.as_view(), name="catalogo_listar_categorias"),
]
