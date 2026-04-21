# Estrategia de Pruebas Automáticas — Sprint 2

## Organización

Las pruebas siguen la convención estándar de Django: cada app tiene su propio `tests.py` junto al código que validan. No existe una carpeta `tests/` separada.

```
inventario/tests.py   → HU-15, HU-16, HU-19, HU-20, HU-21, HU-22, HU-23
catalogo/tests.py     → HU-13, HU-17, HU-21 (filtro catálogo)
ventas/tests.py       → HU-18
```

---

## Tabla de cobertura

| HU    | Descripción                        | Clase de prueba                        | Happy Path                                                     | Flujo Alternativo                                                       | Archivo               |
|-------|------------------------------------|----------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------|-----------------------|
| HU-13 | Buscar por categoría               | `CatalogoBusquedaPorCategoriaTests`    | Filtra correctamente retornando solo productos de la categoría | Categoría inexistente retorna `[]` con HTTP 200                          | `catalogo/tests.py`   |
| HU-15 | Agregar categorías                 | `InventarioCrearCategoriaTests`        | Crea categoría nueva → HTTP 201 + registro en BD               | Nombre duplicado → HTTP 400 con campo `nombre` en error                  | `inventario/tests.py` |
| HU-16 | Agregar ofertas                    | `InventarioOfertaTests`                | Producto con `en_oferta=True` visible en filtro de ofertas     | Crear producto con `en_oferta=True` y `descuento=0` → HTTP 400           | `inventario/tests.py` |
| HU-17 | Ver stock en producto              | `CatalogoStockVisibleTests`            | Campo `existencias` presente con valor correcto en catálogo    | Producto con `esta_activo=False` excluido del catálogo                   | `catalogo/tests.py`   |
| HU-18 | Info cliente en pedido a domicilio | `VentasPedidoDomicilioTests`           | Pedido creado con nombre, teléfono, dirección almacenados      | Pedido sin teléfono → HTTP 400, cero registros creados en BD             | `ventas/tests.py`     |
| HU-19 | Editar categorías                  | `InventarioEditarCategoriaTests`       | Nombre actualizado → HTTP 200 + cambio persistido en BD        | ID inexistente → HTTP 404                                                | `inventario/tests.py` |
| HU-20 | Editar ofertas                     | `InventarioOfertaTests`                | Desactivar oferta normaliza `descuento_porcentaje` a 0         | Actualizar con `en_oferta=True` y `descuento=0` → HTTP 400               | `inventario/tests.py` |
| HU-21 | Listar ofertas activas             | `CatalogoOfertaFilterTests`            | Solo productos activos con oferta aparecen en filtro           | Producto en oferta pero inactivo no aparece en resultados                | `catalogo/tests.py`   |
| HU-22 | Eliminar categorías                | `InventarioEliminarCategoriaTests`     | Elimina categoría sin productos → HTTP 204 + eliminada en BD   | ID inexistente → HTTP 404                                                | `inventario/tests.py` |
| HU-23 | Eliminar ofertas                   | `InventarioOfertaTests`                | Desactivar oferta → producto sale del filtro `?en_oferta=true` | PUT sobre producto inexistente → HTTP 404                                | `inventario/tests.py` |

**Total: 17 pruebas — distribuidas en 3 apps.**

---

## Cómo correr los tests

```bash
# Desde la raíz del proyecto (con el virtualenv activo)
python manage.py test inventario catalogo ventas
```

**Resultado esperado:**

```
Ran 17 tests in 0.108s

OK
```

---

## Cobertura de código

```bash
# Correr tests midiendo cobertura
coverage run --source='.' manage.py test inventario catalogo ventas

# Ver reporte en consola
coverage report
```

El reporte muestra el porcentaje de líneas ejecutadas por módulo. En el CI de GitHub Actions este reporte aparece en el log de la corrida.

---

## Integración Continua (GitHub Actions)

El workflow `.github/workflows/ci.yml` corre automáticamente en cada Pull Request y push a `main`:

- **Job `backend`**: ejecuta `coverage run ... manage.py test` + `coverage report`.
- **Job `frontend`**: ejecuta `npm run lint`.

Si cualquiera de los dos jobs falla, GitHub bloquea el merge del PR. Los resultados quedan visibles en la pestaña "Actions" del repositorio.

---

## Por qué Django TestCase

| Criterio                  | Justificación                                                                                      |
|---------------------------|---------------------------------------------------------------------------------------------------|
| Integración nativa con ORM | Cada test se envuelve en una transacción y usa una base de datos de prueba aislada en memoria     |
| Sin dependencias externas  | Solo requiere lo que ya está en `requirements.txt`; no se necesita pytest ni factory_boy          |
| Base de datos limpia       | Cada test parte de estado vacío; no hay contaminación entre pruebas                               |
| Cliente HTTP integrado     | `self.client` simula peticiones HTTP reales contra las vistas Django sin levantar servidor        |
| Velocidad                  | 17 tests en ~0.1 segundos con SQLite en memoria                                                   |
