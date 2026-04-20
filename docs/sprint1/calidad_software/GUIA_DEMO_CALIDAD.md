# Guía de Demo Técnica - Elementos de Calidad del Software

Esta guía detalla paso a paso cómo realizar la demostración técnica en vivo de las herramientas de calidad de código implementadas en el proyecto LaLico.

**Requisitos previos:**
- Tener el backend corriendo (`python manage.py runserver` desde `Lalico/`)
- Tener el frontend corriendo (`npm run dev` desde `Lalico/frontend/`)
- Terminal abierta en la raíz del proyecto (`d:\PROYECTO 2\Lalico`)

---

## PARTE 1: Análisis Estático Funcionando (Verificación Limpia)

El objetivo es demostrar que el código actual del proyecto pasa todas las reglas de calidad sin errores.

### 1.1 Backend (Ruff - Python)

Abrir la terminal en la raíz del proyecto y ejecutar:

```bash
python -m ruff check .
```

**Resultado esperado:** El comando no arroja errores. Esto demuestra que todo el código Python cumple con:
- PEP-8 (estilo oficial de Python)
- Convenciones de nombramiento (PascalCase en clases, snake_case en funciones)
- Imports ordenados y sin duplicados
- Reglas específicas de Django

### 1.2 Frontend (ESLint - React/JS)

Abrir la terminal, navegar al frontend y ejecutar:

```bash
cd frontend
npm run lint
```

**Resultado esperado:** El comando no arroja errores. Esto demuestra que todo el código JavaScript/JSX cumple con las reglas de React Hooks, variables sin uso y buenas prácticas del ecosistema.

---

## PARTE 2: Auto-Corrección en Vivo (Formateador Automático)

El objetivo es demostrar que las herramientas pueden **corregir automáticamente** errores de estilo sin intervención humana.

### 2.1 Backend - Demostración con Ruff Format

**Paso 1:** Abrir cualquier archivo Python del proyecto, por ejemplo `inventario/infraestructura/views.py`, e introducir errores de estilo intencionalmente:

```python
# ANTES (código limpio):
from rest_framework.views import APIView
from rest_framework.response import Response

class InventarioProductoListView(APIView):
    def get(self, request):
        productos = ProductoModelo.objects.all()
```

```python
# DESPUÉS (código desordenado a propósito):
from rest_framework.response import Response
from rest_framework.views import APIView


class InventarioProductoListView(  APIView  ):
    def get(  self,    request  ):
        productos=ProductoModelo.objects.all()
```

**Paso 2:** Guardar el archivo con los errores y ejecutar en la terminal:

```bash
python -m ruff format .
```

**Paso 3:** Volver al archivo y mostrar que Ruff automáticamente:
- Reordenó los imports alfabéticamente
- Eliminó los espacios innecesarios dentro de los paréntesis
- Restableció el espaciado correcto alrededor del signo `=`

**Paso 4:** Deshacer los cambios del archivo (Ctrl+Z) para dejarlo como estaba.

### 2.2 Frontend - Demostración con Prettier

**Paso 1:** Abrir cualquier archivo JSX, por ejemplo `frontend/src/App.jsx`, e introducir errores de formato:

```jsx
// Cambiar comillas, quitar punto y coma, desordenar indentación
import React from "react"
    const App = () => {
return (
            <div>
    <h1>Hola</h1>
                </div>
    )
}
```

**Paso 2:** Ejecutar en la terminal desde la carpeta `frontend/`:

```bash
npx prettier --write src/App.jsx
```

**Paso 3:** Mostrar cómo Prettier automáticamente:
- Cambió las comillas dobles a simples (según nuestra configuración en `.prettierrc`)
- Agregó punto y coma al final de las líneas
- Corrigió toda la indentación a 4 espacios uniformes

**Paso 4:** Deshacer los cambios (Ctrl+Z) para dejarlo como estaba.

---

## PARTE 3: Enforcement de Nombramiento (Reglas Estrictas)

