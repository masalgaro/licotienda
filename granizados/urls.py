from django.urls import path

from .infraestructura.views import (
    AdminIngredienteDetalleView,
    AdminIngredientesView,
    AgregarGranizadoCarritoView,
    CrearGranizadoView,
    ListarIngredientesDisponiblesView,
)

urlpatterns = [
    path("", CrearGranizadoView.as_view(), name="granizados_crear"),
    path(
        "ingredientes/",
        ListarIngredientesDisponiblesView.as_view(),
        name="granizados_ingredientes",
    ),
    path("carrito/", AgregarGranizadoCarritoView.as_view(), name="granizados_carrito"),
    path(
        "admin/ingredientes/",
        AdminIngredientesView.as_view(),
        name="granizados_admin_ingredientes",
    ),
    path(
        "admin/ingredientes/<int:pk>/",
        AdminIngredienteDetalleView.as_view(),
        name="granizados_admin_ingrediente_detalle",
    ),
]
