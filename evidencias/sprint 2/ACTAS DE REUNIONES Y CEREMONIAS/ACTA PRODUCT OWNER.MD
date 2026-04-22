## Sprint Review con el Cliente (Product Owner)

**Fecha:** 17 de abril de 2026
**Medio:** Presencial — Universidad EAFIT
**Participantes:** Kevin Pabón, Miguel Gómez, Mateo Lopera, David Quintero,
Sebastián (PO), Profesor

### Funcionalidades demostradas

1. **Sistema de ofertas y descuentos** — El administrador puede activar un
   descuento por porcentaje a cualquier producto desde el panel de inventario.
   El descuento se refleja en tiempo real en el catálogo con un marcador visual.

2. **Panel de gestión de pedidos** — El administrador puede ver los pedidos
   entrantes, verificar el comprobante de pago adjunto y aprobar o rechazar
   el pedido desde la misma interfaz.

3. **Flujo de compra completo** — Catálogo → carrito con descuentos aplicados
   → checkout con datos del cliente → selección de método de pago → subida de
   comprobante → confirmación del pedido.

4. **Gestión de categorías** — Crear, editar y eliminar categorías desde el
   panel administrativo con validaciones de duplicados y ortografía.

5. **Stock visible** — El cliente puede ver las unidades disponibles de cada
   producto directamente en el catálogo.

### Feedback del cliente

| #   | Observación                                                                               | Prioridad |
| --- | ----------------------------------------------------------------------------------------- | --------- |
| 1   | En el listado de pedidos del admin, mostrar los productos comprados en lugar de "N items" | Alta      |
| 2   | En el checkout, unificar los botones "Siguiente" en uno solo en el lado izquierdo         | Media     |
| 3   | En el resumen de compra, agregar campo que confirme la dirección de entrega               | Media     |
| 4   | Cambiar textos en inglés a español (ej: "Proceed to checkout")                            | Baja      |

### Decisiones tomadas

- El feedback de Sebastián se agrega al backlog para el Sprint 3
- La corrección del listado de pedidos (ítem 1) se implementa de inmediato
- El sistema de login no es necesario — el flujo de cliente recurrente
  que recuerda datos es suficiente para el negocio

### Evidencias

[screenshot de la reunión]
