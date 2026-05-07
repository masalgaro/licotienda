# Calidad de Código — Sprint 3

## Resumen

Durante el Sprint 3 se implementó la separación del panel administrativo del flujo de cliente, incluyendo autenticación JWT y protección de rutas. Todos los criterios de calidad del sprint pasaron sin errores.

---

## Bug corregido: import path incorrecto en OrdersAdminPage

Al activar Vite 8 (que usa rolldown como bundler) se detectó que el import de `config.js` en `OrdersAdminPage.jsx` usaba una ruta incorrecta:

```js
// ❌ Incorrecto — sube tres niveles hasta frontend/, no encuentra el archivo
import { WHATSAPP_NEGOCIO } from '../../../config';

// ✅ Correcto — sube dos niveles hasta src/
import { WHATSAPP_NEGOCIO } from '../../config';
```

**Causa:** Desde `src/features/ventas/`, `../../` llega a `src/` donde vive `config.js`. El path `../../../` subía un nivel más hasta `frontend/`, donde el archivo no existe. Vite 7 (Rollup) resolvía el módulo sin error; Vite 8 (rolldown) valida estrictamente la resolución y falló en build.

**Impacto:** El build de producción fallaba. Se corrigió en `OrdersAdminPage.jsx` línea 3.

---

## Resultado final de verificaciones

| Herramienta | Sprint 2 | Sprint 3 |
|-------------|----------|----------|
| `ruff check .` (backend) | 0 errores | 0 errores |
| `npm run lint` (frontend) | 0 errores | 0 errores |
| `npm run build` (frontend) | ✅ OK | ✅ OK |
| `python manage.py test inventario catalogo ventas` | 17 tests, OK | 17 tests, OK |

Los tests existentes no se vieron afectados: la capa de autenticación JWT es aditiva y no modifica ningún comportamiento de los endpoints de inventario, catálogo ni ventas.

---

## Comandos para verificar en local

```bash
# Backend — linter
ruff check .

# Backend — tests
python manage.py test inventario catalogo ventas

# Frontend — linter (desde carpeta frontend/)
cd frontend
npm run lint

# Frontend — build de producción
npm run build

# Probar login admin manualmente
# Arrancar backend: python manage.py runserver
# Credenciales de prueba: admin / lalico2025
# Endpoint: POST http://127.0.0.1:8000/api/v1/usuarios/admin/login/
# Body: { "username": "admin", "password": "lalico2025" }
```

---

## Notas de seguridad

- El token JWT se almacena en `localStorage` (práctica aceptable para un panel admin interno de uso local; para producción pública considerar `httpOnly cookies`).
- El endpoint de login valida `is_staff=True` a nivel de serializer en el backend, por lo que credenciales válidas de un usuario no-staff retornan HTTP 403 sin emitir ningún token.
- La clave `SECRET_KEY` de Django debe rotarse antes de despliegue en producción (`config/settings.py` línea 5).
