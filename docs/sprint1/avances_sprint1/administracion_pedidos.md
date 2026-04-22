# Sistema de Administración de Pedidos - La Lico

Este documento describe el nuevo panel de administración diseñado para el seguimiento de ventas y verificación manual de transferencias bancarias.

## 1. Módulo del Backend (`ventas` app)

### `/api/v1/ventas/todos/`
- **Funcionalidad:** Retorna todos los pedidos registrados en el comercio, ordenados por fecha de creación (más reciente primero).
- **Vistas:** `ListarTodosPedidosView`.
- **Ubicación:** `licotienda/ventas/infraestructura/views.py`

### `/api/v1/ventas/gestionar-pago/`
- **Funcionalidad:** Permite a los administradores aprobar (`APROBAR`) o rechazar (`RECHAZAR`) un pago por transferencia.
- **Vistas:** `GestionarPagoPedidoView`.
- **Lógica:** Al aprobar un pago, el estado del pedido cambia a `PAGO_VERIFICADO` y el del soporte asociado a `VERIFICADO`. Si se rechaza, se solicita un motivo opcional que se guarda en el registro de soporte (`motivo_rechazo`).
- **Ubicación:** `licotienda/ventas/infraestructura/views.py`

## 2. Interfaz del Frontend (`ventas` feature)

### OrdersAdminPage
- **Funcionalidad:** Cuadro de mando (Dashboard) centrado en ventas.
- **Filtros Inteligentes:** Categorización por estados (TODOS, PAGO_SUBIDO, PAGO_VERIFICADO, PAGO_RECHAZADO).
- **Gestión de Soportes:** Permite ver la imagen del comprobante subido por el cliente mediante una ventana modal dedicada.
- **Acciones Rápidas:** Botones de aprobación y rechazo directamente desde la fila del pedido (si está en estado `PAGO_SUBIDO`).
- **Navegación:** Se integró en la ruta principal `/admin/pedidos`.
- **Ubicación:** `frontend/src/features/ventas/OrdersAdminPage.jsx`

## 3. Serializador de Pedidos
Se actualizó el `PedidoSerializer` para incluir campos calculados y datos adicionales necesarios para la administración:
- `total_productos`: Suma monetaria de los items del pedido.
- `final_total`: Suma total incluyendo el costo de envío.
- `soporte_pago_url`: Enlace directo a la imagen del soporte almacenada en el servidor.
- **Ubicación:** `licotienda/ventas/infraestructura/serializers.py`

---
**Mejoras de Seguridad:**
- Las vistas están preparadas para ser protegidas mediante `IsAdminUser` de Django REST Framework en etapas posteriores de despliegue.
- Se implementó el manejo de errores `DoesNotExist` para pedidos inexistentes.
