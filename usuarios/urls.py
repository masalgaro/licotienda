from django.urls import path

from .infraestructura.views import BuscarUsuarioPorTelefonoView, MiPerfilView

urlpatterns = [
    path("perfil/", MiPerfilView.as_view(), name="usuarios_perfil"),
    path(
        "buscar-telefono/", BuscarUsuarioPorTelefonoView.as_view(), name="usuarios_buscar_telefono"
    ),
]
