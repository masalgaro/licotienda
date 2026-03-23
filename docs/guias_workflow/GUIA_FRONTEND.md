# 🚀 Guía de Desarrollo Frontend - LaLico Premium

Esta guía detalla la arquitectura, el sistema de diseño y los flujos de trabajo del frontend de **LaLico**, construido con **React + Vite** y alineado con los principios de arquitectura hexagonal del proyecto.

---

## 🏗️ 1. Arquitectura: Modular por Features

Para mantener la escalabilidad y el desacoplamiento, el código se organiza en **módulos funcionales**. Cada carpeta en `src/features/` representa un dominio de negocio.

### Estructura de Carpetas
- **`src/features/`**: Código específico de cada módulo.
  - `catalogo/`: Pantalla principal de la tienda (`StorePage`).
  - `inventario/`: Administración de stock (`InventoryAdminPage`).
  - `soporte/`: Contacto y verificación de pagos (`PaymentSupport`).
  - `usuarios/`: Flujos de identificación y Checkout.
  - `ventas/`: Gestión del carrito y dashboard de pedidos (`OrdersAdminPage`).
- **`src/shared/`**: Recursos compartidos.
  - `CartContext.jsx`: Estado global del carrito.
  - `design-system.css`: **ADN Visual** de la marca.
- **`src/assets/`**: Imágenes estáticas y SVGs.

**Regla de Oro:** La lógica de un módulo debe vivir dentro de su respectiva carpeta en `features`.

---

## 🎨 2. Design System: "The Nocturnal Cellar"

El estilo visual es de alta gama (Premium), basado en **Glassmorphism**, tipografía elegante y micro-animaciones con **Framer Motion**.

### Tokens de Diseño (Variables CSS)
Usa siempre las variables definidas en `src/shared/design-system.css`:

- **Colores**: `--bg-black`, `--surface-dim`, `--primary-green` (#39B54A), `--text-primary`.
- **Tipografía**:
  - Títulos: `--font-display` ('Noto Serif').
  - Cuerpo: `--font-body` ('Manrope').
- **Efectos**: `--glass-bg`, `--glass-blur`, `--shadow-glow`.

### Componentes Estándar
Usa las clases globales para mantener la coherencia:
- `.glass-card`: Contenedor con efecto de cristal y bordes suaves.
- `.btn-primary`: Botón con gradiente esmeralda y sombra de brillo.
- `.premium-input`: Campos de texto oscurecidos con foco resaltado.

---

## 🔗 3. Conexión con Backend (API v1)

Todas las comunicaciones se realizan vía **Axios** hacia el prefijo `/api/v1/`.

- **Base URL**: `http://127.0.0.1:8000/api/v1/`
- **Patrón de Envío**: Para pedidos con transferencia, se utiliza `FormData` para enviar el archivo del comprobante (`ImageField`) junto con el JSON serializado de los items.

```javascript
// Ejemplo de llamada segura
const res = await axios.post('/ventas/pedidos/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

## 🔐 4. Administración y Filtros

El sistema incluye vistas protegidas (conceptualmente) para la gestión del negocio:
- **Dashboard de Pedidos**: `/admin/pedidos`. Permite filtrar por estado (Pagado, Pendiente, Rechazado) y verificar comprobantes de pago subidos por los clientes.
- **Gestión de Inventario**: `/admin/inventario`. Visualización en tiempo real del stock disponible.

---

## 🛠️ 5. Flujo de Trabajo Local

1.  **Preparación**: `cd frontend`
2.  **Instalación**: `npm install`
3.  **Desarrollo**: `npm run dev` (Disponible en `http://localhost:5173`)
4.  **Dependencias Clave**: `axios`, `framer-motion`, `react-router-dom`.

---
**Actualizado por Antigravity - Marzo 2026**

