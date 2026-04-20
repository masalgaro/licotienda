# Estrategia de Pruebas Automáticas — La Lico

## Organización de las pruebas

Cada app de Django tiene su propio archivo `tests.py` siguiendo la convención estándar de Django. No existe una carpeta `tests/` separada; las pruebas viven junto al código que validan, lo que facilita el mantenimiento y la trazabilidad por dominio.

```
inventario/tests.py   → HU-15, HU-16, HU-19, HU-20, HU-21, HU-22, HU-23
catalogo/tests.py     → HU-13, HU-17
ventas/tests.py       → HU-18
```

## Cómo correr las pruebas

```bash
# Desde la raíz del proyecto (con el virtualenv activo)
python manage.py test inventario catalogo ventas
```

**Resultado esperado:**

```
Ran 17 tests in 0.108s

OK
```

## Cobertura por Historia de Usuario

| HU    | Descripción                                   | Happy Path                                              | Flujo Alternativo                                          | Archivo                |
|-------|-----------------------------------------------|----------------------------------------------------------|------------------------------------------------------------|------------------------|
| HU-13 | Buscar productos por categoría en el catálogo | Filtra correctamente por categoría existente             | Categoría inexistente retorna lista vacía (200 [])         | `catalogo/tests.py`    |
| HU-15 | Agregar categorías a productos                | Crea categoría nueva → 201 Created                       | Rechaza categoría duplicada → 400 Bad Request              | `inventario/tests.py`  |
| HU-16 | Crear oferta con precio especial              | Crea oferta activa → 201, visible en catálogo            | Oferta sin precio rechazada → 400                          | `inventario/tests.py`  |
| HU-17 | Ver cantidad de stock en vista de producto    | Producto expone campo `existencias` con valor correcto   | Producto agotado (existencias=0) no aparece en catálogo    | `catalogo/tests.py`    |
| HU-18 | Incluir info del cliente en pedido a domicilio| Crea pedido con dirección, nombre, teléfono del cliente  | Pedido sin teléfono rechazado → 400, sin registros creados | `ventas/tests.py`      |
| HU-19 | Editar categorías de productos existentes     | Edita nombre de categoría → 200 OK                       | Editar categoría inexistente → 404 Not Found               | `inventario/tests.py`  |
| HU-20 | Crear oferta con descuento porcentual         | Crea oferta con descuento → 201, precio calculado        | Oferta con descuento negativo rechazada → 400              | `inventario/tests.py`  |
| HU-21 | Listar ofertas activas para el cliente        | GET /ofertas/ retorna solo ofertas activas               | Sin ofertas activas retorna lista vacía                    | `inventario/tests.py`  |
| HU-22 | Eliminar categorías de productos              | Elimina categoría sin productos → 204 No Content         | Eliminar categoría inexistente → 404 Not Found             | `inventario/tests.py`  |
| HU-23 | Desactivar oferta                             | Desactiva oferta → 200, desaparece del catálogo cliente  | Desactivar oferta inexistente → 404                        | `inventario/tests.py`  |

**Total: 17 pruebas — 10 happy path + 7 flujos alternativos**

## Proceso de validación

1. Se escribieron las pruebas **antes de verificar** el comportamiento de los endpoints (enfoque TDD-adjacent).
2. Se ejecutó `python manage.py test` después de cada clase de prueba agregada para detectar fallos inmediatamente.
3. Los errores encontrados durante el proceso:
   - Python 3.14 requiere `__init__.py` en cada app para que `unittest.TestLoader` descubra los tests. Se crearon archivos vacíos en `catalogo/` y `ventas/`.
   - Importaciones relativas (`from .infraestructura.models`) fallaban sin el paquete configurado; se cambiaron a absolutas.
4. Corrida final confirmó 17 tests, 0 fallos, 0 errores.

## Por qué Django TestCase

| Criterio                  | Decisión                                                                                      |
|---------------------------|-----------------------------------------------------------------------------------------------|
| Integración con ORM       | `TestCase` envuelve cada test en una transacción y usa una base de datos de prueba aislada   |
| Sin dependencias externas | No requiere pytest, factory_boy ni fixtures adicionales; funciona con `pip install -r requirements.txt` |
| Base de datos limpia      | Cada test parte de un estado vacío; no hay contaminación entre pruebas                       |
| Cliente HTTP integrado    | `self.client` simula peticiones HTTP reales contra las vistas Django sin levantar servidor    |
| Velocidad                 | 17 tests en ~0.1 segundos en SQLite de memoria                                               |

## Notas adicionales

- Las pruebas de backend (Django) cubren la lógica de negocio y los endpoints REST.
- Las pruebas de frontend (Vitest/React) cubren componentes de interfaz; ver [test/sprint2/README.md](sprint2/README.md).
- Para correr solo un módulo: `python manage.py test inventario`
- Para correr una clase específica: `python manage.py test inventario.tests.InventarioCrearCategoriaTests`
