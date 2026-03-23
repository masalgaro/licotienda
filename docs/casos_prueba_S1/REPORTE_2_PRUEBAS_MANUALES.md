# REPORTE 2: EJECUCIÓN DE PRUEBAS MANUALES (CICLO CORRECTIVO)

**Fecha de Ejecución:** 23 de Marzo de 2026
**Objetivo:** Validar las correcciones implementadas tras el Fallo del Ciclo 1 en Inventario, Catálogo y Checkout.
**Estado del Ciclo:** **PASA** (Con observaciones resueltas).

---

## 1. DETALLE DE CASOS DE PRUEBA Y HALLAZGOS

### CP-011-07: Validación de Categoría Única (HU 7)
* **Escenario:** El usuario o administrador intenta crear categorías que ya existen de forma implícita debido a singularidades/plurales (ej. Cerveza, Licores).
* **Evento:** Intento de creación de la categoría "Cerveza" existiendo "Cervezas".
* **Resultado Esperado:** El sistema debe detectar variaciones de palabras reservadas (cerveza/cervezas, ron/rones, licor/licores) e impedir su creación alertando el conflicto, sin bloquear palabras compuestas como "Cervezas artesanales".
* **Resultado Obtenido:** **Pasa**. Se incluyó una validación en tiempo de serialización que detiene exactamente los conflictos primarios de plurales y aprueba los identificadores más descriptivos.
* **Fix Implementado:** Se añadió el método `validate_nombre` en `CategoriaInventarioSerializer` con cruce contra una lista dura de conflictos (set de palabras reservadas) manejando variaciones `lower` e igualdades.

### CP-012-07: Validación de Precio y Stock No Negativo (HU 7)
* **Escenario:** El administrador inserta cifras como `-5000` en precio.
* **Evento:** Guardado desde el modal en el panel admin.
* **Resultado Esperado:** Se bloquea el guardado detallando por qué.
* **Resultado Obtenido:** **Pasa**. La prueba fue documentada como satisfactoria por el equipo QA desde el inicio del Ciclo 2.
* **Fix Implementado:** Reglas de validación `@validate` implementadas en el serializador de Inventario en el backend.

### CP-013-09: Alerta de Stock Crítico (HU 9)
* **Escenario:** Visualización general de los productos en el panel administrativo cuando los niveles llegan a 5 o inferiores.
* **Evento:** Apertura de Lista de Inventarios.
* **Resultado Esperado:** Alerta visible para un operador común, indicando claridad sobre la situación del inventario sin depender meramente de un color.
* **Resultado Obtenido:** **Pasa**.
* **Fix Implementado:** En `InventoryAdminPage.jsx` se reemplazó el estilo de sólo color por una etiqueta/caja roja en mayúsculas ("¡STOCK BAJO!" o "AGOTADO") junto al nivel de inventario, sumando peso gráfico a la alerta.

### CP-014-10: Intento de Compra Sin Stock y Visibilidad (HU 3/10)
* **Escenario:** Cliente accede a la tienda e intenta adquirir la cerveza "Águila Latón", que posee 0 unidades en la base de datos.
* **Evento:** Renderización de la vista pública (Catálogo) y validación en la cola de pagos (Checkout).
* **Resultado Esperado:** El producto debe continuar publicado en la URL, pero debe mostrarse como "AGOTADO" y el botón de añadir al carrito debe estar inhabilitado. Si por error se envían productos sin stock, el pago final debe rechazarlo antes mostrando un mensaje clarificado sobre inventario faltante.
* **Resultado Obtenido:** **Pasa**. 
* **Fix Implementado:** 
  1. *Inventario/Backend*: Se extrajo el `esta_activo = False` de la actualización de un producto en cero. El producto persiste Activo, garantizando su existencia en catálogo para SEO y percepción de inventario total.
  2. *Catálogo/Backend*: Se incluyó el campo `existencias` en el `ProductoSerializer` público.
  3. *Vista Catálogo*: En `StorePage.jsx` se deshabilitó la función del botón (`+`) si `existencias === 0`, renderizando una caja que dice "AGOTADO" en color rojo. Y se inyectó prefijo absoluto local `http://` que arregla el bug en el que NO cargaban las fotos del cliente.
  4. *Checkout*: Se modificó la lectura de errores JSON del Request y se aseguró el despliegue del Alert para la falla de stock específica mandada por `views.py`.

### CP-015-10: Reactivación Manual de Producto (HU 10)
* **Escenario:** Restablecer cantidades positivas de stock a productos pausados.
* **Evento:** Edición desde 0 o pausado a *n* cantidad.
* **Resultado Esperado:** Su status se debe marcar verde/activo automáticamente sin intervención explícita del Toggle.
* **Resultado Obtenido:** **Pasa**. Validado como exitoso a la vez que el error del número en rojo se mitigó.

---

## 2. RESUMEN DE ESTADO Y OBSERVACIONES

| ID Caso | Resultado (Pasa/Falla) | Notas / Hallazgos | Observaciones del Probador | Fix Implementado |
| :--- | :---: | :--- | :--- | :--- |
| **CP-011-07** | ✅ Pasa | Interrupción confirmada en "Licores", "Cerveza". | Se logra frenar duplicaciones gramaticales pero avala compuestos. | Excepción en serializador de `CategoriaModelo`. |
| **CP-012-07** | ✅ Pasa | Valores negativos inhabilitados. | - | `validate_precio` y `validate_existencias`. |
| **CP-013-09** | ✅ Pasa | Etiqueta agregada gráficamente. | UX se percibe instantáneamente por la grilla ("¡Stock Bajo!"). | UI pill condicional en la celda de la tabla. |
| **CP-014-10** | ✅ Pasa | Control de Agotado y Error de red reparados. | Impedir poner en carrito desde un inicio es la solución más robusta. | Modificadas visibilidades en UI y el handler de errores del Frontend. |
| **CP-015-10** | ✅ Pasa | Activaciones de inventario proceden intactas. | - | Resuelto desde el Sprint previo. |
| **General-03** | ✅ Pasa | Las miniaturas públicas funcionan. | Imágenes relativas vs absolutas solventado. | Appended `API_BASE_URL` condicional a las `img / src`. |

---
**CONCLUSIÓN DEL SPRINT Y CICLO 2:** Los bloqueos graves identificados en Experiencia al Usuario y consistencia de Base de Datos han sido superados durante esta depuración. El despliegue a cliente está listo para tolerar ventas sin conflicto de inventarios cruzados o fantasmas.
