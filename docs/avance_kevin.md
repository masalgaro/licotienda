# Avance Primera Fase - Usuarios y Soporte (Kevin)

¡Hola equipo! Les comparto lo que ya quedó listo en el proyecto para que todos podamos seguir trabajando sobre una base sólida. Me enfoqué en dejar montada la estructura principal y las funciones de usuario que acordamos con el cliente.

## 1. El Sistema de "Login" (Sin Contraseñas)
Después de hablarlo, decidí que para una licorera lo mejor es no complicar al cliente con correos y claves. Lo que hice fue:
- **Flujo por teléfono:** Cuando alguien vaya a pagar, el sistema solo le pide el celular. Si el cliente ya ha comprado antes, el sistema le trae automáticamente su nombre y sus direcciones viejas para que no tenga que escribir todo de nuevo.
- **Historial de direcciones:** Un mismo cliente puede tener varias direcciones guardadas (casa, oficina, etc.).
- **Solo el administrador tiene clave:** Nosotros sí entramos con usuario y contraseña al panel de control para gestionar todo.

## 2. Soporte y Contacto (Mis HU)
Ya quedaron listos los dos temas que me tocaban:
- **HU 6 (Soporte):** Creé el sistema para que los clientes nos manden mensajes o dudas. Estos mensajes nos llegan directo al panel administrativo.
- **HU 12 (Info de la tienda):** Ya está el endpoint que muestra el teléfono y dirección de la licorera. Solo falta que cuando tengamos los datos reales de la tienda, los metamos en el panel de admin (les dejé una guía de cómo hacerlo en el archivo `MANUAL_DESARROLLO.md`).

## 3. Estructura del Código (Arquitectura Hexagonal)
Para que el código no sea un desorden, usé lo que hablamos de Arquitectura Hexagonal. Cuando vean las carpetas de `usuarios` o `soporte`, verán esto:
- **aplicacion:** Aquí está la "magia" o la lógica (ej: cómo buscar al cliente por teléfono).
- **infraestructura:** Aquí es donde Django hace su trabajo (modelos de base de datos y las URLs).
- **dominio:** Aquí definiremos las reglas básicas.

**Por favor, cuando creen sus apps (productos, carrito, etc.), intenten seguir estas mismas carpetas para que todo el proyecto se vea igual.**

## 4. ¿Cómo probar lo que hice?
Si quieren ver cómo funciona, pueden levantar el servidor y entrar a:
`http://127.0.0.1:8000/api/v1/usuarios/checkout-lookup/` (pasándole un teléfono).

Cualquier duda que tengan con la estructura o si necesitan que les ayude a conectar sus módulos con el de usuarios, me avisan. ¡Vamos con toda!
