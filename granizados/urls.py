from django.urls import path

from .infraestructura.views import (
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
]
