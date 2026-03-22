# Adiciones

Sorprendentemente, no era necesario cambiar mucho, la base del frontend que fue planteada y descrita dentro de `GUIA_FRONTEND.md` ya poseeía la base de la lógica requerida para hacer funcionar la búsqueda de productos y renderizarlos en la página. Yendo por partes, todo dependía de una dependencia que no teníamos y fue agregada.

## CORS (Cross Origin Resource Sharing)

Los [detalles](https://developer.mozilla.org/en-US/docs/Web/Http/Guides/CORS) son accesibles desde el internet fácilmente, pero básicamente es un mecánismo con la intención de permitir recibir información de otros orígenes o servidores. Esto es relevante porque el backend y el frontend se ejecutan en dos puertos distintos y, en condiciones normales, no pueden comunicarse entre sí.

Para solucionar esto se agregó la dependencia `django-cors-headers`, que permite configurar la aplicación de forma que esta comunicación sí funcioné, automáticamente dejándo que la búsqueda y el renderizado de productos funcioné por su cuenta. Con esto ya instalado, todas las tareas futuras del frontend también serán mucho más simples.

### Cambios en el código existente

`requirements.txt` -> Agregada la nueva dependencia.

`settings.py` -> Configuración de CORS:

```python

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders', # <- Agregar corsheaders a la lista de aplicaciones instaladas
    ... # Aquí seguirían todas las aplicaciones que creamos nosotros
]
.
.
.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # <- SIEMPRE mantener el middleware de CORS de primero, o lo más arriba posible.
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
.
.
.
# Y se agregó esta nueva configuración
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Puerto por defecto de Vite.
]
```
Con estos cambios, la funcionalidad básica del sitio web funciona sin problemas.

# Consideraciones adicionales 

Originalmente, mientras buscaba cómo hacer esto, ví que React ya poseeía funciones para mostrar datos de archivos JSON. Esto es obviamente útil débido a cómo el backend entrega la información. Sin embargo, como no es un archivo que tengamos nosotros, sino lo que el backend traduce de la base de datos, adicional a los problemas de acceder a esta información sin CORS, la solución más óptima es la que terminé implementando.

Lo único que considero importante tener en cuenta es si por motivos de seguridad deberíamos mover la URL del frontend (lo que está agregado en CORS_ALLOWED_ORIGINS) a una variable de entorno, pero esto es más por posibles cuestiones de ciberseguridad que deberíamos considerar en los últimos sprint, no una prioridad inmediata.
