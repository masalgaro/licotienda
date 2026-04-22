# Calidad de Código — Sprint 2

## Resumen

Durante el Sprint 2 se resolvieron los problemas de calidad de código pendientes del Sprint 1 y se estableció un pipeline de CI que garantiza que el linter y los tests pasen en cada PR.

---

## Problema encontrado en Sprint 1

Al ejecutar `npm run lint` en el frontend, ESLint reportaba **14 errores** que impedían la validación del código:

```
/frontend/src/features/ventas/CartPage.jsx
  12:1  error  'React' is defined but never used
  ...

✖ 14 problems (14 errors, 0 warnings)
```

Los errores correspondían principalmente a:
- Variables importadas pero no utilizadas en JSX (`React` importado explícitamente en archivos que usan el nuevo JSX Transform de React 17+).
- Reglas de `eslint-plugin-react` activas pero el plugin no estaba declarado correctamente en la configuración flat config de ESLint 9.

---

## Causa raíz

El archivo `eslint.config.js` usaba la **flat config** de ESLint 9 pero no declaraba `eslint-plugin-react` como plugin ni extendía `react.configs.flat.recommended`. Como resultado:

- Las reglas de React no se aplicaban en modo "recomendado" (sin `react-in-jsx-scope: off`), por lo que ESLint exigía `import React` en cada archivo JSX.
- `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh` sí estaban configurados, pero el plugin base de React faltaba.

---

## Solución aplicada

Se reescribió `frontend/eslint.config.js` usando la API correcta de flat config con todos los plugins declarados explícitamente:

```javascript
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,       // ← plugin declarado correctamente
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',    // ← no requiere import React
      'react/prop-types': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
])
```

Cambios clave:
- `react.configs.flat.recommended` extiende las reglas base del plugin.
- `react/react-in-jsx-scope: 'off'` desactiva la regla que exigía `import React` (innecesaria desde React 17 con el nuevo JSX Transform).
- `settings.react.version: 'detect'` elimina la advertencia de versión no especificada.

---

## Resultado final

| Herramienta | Sprint 1 | Sprint 2 |
|-------------|----------|----------|
| `ruff check .` (backend) | 0 errores | 0 errores |
| `npm run lint` (frontend) | 14 errores | 0 errores |
| `python manage.py test` | — | 17 tests, OK |

---

## Comandos para verificar en local

```bash
# Backend — linter
ruff check .

# Backend — formato automático
ruff format .

# Backend — tests
python manage.py test inventario catalogo ventas

# Backend — tests con cobertura
coverage run --source='.' manage.py test inventario catalogo ventas
coverage report

# Frontend — linter (desde carpeta frontend/)
cd frontend
npm run lint
```
