# Historias de Usuario — Sprint 2

## Resumen

| HU    | Descripción                              | Responsable       | Estado        |
|-------|------------------------------------------|-------------------|---------------|
| HU-13 | Buscar productos por categoría           | Miguel            | ✅ Completada |
| HU-15 | Agregar categorías a productos           | Kevin             | ✅ Completada |
| HU-16 | Agregar ofertas a productos              | Mateo + David     | ✅ Completada |
| HU-17 | Ver cantidad de stock en producto        | Kevin             | ✅ Completada |
| HU-18 | Incluir información del cliente en pedido| Miguel            | ✅ Completada |
| HU-19 | Editar categorías existentes             | Kevin             | ✅ Completada |
| HU-20 | Editar ofertas existentes                | Mateo + David     | ✅ Completada |
| HU-21 | Listar ofertas activas                   | Mateo + David     | ✅ Completada |
| HU-22 | Eliminar categorías                      | Kevin             | ✅ Completada |
| HU-23 | Eliminar ofertas                         | Mateo + David     | ✅ Completada |

---

## HU-13 — Buscar productos por categoría en el catálogo

**Responsable:** Miguel

**Descripción:**
Como cliente, quiero filtrar el catálogo de productos por categoría para encontrar más rápido lo que busco sin tener que recorrer todo el listado.

**Tareas cumplidas:**
- El endpoint `GET /api/v1/catalogo/productos/` acepta el parámetro `categoria` (ID numérico).
- El queryset aplica `filter(categoria_id=categoria_id)` sobre productos activos (`esta_activo=True`).
- Si el ID de categoría no corresponde a ningún registro, el endpoint retorna lista vacía `[]` con HTTP 200.
- El frontend expone un selector de categorías que construye la URL con el parámetro correspondiente.

**Criterios de aceptación:**
- Dado un catálogo con productos de distintas categorías, al seleccionar "Rones" solo aparecen rones.
- Si se filtra por una categoría que no existe, el resultado es una lista vacía (sin error).
- Productos inactivos (agotados) nunca aparecen en el catálogo, con o sin filtro de categoría.

**Estado:** ✅ Completada

---

## HU-15 — Agregar categorías a productos

**Responsable:** Kevin

**Descripción:**
Como administrador, quiero crear nuevas categorías para poder organizar los productos del inventario por tipo (Rones, Cervezas, Aguardientes, etc.).

**Tareas cumplidas:**
- Endpoint `POST /api/v1/inventario/categorias/` crea una categoría nueva con el campo `nombre`.
- El modelo `CategoriaModelo` define `nombre` como `CharField(unique=True)`, garantizando unicidad a nivel de base de datos.
- El serializer `CategoriaInventarioSerializer` valida duplicados exactos e impide variaciones ortográficas conflictivas (singular/plural) para categorías de dominio como Licores, Cervezas, Rones, etc.
- Retorna HTTP 201 en creación exitosa con el objeto creado; HTTP 400 con detalle del error si la categoría ya existe.

**Criterios de aceptación:**
- Crear una categoría con nombre nuevo → respuesta 201 con el objeto creado.
- Intentar crear una categoría con nombre duplicado → respuesta 400 con campo `nombre` en el cuerpo de error.
- No se crean registros duplicados en la base de datos.

**Estado:** ✅ Completada

---

## HU-16 — Agregar ofertas a productos

**Responsable:** Mateo + David

**Descripción:**
Como administrador, quiero marcar un producto como en oferta y asignarle un porcentaje de descuento para que los clientes vean el precio especial en el catálogo.

**Tareas cumplidas:**
- El modelo `ProductoModelo` tiene los campos `en_oferta` (BooleanField) y `descuento_porcentaje` (PositiveIntegerField 0–100).
- El serializer valida que si `en_oferta=True`, el `descuento_porcentaje` sea mayor a 0; de lo contrario retorna HTTP 400.
- Al crear o editar un producto sin oferta activa, `descuento_porcentaje` se normaliza automáticamente a 0.
- El endpoint de inventario (`POST /api/v1/inventario/productos/`) y el de detalle (`PUT /api/v1/inventario/productos/{id}/`) soportan estas reglas.
- El catálogo (`GET /api/v1/catalogo/productos/`) acepta el parámetro `en_oferta=true` para filtrar solo productos en oferta.

