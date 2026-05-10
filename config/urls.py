from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Versión 1 - Arquitectura Hexagonal
    path("api/v1/usuarios/", include("usuarios.urls")),
    path("api/v1/soporte/", include("soporte.urls")),
    path("api/v1/catalogo/", include("catalogo.urls")),
    path("api/v1/inventario/", include("inventario.urls")),
    path("api/v1/ventas/", include("ventas.urls")),
    path("api/v1/granizados/", include("granizados.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
