# REPORTE 3: EJECUCIÓN DE PRUEBAS MANUALES (CICLO FINAL Y REFINAMIENTO)

**Fecha de Ejecución:** 23 de Marzo de 2026
**Objetivo:** Validar detalles estéticos del Ciclo 2, control de calidad del Checkout, y fortalecer validaciones de Categorías (CRUD completo).
**Estado del Ciclo:** **PASA** (Bloqueos técnicos superados).

---

## 1. DETALLE DE CASOS DE PRUEBA Y HALLAZGOS

### CP-011-07: Validación de Categoría Única y CRUD (HU 7)
* **Escenario:** Usuarios ingresen mala ortografía, letras repetidas (ej. CERVEZAAAA, cEErVeeZZaSS) para burlar la validación y crear una categoría protegida o existiendo errores tipográficos en las categorías.
* **Evento:** Formulario de "Nuevas Categorías".
* **Resultado Esperado:** Reconocimiento de compresiones de cadenas repetidas para detectar si se está tratando de crear "cerveza". Además, poder editar o eliminar una categoría.
* **Resultado Obtenido:** **Pasa**. 
* **Fix Implementado:** 
  1. *Serializer Backend*: Se añadió una compresión por Expresión Regular (`re.sub(r'(.)\1+', r'\1', ...)`). Todo lo repetido sin sentido revierte a la palabra primaria y es denegado por duplicidad conflictiva.
  2. *Frontend (CRUD y Endpoints)*: Se integró el `InventarioCategoriaDetailView` para operar PUT/DELETE. El modal viejo se reescribió como un "Gestor de Categorías" que muestra un listado interactivo con íconos para editar el texto o pasarlo a la basura.

### CP-012-07: Validación de Precio No Negativo (HU 7)
* **Resultado Obtenido:** **Pasa**. Ya era estable desde Ciclo 2 y se certificó su correcto funcionamiento.

### CP-013-09: Alerta de Stock Crítico (HU 9)
* **Escenario:** Mejoramiento de indicación visual (UX).
* **Evento:** Observación en el panel administrativo ante stock bajo.
* **Resultado Esperado:** Visualización clara y textual en mayúsculas como "TE QUEDAN POCAS UNIDADES" o "¡STOCK BAJO!".
* **Resultado Obtenido:** **Pasa**. 
* **Fix Implementado:** Etiquetado inyectado junto a los números en formato de *Pill* o Píldora visible y explícita para administradores.

### CP-014-10: Intento de Compra Sin Stock (HU 3/10)
* **Resultado Obtenido:** **Pasa**. Control inhabilitador del Carrito y etiqueta inyectada funcionan al 100%.

### CP-015-10: Reactivación Manual de Producto (HU 10)
* **Resultado Obtenido:** **Pasa**. Validado contra reingreso al panel tras inyección de stock (+0) cambiando estado automáticamente de pausado a activo.

### CP-016-12: Links de Redes Sociales (HU 12)
* **Resultado Obtenido:** **Pasa**. Verificados los anchors en los espacios comerciales públicos. 

### CP-017-06 y Fallo C-01: Imágenes Múltiples Faltantes en Carrito y Antojos
* **Escenario:** En la lista interna del pedido y el "Algo más para llevar", las imágenes carecen de persistencia ante URLs relativas originadas de file dumps rápidos.
* **Evento:** Render de vista `/carrito`.
* **Resultado Esperado:** Absolutamente toda tarjeta renderizada necesita prefijo del host.
* **Resultado Obtenido:** **Pasa**. El fix no se había propagado a componentes en segundo plano como CartPage.
* **Fix Implementado:** Añadida importación in-line condicional usando `API_BASE_URL` a ambas grillas.

### CP-018-05 y Fallo E-02: Colapso del Parseador de Formularios (Mensaje: "Este campo es requerido")
* **Escenario:** Interrupción del motor de pago del DRF donde a pesar de llenar toda la información el API respondía 400.
* **Evento:** `POST` a `/api/v1/ventas/pedidos/`.
* **Resultado Esperado:** Pasadera directa hacia base de datos, insertando `Pedido` e `ItemPedido`.
* **Resultado Obtenido:** **Pasa**. Fallo grave de compatibilidad form-data / querydict superado.
* **Fix Implementado:** Debido al FormData envíado desde React, el DRF recibía el campo anidado de `items` como QueryDict y destruía el parsing. En la capa de ModelView (`ventas/views.py`), en vez de mutar un request, aislé toda la data transformándola y empaquetándola en un Diccionario Python limpio antes de llamar a `PedidoSerializer`. También mecioné e imprimí mejor el `error.response.data` incluyendo el campo defectuoso en la alerta visual (`Campo 'tal': Este campo...`) para ayudar si un usuario no digitaliza su dirección.

---

## 2. RESUMEN FINAL

| ID Caso / Fallo | Resultado | Nivel Severidad Previa | Solución General |
| :--- | :---: | :---: | :--- |
| **Categoría Ortografía / CRUD** | ✅ Pasa | Alta (Basura Base de Datos) | RegEx Backend + Reestructuración Panel React. |
| **Carrito y Sugerencias Rotos** | ✅ Pasa | Alta (Confusión Comprador) | Prefix API HTTP para `img_url`. |
| **Pánico de Serialization al Pagar** | ✅ Pasa | Crítico (No había ventas) | Sanitize payload Data Types (QueryDict a Plain Dict). |
| **Resto de pruebas UX** | ✅ Pasa | Baja - Media | Ajustes visuales CSS. |

---
**RESULTADO GLOBAL:** La versión actual del sistema de **Inventario, Catálogo y Pasarela Base** se encuentran aptos para operación normal o pruebas Alpha. Ninguna barrera limitante para la compra de extremo a extremo subiste en las áreas revisadas.
