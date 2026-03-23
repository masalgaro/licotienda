# Reporte de Ejecución de Pruebas Funcionales - Sprint 1
**Proyecto:** La Lico E-commerce  
**Módulo:** Gestión de Inventario (Admin)  
**HUs Cubiertas:** HU 7, HU 8, HU 9, HU 10  

## 1. Resumen de Ejecución
Este documento detalla la validación funcional de las capacidades administrativas del sistema. Durante el ciclo de pruebas, se identificaron discrepancias críticas entre los criterios de aceptación y la implementación inicial, lo que derivó en reportes de fallos (Bugs) y su posterior resolución.

| ID Caso | Historia | Descripción | Resultado | Estado Final |
| :--- | :--- | :--- | :--- | :--- |
| CP-07-01 | HU 7 | Creación de nuevo producto | Inicial: ❌ Fallo | ✅ PASA |
| CP-08-01 | HU 8 | Eliminación lógica de producto | Inicial: ❌ Fallo | ✅ PASA |
| CP-09-01 | HU 9 | Edición de existencias (Stock) | Inicial: ❌ Fallo | ✅ PASA |
| CP-10-01 | HU 10 | Auto-pausar al llegar a stock 0 | Inicial: ❌ Fallo | ✅ PASA |

---

## 2. Detalle de Pruebas y Reporte de Errores (Bugs)

### CP-07-01: Creación de Producto (HU 7)
- **Criterio de Aceptación:** "Dada la necesidad de ampliar la oferta, cuando el admin completa el formulario de 'Nuevo Producto', el sistema debe persistir el registro en la BD y mostrarlo en la galería."
- **Evidencia de Error (Incidencia):** El botón "Nuevo Producto" no disparaba ninguna acción y el backend no tenía el endpoint configurado.
- **Corrección:** Se implementó el modal fijo/centrado y el endpoint POST en `/api/v1/inventario/productos/`.
- **Resultado Final:** Éxito. El producto aparece inmediatamente tras guardar.

### CP-08-01: Eliminación de Producto (HU 8)
- **Criterio de Aceptación:** "Dada la baja de un producto, cuando el admin hace clic en eliminar y confirma, el registro debe desaparecer de la vista del cliente y de la lista admin."
- **Evidencia de Error (Incidencia):** El botón de eliminar visualmente estaba presente pero no realizaba la petición DELETE al backend.
- **Corrección:** Se vinculó el icono de papelera con el método `handleDelete` y se configuró el método `destroy` en la infraestructura del backend.
- **Resultado Final:** Éxito. El producto se elimina correctamente tras confirmar el diálogo.

### CP-09-01: Gestión de Stock (HU 9)
- **Criterio de Aceptación:** "Dada una reposición de mercancía, cuando el admin edita las 'existencias' en el panel, el valor debe actualizarse y reflejarse en el inventario real."
- **Evidencia de Error (Incidencia):** No existía el campo `existencias` en el modelo `ProductoModelo` ni el formulario de edición en el frontend.
- **Corrección:** Se añadió el campo `existencias` (Django Model) y se creó el formulario de edición reactivo en el frontend.
- **Resultado Final:** Éxito. Las unidades se actualizan y guardan correctamente.

### CP-10-01: Auto-pausado por Agotamiento (HU 10)
- **Criterio de Aceptación:** "Dada una venta que agota el stock, cuando las existencias llegan a 0, el sistema debe cambiar el estado a 'Pausado' automáticamente."
- **Evidencia de Error (Incidencia):** El decremento de stock no estaba implementado en la vista de pedidos, por lo que el estado nunca cambiaba.
- **Corrección:** Se implementó lógica en `CrearPedidoView` para validar stock, decrementar unidades y cambiar `esta_activo = False` si el resultado es 0.
- **Resultado Final:** Éxito. El producto se oculta automáticamente al agotarse.

---

## 3. Conexión Lógica
Toda corrección realizada en el código fuente (ver commits de refactorización de `InventoryAdminPage.jsx` e `infraestructura/views.py`) responde directamente a un fallo detectado en los Casos de Prueba (CP) derivados de los requisitos legales y funcionales de las historias de usuario (HU 7-10).
