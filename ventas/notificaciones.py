from django.conf import settings


def enviar_whatsapp(telefono, mensaje):
    from twilio.rest import Client

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(
        body=mensaje,
        from_=f"whatsapp:{settings.TWILIO_WHATSAPP_FROM}",
        to=f"whatsapp:+57{telefono}",
    )


def notificar_pedido_recibido_admin(pedido):
    nombre = pedido.cliente.first_name
    apellido = pedido.cliente.last_name
    total = sum(item.precio * item.cantidad for item in pedido.items.all()) + pedido.costo_envio
    mensaje = (
        f"Nuevo pedido #{pedido.id} recibido.\n"
        f"Cliente: {nombre} {apellido}\n"
        f"Dirección: {pedido.direccion}\n"
        f"Método de pago: {pedido.metodo_pago}\n"
        f"Total: ${total:,.0f}"
    )
    admin_telefono = getattr(settings, "ADMIN_WHATSAPP", "")
    enviar_whatsapp(admin_telefono, mensaje)


def notificar_pago_verificado_cliente(pedido):
    nombre = pedido.cliente.first_name
    telefono = pedido.cliente.telefono
    total = sum(item.precio * item.cantidad for item in pedido.items.all()) + pedido.costo_envio
    mensaje = (
        f"Hola {nombre}, tu pago ha sido verificado exitosamente.\n"
        f"Pedido #{pedido.id} — Total: ${total:,.0f}\n"
        f"Pronto comenzaremos a preparar tu pedido. Gracias por elegirnos."
    )
    enviar_whatsapp(telefono, mensaje)


def notificar_pedido_despachado_cliente(pedido):
    nombre = pedido.cliente.first_name
    telefono = pedido.cliente.telefono
    mensaje = (
        f"Hola {nombre}, tu pedido #{pedido.id} ya está en camino.\n"
        f"Dirección de entrega: {pedido.direccion}\n"
        f"Nuestro repartidor está de camino. ¡Gracias por tu compra!"
    )
    enviar_whatsapp(telefono, mensaje)
