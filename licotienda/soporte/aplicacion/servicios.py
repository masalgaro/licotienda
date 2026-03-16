from ..infraestructura.models import SoportePago, InfoContacto
from usuarios.infraestructura.models import Cliente

def registrar_soporte_pago(telefono: str, comprobante_url: str, notas: str = ""):
    """
    Registra el comprobante de pago enviado por el cliente.
    """
    cliente = Cliente.objects.filter(telefono=telefono).first()
    soporte = SoportePago.objects.create(
        cliente=cliente,
        telefono_remitente=telefono,
        comprobante_url=comprobante_url,
        notas=notas
    )
    return soporte


def obtener_info_contacto():
    """
    Retorna el único registro de InfoContacto de la tienda.
    """
    return InfoContacto.objects.first()
