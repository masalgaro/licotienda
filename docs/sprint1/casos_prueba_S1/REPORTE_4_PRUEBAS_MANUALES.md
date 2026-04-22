# REPORTE 4: EJECUCIÓN DE PRUEBAS MANUALES (REFINAMIENTO LOGÍSTICO Y UX)

**Fecha de Ejecución:** 23 de Marzo de 2026
**Objetivo:** Ajustar pequeñas fallas de retención de base de datos post-eliminación (Categorías), bloquear sustracción errónea de existencias en el abandono de carrito, y asegurar validación temprana de stock preventivo antes del Check-Out.
**Estado del Ciclo:** **PASA**

---

## 1. DETALLE DE CASOS DE PRUEBA Y HALLAZGOS

### CP-011-07: Validación de Categoría Única y CRUD (HU 7)
* **Escenario:** Tratamiento de categorías eliminadas e interrupciones del iterador de conflictos.
* **Problema Encontrado:** Al borrar "Licores", e intentar crear de nuevo "Licores", el restrictor comparaba la inserción nueva con el espectro global de otras categorías ya estandarizadas impidiendo la creación si cualquier otra existía. El sistema funcionó a la perfección pero castigó de forma excesiva.
* **Resultado Obtenido:** **Pasa**. 
* **Fix Implementado:** 
  1. *Serializer Backend*: Se reemplazó el ciclo general por un sistema de Listas de Grupos (*conflictos_groups*). Si la palabra dictada es `licores`, entonces la rutina evalúa excluyentemente `{licor, licores}` y aísla a `cerveza`. Así, al estar "Licores" (y "Licor") formalmente sin registros, vuelve a permitirse.
  2. *Frontend (Prevención de Error Humano)*: En lugar de un mero "OK / Cancelar", el modal administrativo ejecuta un `window.prompt` exigiendo que el usuario digite textualmente la palabra **ELIMINAR** en mayúsculas.

### CP-013-09: Alerta de Stock Crítico (HU 9) y Problema de Rollback
* **Problema Encontrado:** Un comprador que intencionadamente desborda el carrito de productos agotados, generaba reducción parcial del inventario administrativo temporal debido a salidas sucias dentro de `transaction.atomic()` que no lograban hacer 'rollback'. 
* **Resultado Obtenido:** **Pasa**.
* **Fix Implementado:** Convertí el retorno simple a un disparador de error violento (`raise ValidationError()`). Debido a esto, en el preciso instante en que un producto no pase del control de disponibilidad durante la venta, TODO el sistema suelta su control y descarta cualquier iteración sobre los items previos, garantizando la seguridad del Stock.
* **Ocultación visual:** Se retiró el string explayando el número literal de unidades restantes si un cliente malicioso ataca la compra.

### Nuevo Feature Operacional: Validación Frontal de Carrito
* **Problema Encontrado:** Avisar problemas de Stock sólo a último momento, después de que un comprador metódico ya terminó de escribir dónde vive y los datos de compra.
* **Solución Implementada:**
  1. Se creó una nueva ruta Endpoint en el módulo de ventas `POST /api/v1/ventas/validar-carrito/`.
  2. En el menú general del carrito (`CartPage.jsx`), el gran botón de *Proceder al Checkout* cambió su dinámica; al presionarlo congela el flujo y consulta reservadamente en el API si de verdad las manzanas siguen en el árbol. De fallar la verificación, el cliente recibe una alerta directa en ese escenario pre-formulario previniendo tiempos muertos en la conversión.

---

## 2. RESUMEN DE COMPROBACIONES APROBADAS 

| ID Caso / Fallo | Resultado | Impacto Previo de Mantenimiento |
| :--- | :---: | :--- |
| **Recuperación de Categorías Excluidas** | ✅ O.K. | Mediano. Posibles quejas por parte de Admin por bloqueos ortotipográficos excesivos. |
| **Prevención de Eliminación Accidental** | ✅ O.K. | Alto. Destrucción de sub-directorios a nivel DB por misclick. |
| **Retención del Transaction.Atomic (Stock Bug)** | ✅ O.K. | **Muy Crítico.** Ruptura invisible del nivel de Stock del servidor ante carritos híbridos sobrevendidos (productos en stock y out-of-stock cruzados). Superado. |
| **UX Interrupción Temprana** | ✅ O.K. | Alto. Deserción de cliente si fallaba todo en la última instancia. |

---
**CONCLUSIÓN:** Los ajustes más severos se focalizaron en control transaccional e integridad silenciosa, elevando la solidez de la capa media comercial al nivel final esperado antes del pase a producción (Deployment).
