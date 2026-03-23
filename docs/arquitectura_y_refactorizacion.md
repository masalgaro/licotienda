# Arquitectura del Sistema y Refactorización Estructural - La Lico

Este documento detalla la reestructuración física y lógica del proyecto para cumplir con los estándares de arquitectura hexagonal y las reglas del workspace.

## 1. Limpieza y Desmonolitización
Se identificó código frontend infiltrado dentro de la aplicación Django (`licotienda`), lo cual violaba la separación de preocupaciones.

- **Acciones Realizadas:**
    - Eliminación de módulos obsoletos: `storefront` y `backoffice`.
    - Eliminación de carpetas `templates/` y `static/` del backend.
    - El backend (`licotienda`) ahora es **100% una API de servicios**.
    - El frontend oficial reside exclusivamente en la carpeta `/frontend` y utiliza **React + Vite**.

## 2. Implementación de Arquitectura Hexagonal
Se reestructuraron todos los módulos del backend (`catalogo`, `inventario`, `soporte`, `usuarios`, `ventas`) siguiendo el patrón de puertos y adaptadores.

- **Estructura por Módulo:**
    - `dominio/`: Entidades y reglas de negocio puras.
    - `aplicacion/`: Casos de uso y servicios.
    - `infraestructura/`: Modelos de base de datos, serializadores de DRF, vistas (API) y URLs.
- **Beneficio:** Facilidad de mantenimiento, testabilidad y escalabilidad modular.

## 3. Centralización de la API v1
Se unificaron los puntos de acceso a los servicios bajo un prefijo común.

- **Punto de Entrada:** `http://127.0.0.1:8000/api/v1/`
- **Enrutamiento:** Cada módulo gestiona sus propias rutas internas en su carpeta de infraestructura, las cuales son delegadas por el `urls.py` principal del proyecto.

## 4. Consolidación de Base de Datos
Se realizó un proceso de saneamiento de la persistencia de datos.

- **Limpieza de Migraciones:** Se borraron historiales de migraciones conflictivos para iniciar desde un esquema limpio.
- **Nuevos Modelos en Español:**
    - `Usuarios`: Basado en `AbstractUser` con campos personalizados (`telefono`, `direccion_base`).
    - `Inventario`: Modelos `ProductoModelo` y `CategoriaModelo`.
    - `Soporte`: Modelos `SoportePago` e `InfoContacto`.
    - `Ventas`: Modelos `Pedido` e `ItemPedido`.
- **Migración Unificada:** Ejecución de `makemigrations` y `migrate` para generar un esquema relacional sólido y coherente.

## 5. Integración Frontend-Backend
Se configuró el entorno de desarrollo para asegurar una comunicación fluida entre React y Django.

- **CORS:** Configurado para permitir peticiones desde el servidor de desarrollo de Vite.
- **Serialización:** Uso de Django REST Framework para exponer los modelos de infraestructura como recursos JSON consumibles por el frontend.

---
**Estado del Proyecto:**
El sistema pasó todas las pruebas de integridad (`System check identified no issues`) y funciona como una unidad integral con una separación clara entre lógica de negocio, persistencia e interfaz de usuario.
