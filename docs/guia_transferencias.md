# Refactorización de Pagos por Transferencia - La Lico

Este documento detalla los cambios realizados para integrar el método de pago por transferencia bancaria, permitiendo que los clientes adjunten comprobantes de pago directamente desde el checkout.

## 1. Cambios en el Modelo de Datos

### Soporte de Pago (Soporte App)
- **Anterior:** `SoportePago` utilizaba un `URLField` para la imagen del comprobante. Esto limitaba la integración a enlaces externos.
- **Nuevo:** Se migró a `ImageField(upload_to='comprobantes/')`. Esto permite que el backend almacene y sirva los archivos de imagen de forma nativa.
- **Ubicación:** `licotienda/soporte/infraestructura/models.py`

### Pedido (Ventas App)
- **Nuevos Estados:** Se añadieron estados de flujo específicos para transferencias:
    - `PAGO_SUBIDO`: Cuando el cliente termina el pedido y adjunta el soporte.
    - `PAGO_VERIFICADO`: Cuando el administrador aprueba la transferencia.
    - `PAGO_RECHAZADO`: Cuando el administrador invalida el soporte (con motivo opcional).
- **Ubicación:** `licotienda/ventas/infraestructura/models.py`

## 2. Lógica del Backend

### CrearPedidoView
- Se actualizó para manejar peticiones `multipart/form-data`.
- Ahora procesa los items del carrito que llegan como cadena JSON desde el `FormData` del frontend.
- Si el método es 'TRANSFERENCIA', crea automáticamente un registro en `SoportePago` vinculado al pedido y guarda el archivo subido en `request.FILES`.
- **Ubicación:** `licotienda/ventas/infraestructura/views.py`

## 3. Integración en el Checkout (Frontend)

### Interfaz de Subida
- Se implementó un componente de carga de archivos con **vista previa** instantánea (`URL.createObjectURL`).
- Validación: El botón de "Finalizar Pedido" se bloquea si el usuario elige transferencia pero no ha seleccionado un archivo.
- **Ubicación:** `frontend/src/features/usuarios/Checkout.jsx`

### Información Bancaria
- Se añadió una tarjeta visual con los datos de **Bancolombia** (Nro de Cuenta, Titular, Logo).
- Incluye un área dedicada para el **Código QR** de la tienda.

---
**Nota sobre errores corregidos:**
- Se corrigió un error donde la imagen del QR no se visualizaba porque la ruta apuntaba a una carpeta interna del sistema. La solución fue mover la imagen a la carpeta pública (`/public/qr_lalico.png`) y actualizar las rutas del frontend.
