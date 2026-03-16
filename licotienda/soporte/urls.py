from django.urls import path
from .infraestructura.views import EnviarSoporteView, InfoContactoView

urlpatterns = [
    path('mensajes/', EnviarSoporteView.as_view(), name='soporte_mensajes'),
    path('contacto/', InfoContactoView.as_view(), name='soporte_contacto'),
]
