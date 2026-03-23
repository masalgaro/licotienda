#  LA LICO - E-commerce B2C

La Lico es un proyecto de comercio electrónico moderno construido sobre una arquitectura **React/Vite (Client)** y **Django REST Framework (Backend API)**. Esta iniciativa cumple con historias de usuario para gestión de catálogos, carritos en tiempo real con control atómico de inventario, checkouts fluidos de validación anticipada y carga visual integral.

---

##  Organización de la Documentación Oficial

El proyecto se adhiere a la transparencia, registrando sistemáticamente el marco técnico y metodológico:

* Estructura y Micro-Servicios: `docs/definicion_servicios.md`
* Arquitectura Frontend: `docs/GUIA_FRONTEND.md`
* Calidad y Formato CodeBase: `docs/ANALISIS_ESTATICO.md`
* Convenciones Estructurales y PEP-8: `docs/ESTANDARES_NOMBRAMIENTO.md`
* Reporte Final y QA (Testeo Funcional): `docs/REPORTE_FINAL_PRUEBAS.md`

##  Stack Tecnológico y QA Global

* **Backend API:** Python 3.10+ -> Django 6.0 -> DRF -> Pillow (Tratamiento Fotográfico).
* **Frontend:** Node 20+ -> React 19 -> Vite -> Framer Motion -> Axios.
* **Control de Calidad (Static Analysis y Corrección Automática):** 
  * Ruff (Modo Estricto, Python).
  * ESLint y Prettier Plugins (JS, JSX).

El sistema está configurado y ha superado el ciclo perimetral QA con 0 fallos críticos reportados en ventas o serializadores. En cumplimiento, _Ruff_ garantiza la limpieza del árbol y el enforcement de _PEP-8_.

##  Despliegue Local Rápido

### Instalar el API Rest Central (Python)
1. Instalar requerimientos nativos con sus linters integrados: `pip install -r requirements.txt`.
2. Lanzar migraciones en caso de inicialización fría: `python manage.py migrate`.
3. Activar el cerebro relacional: `python manage.py runserver`.
(El servidor escucha activamente en http://127.0.0.1:8000/)

### Instalar la Experiencia Interactiva (React)
1. Cargar dependencias en el submódulo con sus utilidades estáticas: `cd frontend && npm install`.
2. Encender HMR Development: `npm run dev`.
(La tienda se aloja por defecto en el portal dictado por Vite)


