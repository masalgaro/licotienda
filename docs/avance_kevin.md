# Avance Primera Fase - Usuarios y Soporte (Kevin)
**Documentado por IA**
Les comparto lo que ya quedó listo en el proyecto para que todos podamos seguir trabajando sobre una base sólida. Me enfoqué en dejar montada la estructura principal y las funciones de usuario que acordamos con el cliente.

## 1. El Sistema de "Login" (Sin Contraseñas)
Después de hablarlo, decidí que para una licorera lo mejor es no complicar al cliente con correos y claves. Lo que hice fue:
- **Flujo por teléfono:** Cuando alguien vaya a pagar, el sistema solo le pide el celular. Si el cliente ya ha comprado antes, el sistema le trae automáticamente su nombre y sus direcciones viejas para que no tenga que escribir todo de nuevo.
- **Historial de direcciones:** Un mismo cliente puede tener varias direcciones guardadas (casa, oficina, etc.).
- **Solo el administrador tiene clave:** Nosotros sí entramos con usuario y contraseña al panel de control para gestionar todo.

## 2. Soporte y Contacto (Mis HU)
Ya quedaron listos los dos temas que me tocaban según los requerimientos oficiales:
- **HU 6 (Soporte de Pago):** Implementé el sistema para que los clientes adjunten la captura de su comprobante al comprar. Los pagos quedan en estado **"Pendiente"** hasta que un admin los revise y los pase a **"Aprobado"**. Esto es clave para que Mateo pueda completar el pedido.
- **HU 12 (Contacto y Redes):** Ya configuré los enlaces reales (Instagram, WhatsApp) y la información de ITAGÜÍ que me pasaron. El endpoint ya responde con la info corporativa oficial.

## 3. Estructura del Código (Arquitectura Hexagonal)
Para que el código no sea un desorden, usé lo que hablamos de Arquitectura Hexagonal. Cuando vean las carpetas de `usuarios` o `soporte`, verán esto:
- **aplicacion:** Aquí está la "magia" o la lógica (ej: cómo buscar al cliente por teléfono).
- **infraestructura:** Aquí es donde Django hace su trabajo (modelos de base de datos y las URLs).
- **dominio:** Aquí definiremos las reglas básicas.

**Por favor, cuando creen sus apps (productos, carrito, etc.), intenten seguir estas mismas carpetas para que todo el proyecto se vea igual.**

---

## 5. 🎨 Rediseño UI/UX y Frontend Modular (Nuevo)

Para darle el nivel "Premium" que el negocio de licores requiere, implementé un frontend moderno e independiente:

- **Interfaz "Dark Mode":** Inspirada en la estética urbana y nocturna de las apps de delivery (negro profundo + verde vibrante de LaLico).
- **React + Vite:** Cree un proyecto rápido y fluido en la carpeta `/frontend`. La navegación es instantánea.
- **Arquitectura de Features:** Organicé el código para que sea "enchufable". Mis módulos (Usuarios y Soporte) están aislados en sus propias carpetas dentro de `src/features/`.

**Compañeros:** He dejado una carpeta especial llamada `src/shared/`. Allí puse los estilos generales (colores, botones, logo). Si la usan para sus módulos (Ventas, Productos), todo el proyecto se verá profesional y con la misma identidad visual.

*¡Cualquier duda con el React o cómo conectar sus APIs, me escriben!*
