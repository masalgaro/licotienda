# Historias de Usuario — Sprint 3

## Resumen

| HU    | Descripción                                          | Responsable | Estado        |
|-------|------------------------------------------------------|-------------|---------------|
| HU-24 | Autenticación JWT para el panel de administrador     | Kevin       | ✅ Completada |
| HU-25 | Proteger rutas admin con redirección a login         | Kevin       | ✅ Completada |
| HU-26 | Ocultar acceso admin de la navegación del cliente    | Kevin       | ✅ Completada |
| HU-14 | Marcar pedidos a domicilio o para recoger en tienda  | Miguel      |  En revisión  |
---

## HU-24 — Autenticación JWT para el panel de administrador

**Responsable:** Kevin

**Descripción:**
Como administrador, quiero iniciar sesión con usuario y contraseña para acceder al panel de gestión de inventario y pedidos, de forma que usuarios no autorizados no puedan operar el sistema.

**Tareas cumplidas:**
- Configurado `REST_FRAMEWORK` en `config/settings.py` con `JWTAuthentication` como clase de autenticación por defecto.
- Configurado `SIMPLE_JWT` con `ACCESS_TOKEN_LIFETIME = 8 horas` (suficiente para una jornada laboral) y `REFRESH_TOKEN_LIFETIME = 1 día`.
- Implementado `AdminTokenObtainPairSerializer` en `usuarios/infraestructura/views.py` que extiende `TokenObtainPairSerializer` y valida que el usuario tenga `is_staff=True`; si no, lanza `PermissionDenied` (HTTP 403).
- Implementado `AdminLoginView` (subclase de `TokenObtainPairView`) usando el serializer anterior.
- Registrados los endpoints en `usuarios/urls.py`:
  - `POST /api/v1/usuarios/admin/login/` → obtener par de tokens (access + refresh).
  - `POST /api/v1/usuarios/admin/token-refresh/` → renovar access token con el refresh token.
- Creado superusuario de prueba (`admin` / `lalico2025`) para validar el flujo completo.

**Criterios de aceptación:**
- `POST /api/v1/usuarios/admin/login/` con credenciales de usuario `is_staff=True` → HTTP 200 con `access` y `refresh` tokens.
- `POST /api/v1/usuarios/admin/login/` con credenciales correctas pero `is_staff=False` → HTTP 403.
- `POST /api/v1/usuarios/admin/login/` con credenciales incorrectas → HTTP 401.
- El access token tiene vigencia de 8 horas.

**Archivos modificados:**
- `config/settings.py` — bloques `REST_FRAMEWORK` y `SIMPLE_JWT` añadidos.
- `usuarios/infraestructura/views.py` — clases `AdminTokenObtainPairSerializer` y `AdminLoginView`.
- `usuarios/urls.py` — rutas `admin/login/` y `admin/token-refresh/`.

**Estado:** ✅ Completada

---

## HU-25 — Proteger rutas admin con redirección a login

**Responsable:** Kevin

**Descripción:**
Como sistema, quiero que las rutas `/admin/inventario` y `/admin/pedidos` solo sean accesibles si existe un token JWT válido en `localStorage`, redirigiendo a `/admin/login` en caso contrario, para impedir acceso directo por URL sin autenticación.

**Tareas cumplidas:**
- Creado `frontend/src/shared/PrivateRoute.jsx`: lee `admin_token` de `localStorage`; si existe renderiza el componente hijo, si no redirige a `/admin/login` con `replace` para evitar entrada en el historial de navegación.
- Creado `frontend/src/features/usuarios/AdminLoginPage.jsx`:
  - Formulario con campos `username` y `password`.
  - `POST` a `/api/v1/usuarios/admin/login/` con `axios`.
  - En éxito: guarda el access token en `localStorage` bajo la clave `admin_token` y redirige a `/admin/pedidos`.
  - Mensajes de error diferenciados: HTTP 401 → "Usuario o contraseña incorrectos", HTTP 403 → "No tiene permisos de administrador", otros → mensaje genérico.
- Actualizado `frontend/src/App.jsx`:
  - Ruta pública: `<Route path="/admin/login" element={<AdminLoginPage />} />`.
  - Rutas protegidas: `/admin/inventario` y `/admin/pedidos` envueltas en `<PrivateRoute>`.
- Añadido botón "Cerrar sesión" (ícono `LogOut` de `lucide-react`) en el `<header>` de `InventoryAdminPage.jsx` y `OrdersAdminPage.jsx`: limpia `admin_token` de `localStorage` y redirige a `/admin/login`.

**Criterios de aceptación:**
- Acceder a `/admin/inventario` o `/admin/pedidos` sin token → redirección inmediata a `/admin/login`.
- Login exitoso con credenciales de admin → token guardado en `localStorage.admin_token`, redirección a `/admin/pedidos`.
- Botón "Cerrar sesión" en ambas páginas admin → token eliminado, redirección a `/admin/login`.
- El cliente que navega por la tienda nunca es redirigido a `/admin/login`.

