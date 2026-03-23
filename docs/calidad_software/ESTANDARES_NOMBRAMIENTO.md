# Estándares de Nombramiento (Naming Conventions)

Este documento justifica y establece los estándares oficiales adoptados para la escritura de código en el proyecto eCommerce "La Lico". Su objetivo es mantener homogeneidad arquitectónica y escalabilidad a lo largo del tiempo.

## 1. Backend (Python / Django)

El ecosistema Python del servidor se acoge estrictamente al estándar mundial oficial **PEP-8**. 

### Reglas Aplicadas:
- **Clases (Modelos, Vistas, Serializadores):** `PascalCase` (UpperCamelCase). 
  - *Ejemplo:* `CategoriaModelo`, `ListarPedidosView`.
  - *Justificación:* Separa visualmente las estructuras o moldes abstractos de las variables iterables.
- **Variables, Funciones y Métodos:** `snake_case` (minúsculas separadas por guión bajo).
  - *Ejemplo:* `validar_carrito`, `creado_en`.
  - *Justificación:* Es el estándar oficial de Python (PEP-8) que favorece la legibilidad sobre la compacidad.
- **Constantes:** `UPPER_SNAKE_CASE` (mayúsculas sostenidas).
  - *Ejemplo:* `MAX_DIGITS_PRECIO`.
  - *Justificación:* Distinguir variables mutables de estados inmutables en tiempo real.

> **Enforcement:** Estas reglas son vigiladas y controladas automáticamente por el Linter **Ruff** configurado en `ruff.toml`.

---

## 2. Frontend (JavaScript / React)

La interfaz de usuario del proyecto adopta convenciones recomendadas por la comunidad y documentación contemporánea de **React.js**.

### Reglas Aplicadas:
- **Componentes de React y Archivos de Página:** `PascalCase`.
  - *Ejemplo:* `InventoryAdminPage.jsx`, `StorePage.jsx`.
  - *Justificación:* Ayuda a los analizadores JSX (y al desarrollador) a distinguir visualmente entre una etiqueta HTML estándar (`<div>`, `<button>`) y un componente React.
- **Variables, Funciones Nativas y Hooks:** `camelCase`.
  - *Ejemplo:* `handleProceedToCheckout`, `fetchData`.
  - *Justificación:* Es la sintaxis preferente de ECMAScript / JavaScript tradicional. 
- **Archivos No-Componentes (Módulos / Estilos):** `kebab-case` o `snake_case` (dependiendo el stack).
  - *Ejemplo:* `index.css`.
  - *Justificación:* Seguridad y previsibilidad en despliegues sobre sistemas operativos sensibles a mayúsculas como Linux/Ubuntu.

> **Enforcement:** Estas reglas son vigiladas por **ESLint** a través del comando `npm run lint`. Adicionalmente, el formato estructural (tabs, comillas simples) es controlado por el estándar de **Prettier**.
