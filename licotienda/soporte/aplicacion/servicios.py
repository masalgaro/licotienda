from ..infraestructura.models import MensajeSoporte, InfoContacto
from usuarios.infraestructura.models import Cliente

def enviar_mensaje_soporte(telefono: str, asunto: str, cuerpo: str):
    """
    Crea un mensaje de soporte vinculado al cliente si existe.
    """
    cliente = Cliente.objects.filter(telefono=telefono).first()
    mensaje = MensajeSoporte.objects.create(
        cliente=cliente,
        telefono_remitente=telefono,
        asunto=asunto,
        cuerpo=cuerpo
    )
    return mensaje


def obtener_info_contacto():
    """
    Retorna el único registro de InfoContacto de la tienda.
    """
    return InfoContacto.objects.first()