El objetivo es demostrar que si alguien escribe código con nombres que violan el estándar, la herramienta **lo detecta y lo rechaza**.

### 3.1 Violación de PascalCase en Clases Python

**Paso 1:** Crear un archivo temporal de prueba en la raíz del proyecto:

```bash
echo "class mi_clase_mal_nombrada:" > test_naming.py
echo "    pass" >> test_naming.py
```

O simplemente crear el archivo `test_naming.py` con este contenido:

```python
class mi_clase_mal_nombrada:
    pass
```

**Paso 2:** Ejecutar el análisis:

```bash
python -m ruff check test_naming.py
```

**Resultado esperado:** Ruff arroja un error de la regla **N801** indicando:

```
test_naming.py:1:7: N801 Class name `mi_clase_mal_nombrada` should use CapWords convention
```

**Explicación al profesor:** La regla N801 de `pep8-naming` obliga a que todas las clases de Python sigan la convención PascalCase (CapWords). Si un desarrollador intenta hacer commit de un código con una clase mal nombrada, Ruff lo detectará automáticamente y lo rechazará. El nombre correcto sería `MiClaseMalNombrada`.

**Paso 3:** Eliminar el archivo de prueba después de la demo:

```bash
del test_naming.py
```

### 3.2 Violación de snake_case en Funciones Python (Opcional)

**Paso 1:** Crear otro archivo temporal:

```python
# test_naming2.py
def MiFuncionMalNombrada():
    pass
```

**Paso 2:** Ejecutar:

```bash
python -m ruff check test_naming2.py
```

**Resultado esperado:** Error **N802**:

```
test_naming2.py:1:5: N802 Function name `MiFuncionMalNombrada` should be lowercase
```

**Paso 3:** Eliminar el archivo:

```bash
del test_naming2.py
```

---

## PARTE 4: Pruebas Funcionales del E-Commerce (Opcional)

Si el profesor solicita ver pruebas funcionales además de la calidad de código, mostrar el siguiente flujo:

### 4.1 Flujo de Inventario (Admin)
1. Ingresar al panel administrativo
2. Crear un nuevo producto (demostrar que NO deja crear sin imagen)
3. Crear un producto con imagen correctamente
4. Intentar crear una categoría como "licoressss" y mostrar el rechazo ortográfico
5. Mostrar la alerta de stock bajo (< 5 unidades) y el letrero "AGOTADO" (0 unidades)

### 4.2 Flujo de Compra (Cliente)
1. Agregar productos al carrito
2. Intentar comprar un producto agotado (debe rechazar)
3. Hacer click en "Proceder al Checkout" y mostrar la validación anticipada de stock
4. Completar una compra exitosa con transferencia bancaria (mostrar los datos de Bancolombia)

### 4.3 Integridad Transaccional
1. Agregar al carrito un producto con pocas unidades
2. Intentar comprar más unidades de las disponibles
3. Verificar que el stock NO se redujo en el panel admin (rollback atómico funcionando)

---

## Resumen de Comandos Clave para la Demo

| Herramienta | Comando | Propósito |
|:---|:---|:---|
| **Ruff (Linter)** | `python -m ruff check .` | Analizar código Python y detectar errores |
| **Ruff (Formateador)** | `python -m ruff format .` | Auto-corregir formato de código Python |
| **Ruff (Fix automático)** | `python -m ruff check --fix .` | Corregir errores reparables automáticamente |
| **ESLint** | `npm run lint` (desde `frontend/`) | Analizar código JavaScript/React |
| **Prettier** | `npx prettier --write src/` (desde `frontend/`) | Auto-corregir formato de código JS/JSX |

---

## Documentación de Referencia

- Estándares de Nombramiento: `docs/calidad_software/ESTANDARES_NOMBRAMIENTO.md`
- Análisis Estático: `docs/calidad_software/ANALISIS_ESTATICO.md`
- Configuración Ruff: `ruff.toml` (raíz del proyecto)
- Configuración Prettier: `frontend/.prettierrc`
