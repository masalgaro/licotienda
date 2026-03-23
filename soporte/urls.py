from django.urls import path

from .infraestructura.views import ContactoView, SubirSoportePagoView

urlpatterns = [
    path("contacto/", ContactoView.as_view(), name="soporte_contacto"),
    path("subir-pago/", SubirSoportePagoView.as_view(), name="soporte_subir_pago"),
]
