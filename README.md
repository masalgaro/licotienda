# LA LICO

Base Django para el e-commerce de `LA LICO`, alineada con el manual de marca:

- `Roboto` para storefront y paneles.
- `Tahoma` para emails transaccionales.
- Paleta cerrada: negro `#000000`, verde `#3AAA35`, blanco `#FFFFFF`.
- Dos únicos assets oficiales de logo: versión sobre negro y versión sobre blanco.

## Rutas incluidas

- `/` home editorial
- `/catalogo/` catálogo
- `/producto/<slug>/` detalle de producto
- `/carrito/` carrito demo
- `/checkout/` checkout demo
- `/emails/orden-confirmada/preview/` preview HTML del email transaccional
- `/admin/` admin con branding ligero

## Desarrollo

```bash
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver
```
