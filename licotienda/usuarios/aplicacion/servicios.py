from ..infraestructura.models import Cliente, DireccionCliente

def buscar_cliente_por_telefono(telefono: str):
    """
    Busca un cliente por su número de teléfono.
    Retorna el objeto Cliente y sus direcciones asociadas, o None si no existe.
    """
    try:
        cliente = Cliente.objects.prefetch_related('direcciones').get(telefono=telefono)
        return cliente
    except Cliente.DoesNotExist:
        return None


def guardar_o_actualizar_cliente(telefono: str, nombre: str, direccion_texto: str, observaciones: str = ""):
    """
    Crea un nuevo cliente o actualiza el nombre de uno existente.
    Si la dirección proporcionada no existe en su historial, la agrega.
    Retorna el cliente y la dirección guardada/encontrada.
    """
    # 1. Buscar o crear el cliente
    cliente, creado = Cliente.objects.get_or_create(
        telefono=telefono,
        defaults={'nombre': nombre}
    )
    
    # Si ya existía pero el usuario tipeó un nombre distinto (ej. actualización de datos)
    if not creado and cliente.nombre != nombre:
        cliente.nombre = nombre
        cliente.save()
        
    # 2. Buscar si la dirección ya existe para este cliente (para no duplicar)
    # Comparamos ignorando mayúsculas y espacios extra para ser amigables.
    direccion_existente = DireccionCliente.objects.filter(
        cliente=cliente,
        direccion__iexact=direccion_texto.strip()
    ).first()
    
    if direccion_existente:
        # Actualizar observaciones si cambiaron
        if observaciones and direccion_existente.observaciones != observaciones:
            direccion_existente.observaciones = observaciones
            direccion_existente.save()
        direccion = direccion_existente
    else:
        # Crear nueva dirección
        direccion = DireccionCliente.objects.create(
            cliente=cliente,
            direccion=direccion_texto.strip(),
            observaciones=observaciones.strip() if observaciones else ""
        )
        
    return cliente, direccion
