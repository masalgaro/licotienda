# Definición de Servicios y Asignación de Historias de Usuario

Basado en las **12 Historias de Usuario (HU)** definidas para el sprint actual y las reglas del proyecto (`instruct.md` y `rules.md`), los módulos se han reestructurado para distribuir el trabajo exactamente entre los **4 integrantes**. Se mantiene la exigencia de usar **español** en el código y seguir la **Arquitectura Hexagonal**.

---

## 1. Módulo de Autenticación y Soporte (`usuarios` / `soporte`)
**Responsable:** Kevin (Integrante 1)

*   **Historias de Usuario Asignadas:**
    *   `HU 6`: Enviar Soporte (Lógica para que un usuario contacte a la tienda/admin).
    *   `HU 12`: Mostrar Contacto (Endpoint de info de la tienda).
*   **Responsabilidades Transversales (Core):**
    *   Modelo de usuario personalizado (`AbstractUser`) y configuración de Auth/JWT.
    *   Perfiles y roles (`EsCliente`, `EsAdministrador`).
*   **Enfoque:** Base de seguridad y canales de comunicación cliente-tienda.

## 2. Módulo de Navegación de Catálogo (`catalogo`)
**Responsable:** Miguel (Integrante 2)

*   **Historias de Usuario Asignadas:**
    *   `HU 1`: Listar Productos.
    *   `HU 2`: Buscar Nombre Producto.
*   **Responsabilidades Transversales (Core):**
    *   Modelos de lectura: `Producto` y `Categoria`.
    *   Recuperación de imágenes (signed URLs) desde Supabase.
*   **Enfoque:** Experiencia del cliente navegando la tienda.

## 3. Módulo de Gestión de Inventario (`inventario`)
**Responsable:** David (Integrante 3)

*   **Historias de Usuario Asignadas:**
    *   `HU 7`: Agregar Producto Inventario (Admin).
    *   `HU 8`: Eliminar Producto Inventario (Admin).
    *   `HU 9`: Editar Cantidad de Producto Inventario (Admin).
    *   `HU 10`: Marcar Producto Agotado (Admin).
*   **Responsabilidades:**
    *   Toda la lógica administrativa sobre el catálogo creado por el Integrante 2.
    *   Validaciones de actualización en base de datos.
*   **Enfoque:** Panel de control de productos exclusivo para administradores.

## 4. Módulo de Compras y Verificación (`ventas`)
**Responsable:** Mateo (Integrante 4)

*   **Historias de Usuario Asignadas:**
    *   `HU 3`: Agregar a Carrito.
    *   `HU 4`: Quitar del Carrito.
    *   `HU 5`: Pagar Producto (Checkout / Creación de Pedido).
    *   `HU 11`: Validar Comprobante de Pago (Aprobación admin).
*   **Responsabilidades:**
    *   Agrupar carrito, paso a pedido (gestión de precios estáticos) y logística post-compra (flujo de pago manual).
    *   Integración con Supabase para *subir* el comprobante de pago.
*   **Enfoque:** Flujo transaccional completo, del carrito a la verificación de pago.

---

## Estándares de Implementación (Resumen de Reglas)

1.  **Idioma:** Todo el código (clases, variables, comentarios) debe estar en **español** según `instruct.md` (ej: `clase Producto`, `def calcularTotal()`).
2.  **Arquitectura Hexagonal:** Cada app debe tener su estructura establecida (`dominio/`, `aplicacion/`, `infraestructura/`).
3.  **Nomenclatura:** Variables: `snake_case`, Clases: `PascalCase`, Funciones: `camelCase`.
4.  **Codificación:** Cada `return` debe estar en su propia línea al final.
5.  **Entorno:** Siempre usar el entorno virtual y actualizar `requirements.txt` con `pip freeze`.
