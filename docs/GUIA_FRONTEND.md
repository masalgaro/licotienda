#  Guía de Desarrollo Frontend - LaLico Premium
**Documentado por IA**
Esta guía explica cómo trabajar en el frontend de **LaLico** (React + Vite) de forma organizada y profesional.

---

##  1. Arquitectura "Modular por Features"
Para evitar que nos pisemos el código, el frontend se organiza por carpetas dentro de `src/features/`.

- **`src/features/usuarios/`**: Todo lo relacionado con el cliente y checkout (Módulo Kevin).
- **`src/shared/`**: Contiene el **ADN de la marca** (CSS global y logo). 
- **REGLA DE ORO:** Si creas un nuevo módulo (ej: Ventas), crea una carpeta `src/features/ventas/`. **No escribas lógica fuera de tu carpeta.**

---

##  2. Cómo usar el "Design System"
He configurado un archivo `src/shared/design-system.css` con variables CSS para que todo hable el mismo idioma visual:

| Variable | Uso | Valor |
| :--- | :--- | :--- |
| `--bg-black` | Fondo de página | `#000000` |
| `--primary-green`| Botones y acentos | `#39B54A` |
| `--surface-1` | Tarjetas y contenedores | `#121212` |
| `--text-primary` | Texto principal | `#ffffff` |

### Ejemplo para un botón premium:
```jsx
<button className="btn-primary">Confirmar Compra</button>
```

---

## 🔗 3. Conexión con el Backend (Django)
Usamos **Axios** para consumir las APIs del servidor Django.

1. Asegúrate de que el servidor de Django está corriendo en `http://127.0.0.1:8000`.
2. Ejemplo de llamada a la API en un componente:
```javascript
import axios from 'axios';

const fetchDatos = async () => {
   const response = await axios.get('http://127.0.0.1:8000/api/v1/tu-endpoint/');
   console.log(response.data);
};
```

---

## 🛠️ 4. Cómo empezar a trabajar
1. Abre tu terminal en la carpeta `/frontend`.
2. Ejecuta `npm install` (solo la primera vez).
3. Ejecuta `npm run dev` para levantar el servidor de desarrollo.
4. Entra a `http://localhost:5173/`.


