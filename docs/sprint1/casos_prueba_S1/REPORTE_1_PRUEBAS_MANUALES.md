# REPORTE 1: EJECUCIÓN DE PRUEBAS MANUALES (CICLO FALLIDO)

**Fecha de Ejecución:** 23 de Marzo de 2026
**Objetivo:** Validar las funcionalidades del panel de inventario y resolución de Historias de Usuario (HU 7, HU 8, HU 9, HU 10).
**Estado del Ciclo:** **FALLIDO** (Requiere correcciones urgentes).

---

## 1. DETALLE DE CASOS DE PRUEBA Y HALLAZGOS

### CP-011-07: Validación de Categoría Única (HU 7)
* **Escenario:** El administrador intenta agregar o gestionar categorías para organizar los productos recién creados.
* **Evento:** Ingreso a la vista de "Nuevo Producto" o al panel principal buscando algún espacio para introducir nuevas clasificaciones.
* **Resultado Esperado:** Visualizar un botón o formulario ("Nueva Categoría") que permita la inserción en base de datos.
* **Resultado Obtenido:** **Falla**. No existe posibilidad de crear una nueva categoría. Solo aparecen en el listado desplegable aquellas categorías que fueron cargadas por defecto en el script semilla.

### CP-014-10 / CP-015-10: Configuración y Validación de Stock (HU 9 / HU 10)
* **Escenario:** El administrador necesita colocar el stock de un producto en 0 para probar la funcionalidad de "Producto Agotado" en la vista de clientes; o en su defecto subir la cantidad manualmente.
* **Evento:** Se editan las unidades manuales (ej: 5 unidades o 0 unidades) desde el modal de edición de inventario y se guardan los cambios.
* **Resultado Esperado:** El sistema debe guardar el número de unidades en la base de datos y, si llega a 0, actualizar automáticamente el campo `esta_activo = False`.
* **Resultado Obtenido:** **Falla Crítica (Crash 500)**. El sistema arroja una excepción no manejada: 
  `AttributeError at /api/v1/inventario/productos/64/ - This QueryDict instance is immutable`. No se pudo comprobar la reactivación automática ni el agotamiento debido al congelamiento del formulario en los métodos REST (PUT/POST).

### CP-General-01: Validación de Precios y Valores Negativos
* **Escenario:** Captura de errores de tipeo o fallas humanas al asignar precios de venta.
* **Evento:** Inserción de un precio en valor negativo (ej: -$5000) o stock en negativo al crear o editar el producto.
* **Resultado Esperado:** El sistema debe arrojar un error de validación e impedir la publicación del producto.
* **Resultado Obtenido:** **Falla**. El panel permite colocar valores negativos y el backend los procesa y publica con éxito en la base de datos y la vista de la tienda.

### CP-General-02: Borrado Permanente de Productos (HU 8)
* **Escenario:** Eliminación manual de artículos en el Inventario (Botón Caneca de Basura).
* **Evento:** El usuario presiona la papelera para borrar un producto de la base de datos de manera definitiva.
* **Resultado Esperado:** El producto debe desaparecer de la lista administrativa tras la confirmación de la venta emergente.
* **Resultado Obtenido:** **Falla**. El sistema no deja borrar los productos (falla silenciosa que lanza mensaje de error genérico "Error al eliminar").

### CP-General-03: Visualización y Carga de Imágenes
* **Escenario:** Renderización del catálogo de productos para el administrador y el usuario final.
* **Evento:** Navegación por la tabla de productos o el home.
* **Resultado Esperado:** Cada fila y tarjeta de venta debe cargar la miniatura correcta de la bebida o el snack asociado.
* **Resultado Obtenido:** **Falla**. Las imágenes se encuentran rotas o en blanco (`/placeholder.png`). Adicionalmente, el formulario sigue pidiendo una "URL de Imágen" en lugar de proveer un selector de archivos de sistema para subida real.

---

## 2. RESUMEN DE ESTADO Y OBSERVACIONES

| ID Caso | Resultado (Pasa/Falla) | Notas / Hallazgos | Observaciones del Probador |
| :--- | :---: | :--- | :--- |
| **CP-011-07** | ❌ Falla | Botón de crear categoría inexistente. | Imposible hacer pruebas de sub-categorización o duplicidad, la interfaz carece del despliegue. |
| **CP-014-10** | ❌ Falla | `QueryDict is immutable`. Falla crítica en Backend (Líneas 55 del views.py de Inventario). | Bloqueo fatal, no me deja probar la HU10 (productos agotados) ya que no salva la edición del inventario. |
| **CP-015-10** | ❌ Falla | Bloqueado por la falla de `CP-014-10`. | No aplicable hasta solucionar el bug del `QueryDict`. |
| **CP-016-12** | ✅ Pasa | Los links están funcionales y correctos en la HU 12. | Funciona perfecto como lo esperado. Ninguna modificación requerida. |
| **General-01** | ❌ Falla | Pasan valores `< 0`. Ausencia de validador numérico. | Un peligro para el comercio. Pude guardar productos a precios negativos. |
| **General-02** | ❌ Falla | Error al borrar. Posible choque con Foreign Keys (`ProtectedError`) o error de API. | Hay un botón de error al querer descartar ítems viejos, no se eliminan. |
| **General-03** | ❌ Falla | Directorio local no resuelve. Exigencia de URL cruda que no es amigable al vendedor. | Obligar usar un Link web interrumpe el flujo, debería ser carga de archivo o `ImageField`. |

---
**NOTA:** Las incidencias descritas impiden dar por terminado el Sprint respectivo. Se detienen las validaciones en este punto hasta aplicar parches correctivos a todos los eventos "Falla".
