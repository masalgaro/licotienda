# REPORTE 5: EJECUCIÓN DE PRUEBAS MANUALES (COHESIÓN TOTAL)

**Fecha de Ejecución:** 23 de Marzo de 2026
**Objetivo:** Sellar vulnerabilidades residuales en el subidor de productos (Imagen en Blanco) y comprobar la eficiencia de la estandarización ortográfica en módulos administrativos.
**Estado del Ciclo:** **PASA**

---

## 1. DETALLE DE CASOS DE PRUEBA Y HALLAZGOS

### CP-011-07: Validación de Categoría Única y Fuzzing (HU 7)
* **Escenario:** Inyecciones de cadenas con ortografía distorsionada intencionalmente o colisiones singulares en ausencia temporal de la palabra madre en base de datos ("licore", "licoressssss").
* **Resultado Obtenido:** **Pasa**. 
* **Fix Implementado:** 
  Las validaciones dejaron de basarse únicamente en conflictos pasivos (si X existe en base de datos) pasando a un sistema de reglas activas (si intentas escribir una palabra que pertenece a un grupo central, tu intento debe ser ortográficamente perfecto). Las palabras deformadas activaron el Hard-Stop del serializer arrojando mensajes pidiendo claridad (*"Categoría mal escrita"* u *"Ortografía inválida detectada"*).

### Nuevo Feature Operacional: Carga Obligatoria de Elementos Visuales (Catálogo)
* **Problema Encontrado:** Brecha en el formulario de creación de productos que permitía al administrador saltarse la carga del archivo `.jpg`/`.png`, publicando un producto "fantasma" sin foto que perjudicaba el layout de la tienda.
* **Resultado Obtenido:** **Pasa**.
* **Fix Implementado:**
  1. *Backend (`serializers.py`)*: Se anexó una sobrecarga de validación en `ProductoInventarioSerializer`. Si la bandera determina que es un producto totalmente nuevo (`not self.instance`) y no viaja ningún Payload Binario en el campo `imagen`, el servidor interrumpe y grita un error explícito solicitando la foto.
  2. *Frontend (`InventoryAdminPage.jsx`)*: Se añadió la etiqueta HTML5 condicional `required={!editMode}` a la ranura de subida de archivos; de esta manera, el navegador del cliente restringe que intentes clickear "Guardar" si no has soltado ninguna imagen allí previamente al crear el producto.

---

## 2. ESTADO DEL SISTEMA TRAS AJUSTES

| Sistema / Módulo | Verificación y Consistencia | Estado |
| :--- | :--- | :---: |
| **Integridad de Categorías** | Cero sub-registros basura generables y zero sub-variantes extrañas permitidas. | ✅ Sólido |
| **Experiencia de Checkout** | Cero caídas durante deserialización de Payload de Órdenes a DB. Validación temprana detiene al cliente ante cruces de stock fantasma y el Rollback Atómico es seguro al 100%. | ✅ Listo |
| **Inventario e Imágenes** | Stock protegido. Exposición Visual Controlada (Nadie publica sin foto por la regla del Modal/Serializer). | ✅ Protegido |
| **UX de Comprador/Admin** | Labels coloridas implementadas. Eliminación con ventanas manuales y rutas completas. | ✅ Aprobado |

---
**RESULTADO GLOBAL:** La rama de e-commerce se ha blindado logísticamente desde el carrito hasta el subidor administrativo con el cierre del ciclo número 5 de inspección manual exhaustiva. No permanecen errores de nivel Medio, Alto o Crítico en las reglas de negocio revisadas.
