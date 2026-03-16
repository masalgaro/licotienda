from django.urls import path
from .infraestructura.views import RegistrarSoportePagoView, InfoContactoView

urlpatterns = [
    path('mensajes/', RegistrarSoportePagoView.as_view(), name='soporte_mensajes'),
    path('contacto/', InfoContactoView.as_view(), name='soporte_contacto'),
]
