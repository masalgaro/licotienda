# Plan de Pruebas Funcionales Manuales - Seguimiento Sprint 1
**Proyecto:** La Lico E-commerce  
**Módulo:** Administración y Ventas  

Este documento contiene nuevos casos de prueba (CP) para validación manual avanzada por el equipo de calidad. Se utiliza la nomenclatura: **CP - [Número] - [HU Asociada]**.

---

## Casos de Prueba (CP)
Cada caso de prueba debe seguir la estructura: **Dada la situación [escenario], cuándo se produce el [evento] acontecimiento, debe pasar [resultado esperado]**.

### CP-011-07: Validación de Categoría Única (HU 7)
- **Escenario:** Dada la existencia de una categoría llamada "Cervezas" en el sistema.
- **Evento:** Cuando el administrador intenta crear una nueva categoría con el mismo nombre "Cervezas".
- **Resultado Esperado:** El sistema debe mostrar un error de validación indicando que la categoría ya existe y no debe permitir el guardado duplicado.

### CP-012-07: Validación de Precio No Negativo (HU 7)
- **Escenario:** Dada la apertura del formulario de "Nuevo Producto".
- **Evento:** Cuando el administrador ingresa un precio negativo (ej: `-25000`) y hace clic en "Guardar".
- **Resultado Esperado:** El sistema debe impedir la creación y mostrar una alerta de "Precio inválido" o "El precio debe ser mayor a 0".

### CP-013-09: Alerta de Stock Crítico (HU 9)
- **Escenario:** Dado un producto con 6 unidades en stock visible en la tabla de administración.
- **Evento:** Cuando el administrador reduce manualmente el stock a 5 unidades o menos.
- **Resultado Esperado:** El número de unidades en la tabla de inventario administrativo debe resaltar en **color rojo** con negrita para alertar al administrador sobre el bajo stock.

### CP-014-10: Intento de Compra Sin Stock (HU 3/10)
- **Escenario:** Dado un producto que acaba de ser marcado como agotado (Stock 0) pero aún está en el carrito de un cliente.
- **Evento:** Cuando el cliente intenta finalizar la compra desde el checkout.
- **Resultado Esperado:** El backend debe rechazar la transacción con un error "Stock insuficiente" y no descontar dinero ni crear el pedido.

### CP-015-10: Reactivación Manual de Producto (HU 10)
- **Escenario:** Dado un producto que estaba agotado y marcado como "Pausado" automáticamente.
- **Evento:** Cuando el administrador edita el producto, añade nuevas existencias (ej: 10 unidades) y presiona "Guardar".
- **Resultado Esperado:** El estado del producto debe cambiar automáticamente a "Activo" sin necesidad de click manual en el toggle de estado.

### CP-016-12: Links de Redes Sociales (HU 12)
- **Escenario:** Dado el pie de página (footer) de la página principal.
- **Evento:** Cuando el cliente hace clic en el enlace de Instagram o WhatsApp.
- **Resultado Esperado:** Se debe abrir una nueva pestaña en el navegador con el perfil de LALICO o el chat directo hacia el número configurado en `settings.py`.

---

## Registro de Resultados Manuales
*Para uso del equipo de QA (Kevin/Miguel):*

| ID Caso | Resultado (Pasa/Falla) | Notas / Hallazgos | Observaciones del Probador |
| :--- | :--- | :--- | :--- |
| CP-011 | | | |
| CP-012 | | | |
| CP-013 | | | |
| CP-014 | | | |
| CP-015 | | | |
| CP-016 | | | |
