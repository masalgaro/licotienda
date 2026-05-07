from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .infraestructura.views import AdminLoginView, BuscarUsuarioPorTelefonoView, MiPerfilView

urlpatterns = [
    path("perfil/", MiPerfilView.as_view(), name="usuarios_perfil"),
    path(
        "buscar-telefono/", BuscarUsuarioPorTelefonoView.as_view(), name="usuarios_buscar_telefono"
    ),
    path("admin/login/", AdminLoginView.as_view(), name="admin_login"),
    path("admin/token-refresh/", TokenRefreshView.as_view(), name="admin_token_refresh"),
]