**Criterios de aceptación:**
- Crear producto con `en_oferta=true` y `descuento_porcentaje > 0` → producto visible en filtro de ofertas.
- Crear producto con `en_oferta=true` y `descuento_porcentaje=0` → rechazado con HTTP 400.
- Productos en oferta aparecen en `GET /api/v1/catalogo/productos/?en_oferta=true`.

**Estado:** ✅ Completada

---

## HU-17 — Ver cantidad de stock en vista de producto

**Responsable:** Kevin

**Descripción:**
Como cliente, quiero ver la cantidad disponible de cada producto para saber si hay suficiente stock antes de agregarlo al carrito.

**Tareas cumplidas:**
- El `ProductoSerializer` en `catalogo/` expone el campo `existencias` en todos los productos del catálogo público.
- El endpoint `GET /api/v1/catalogo/productos/` incluye `existencias` en cada objeto del listado.
- Los productos con `esta_activo=False` (generalmente cuando `existencias=0`) son excluidos del catálogo, por lo que el cliente no ve productos agotados.
- Al crear un producto con `existencias > 0`, el campo `esta_activo` se establece automáticamente en `True`.

**Criterios de aceptación:**
- La respuesta del catálogo incluye el campo `existencias` con valor numérico correcto.
- Un producto con `esta_activo=False` no aparece en el catálogo aunque tenga `en_oferta=True`.
- El stock se decrementa atómicamente al confirmar un pedido.

**Estado:** ✅ Completada

---

## HU-18 — Incluir información del cliente en pedido a domicilio

**Responsable:** Miguel

**Descripción:**
Como cliente, quiero registrar mis datos (nombre, apellidos, teléfono y dirección) al hacer un pedido a domicilio sin necesidad de crear una cuenta previamente.

**Tareas cumplidas:**
- El endpoint `POST /api/v1/ventas/pedidos/` acepta `nombres`, `apellidos`, `telefono` y `direccion` como campos de formulario.
- Si el teléfono ya existe en la base de datos, se reutiliza el usuario y se actualizan nombre/apellidos. Si no existe, se crea un usuario nuevo con username generado automáticamente (`user_{telefono}_{count}`).
- Si `recordar_direccion=true`, la dirección se guarda en `UsuarioDireccion` y se establece como `direccion_base` del usuario.
- El pedido queda vinculado al usuario con todos sus datos de entrega.
- Si no se envía teléfono, la solicitud es rechazada con HTTP 400 antes de crear ningún registro.

**Criterios de aceptación:**
- POST con nombre, apellidos, teléfono, dirección y artículos → pedido creado (HTTP 201) con todos los datos correctamente almacenados.
- POST sin teléfono → HTTP 400, sin pedido creado, sin usuario creado.
- Con `recordar_direccion=true`, la dirección queda guardada en `UsuarioDireccion` asociada al usuario.

**Estado:** ✅ Completada

---

## HU-19 — Editar categorías de productos existentes

**Responsable:** Kevin

**Descripción:**
Como administrador, quiero renombrar una categoría existente para corregir errores tipográficos o actualizar la nomenclatura del catálogo.

**Tareas cumplidas:**
- Endpoint `PUT /api/v1/inventario/categorias/{id}/` actualiza el nombre de una categoría existente.
- La actualización es parcial (`partial=True`), por lo que solo se envía el campo a modificar.
- Si el ID no corresponde a ninguna categoría, retorna HTTP 404.
- Las mismas validaciones de unicidad del serializer aplican al editar: no se puede cambiar a un nombre que ya existe en otra categoría.

**Criterios de aceptación:**
- PUT con nombre válido sobre categoría existente → HTTP 200 con objeto actualizado.
- PUT sobre ID inexistente → HTTP 404.
- El cambio persiste en la base de datos y se refleja en los productos asociados.

**Estado:** ✅ Completada

---

## HU-20 — Editar ofertas de productos existentes

**Responsable:** Mateo + David