**Archivos nuevos:**
- `frontend/src/shared/PrivateRoute.jsx`
- `frontend/src/features/usuarios/AdminLoginPage.jsx`

**Archivos modificados:**
- `frontend/src/App.jsx`
- `frontend/src/features/inventario/InventoryAdminPage.jsx`
- `frontend/src/features/ventas/OrdersAdminPage.jsx`

**Estado:** ✅ Completada

---

## HU-26 — Ocultar acceso admin de la navegación del cliente

**Responsable:** Kevin

**Descripción:**
Como cliente, no quiero ver ningún enlace de "Admin" en la navegación de la tienda, para que la interfaz pública sea limpia y no exponga el panel de gestión.

**Tareas cumplidas:**
- Eliminado el `<Link to="/admin/pedidos">` (etiqueta ADMIN) de la navbar superior (líneas 147–152) y de la navbar inferior (líneas 354–357) de `frontend/src/features/catalogo/StorePage.jsx`.
- Eliminado el `<Link to="/admin/pedidos">` (etiqueta Admin) de la bottom-nav (líneas 200–203) de `frontend/src/features/ventas/CartPage.jsx`.
- Eliminado el `<Link to="/admin/pedidos">` (etiqueta Admin) de la bottom-nav (líneas 115–118) de `frontend/src/features/soporte/Contact.jsx`.
- El panel admin sigue siendo accesible por URL directa (`/admin/login`) para el administrador que conoce la ruta.

**Criterios de aceptación:**
- Ninguna página del flujo de cliente (tienda, carrito, contacto) muestra enlace al panel admin.
- Navegar directamente a `/admin/login` sigue funcionando correctamente.
- `npm run lint` y `npm run build` pasan sin errores tras los cambios.

**Archivos modificados:**
- `frontend/src/features/catalogo/StorePage.jsx`
- `frontend/src/features/ventas/CartPage.jsx`
- `frontend/src/features/soporte/Contact.jsx`

**Estado:** ✅ Completada

---

## HU-14 — Marcar pedidos como domicilio o para recoger en tienda 

**Responsable:** Miguel

**Descripción:**
Como cliente quiero pedir productos a domicilio para hacer una compra más cómoda, desde la comodidad de mi casa, por si no me es posible ir a la tienda física.

**Tareas cumplidas:**
- Se agregó el estado "ENTREGADO" para los pedidos, referenciado tanto en `ventas/infrastructura/models.py` y `ventas/infrastructura/views.py`.
- Se agregó un campo para validar si un pedido es a domicilio o no, visto en `ventas/infrastructura/serializers.py`, `ventas/infrastructura/views.py` y `ventas/infrastructura/models.py`.
- Se configuró un endpoint para que un admin pueda cambiar el estado de los pedidos, siguiendo una mátriz de transición, visto en `ventas/infrastructura/views.py`.
- Se agregó un toggle en la vista `frontend/src/features/usuarios/Checkout.jsx` para escoger entre un pedido que se recoge en tienda y un pedido a domicilio. El toggle, además, oculta los campos de dirección cuando se quiere recoger en tienda.
- Se agregó un icono distintivo para los pedidos a domicilio en el panel de admin, visto en `frontend/src/features/ventas/OrdersAdminPage.jsx`.
- Se agregó un endpoint nuevo a `ventas/infrastructura/views.py` para hacer el seguimiento del pedido, y se conecta con el frontend en `frontend/src/features/usuarios/Checkout.jsx` para mostrar el estado actual.
- Se implementarón pruebas automáticas en `ventas/tests.py` para las nuevas funcionalidades.
- Se implementarón pruebas automáticas en `frontend/src/features/usuarios/Checkout.test.jsx` y `frontend/src/features/ventas/OrdersAdminPage.test.jsx` para las nuevas funcionalidades.

**Criterios de aceptación:**
- Se debe cumplir que marcar entre un pedido a domicilio a uno corriente sea claro y sencillo para el usuario, y lo mismo en el orden contrario.
- Se debe cumplir que un pedido a domicilio aparezca de forma especial al administrador del sitio.
- Notificar al usuario cuando su pedido cambie al estado de despachado.
- `python -m ruff check .` en la raíz del proyecto, y `npm run lint` y `npm run build` en el directorio `frontend` pasan sin errores.

**Archivos modificados:**
- `ventas/urls.py`
- `ventas/infrastructura/models.py`
- `ventas/infrastructura/views.py`
- `ventas/infrastructura/serializers.py`
- `ventas/tests.py`
- `frontend/src/features/usuarios/Checkout.jsx`
- `frontend/src/features/ventas/OrdersAdminPage.jsx`
- `frontend/src/features/ventas/OrdersAdminPage.test.jsx`
- `frontend/src/features/usuarios/Checkout.test.jsx` <- **Archivo nuevo**

**Estado:** En revisión