**Descripción:**
Como administrador, quiero modificar el porcentaje de descuento o el estado de oferta de un producto ya creado para ajustar las promociones vigentes.

**Tareas cumplidas:**
- Endpoint `PUT /api/v1/inventario/productos/{id}/` permite actualizar `en_oferta` y `descuento_porcentaje` de forma parcial.
- Las mismas reglas de validación de HU-16 aplican: no se puede dejar `en_oferta=True` con `descuento_porcentaje=0`.
- Al desactivar la oferta (`en_oferta=False`), el serializer normaliza `descuento_porcentaje` a `0` automáticamente.
- Si se envía `descuento_porcentaje` con `en_oferta=True` pero el descuento es negativo o mayor a 100, retorna HTTP 400.

**Criterios de aceptación:**
- Actualizar `descuento_porcentaje` de un producto en oferta → HTTP 200 con nuevo valor.
- Intentar actualizar con `en_oferta=True` y `descuento_porcentaje=0` → HTTP 400.
- Desactivar oferta con cualquier valor de descuento → descuento normalizado a 0 en base de datos.

**Estado:** ✅ Completada

---

## HU-21 — Listar ofertas activas para el cliente

**Responsable:** Mateo + David

**Descripción:**
Como cliente, quiero ver una sección de ofertas que muestre solo los productos con descuento activo para aprovechar los precios especiales.

**Tareas cumplidas:**
- El endpoint `GET /api/v1/catalogo/productos/?en_oferta=true` filtra productos con `en_oferta=True` y `esta_activo=True` simultáneamente.
- Productos marcados como en oferta pero inactivos (agotados) no aparecen en el listado.
- La respuesta incluye `en_oferta`, `descuento_porcentaje`, `precio` y demás campos del producto.
- El frontend tiene una sección/vista dedicada que consume este endpoint.

**Criterios de aceptación:**
- GET con `en_oferta=true` retorna solo productos activos con oferta.
- Producto en oferta pero con `esta_activo=False` no aparece en el listado.
- Si no hay ofertas activas, retorna lista vacía `[]` con HTTP 200.

**Estado:** ✅ Completada

---

## HU-22 — Eliminar categorías de productos

**Responsable:** Kevin

**Descripción:**
Como administrador, quiero eliminar categorías que ya no estén en uso para mantener limpio el catálogo de opciones.

**Tareas cumplidas:**
- Endpoint `DELETE /api/v1/inventario/categorias/{id}/` elimina la categoría si existe.
- Si el ID no existe, retorna HTTP 404.
- Si la categoría tiene productos asociados y el ORM lanza `ProtectedError`, retorna HTTP 400 con un mensaje indicando que debe reasignarse los productos primero. (El modelo usa `SET_NULL` en la FK, pero la protección aplica si hay restricciones adicionales.)
- Retorna HTTP 204 sin cuerpo en eliminación exitosa.

**Criterios de aceptación:**
- DELETE sobre categoría sin productos asociados → HTTP 204.
- DELETE sobre ID inexistente → HTTP 404.
- La categoría no persiste en la base de datos tras la eliminación exitosa.

**Estado:** ✅ Completada

---

## HU-23 — Eliminar ofertas de productos

**Responsable:** Mateo + David

**Descripción:**
Como administrador, quiero desactivar la oferta de un producto para que deje de mostrarse como promoción sin necesidad de eliminar el producto.

**Tareas cumplidas:**
- Endpoint `PUT /api/v1/inventario/productos/{id}/` con `en_oferta=False` desactiva la oferta del producto.
- Al desactivar, `descuento_porcentaje` es normalizado a `0` automáticamente por el serializer.
- El producto deja de aparecer en el filtro `?en_oferta=true` del catálogo inmediatamente.
- El producto sigue disponible en el inventario y catálogo general; solo se quita el distintivo de oferta.

**Criterios de aceptación:**
- PUT con `en_oferta=False` sobre producto en oferta → HTTP 200, `descuento_porcentaje` queda en 0.
- El producto desaparece del endpoint `GET /api/v1/catalogo/productos/?en_oferta=true`.
- PUT sobre producto inexistente → HTTP 404.

**Estado:** ✅ Completada
