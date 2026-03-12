# ¿Qué hacer?

Con el fin de hacer la aplicación lo mejor posible, sería ideal que cada uno se enfocara en un servicio diferente (carrito, gestión de inventario, listar productos, etc).

Para lograr esto, Django trabaja con una arquitectura de microservicios que llama como 'apps', las cuales pueden ser creadas con la terminal.

Para hacer esto se debe hacer lo siguiente:

```bash
cd licotienda # Nos ponemos dentro de la carpeta del proyecto principal
python manage.py startapp nombre_app # Reemplazando nombre_app por el nombre del serivicio como carrito. Es decir:
python manage.py startapp carrito
# Es posible que en vez de python sea necesario llamar a python3 según tu computador. El comando es el mismo:
python3 manage.py startapp carrito
```

## Dependencias

Es posible que a medida que expandimos el proyecto necesitemos más dependencias. Para evitar errores y demás, usaremos el archivo de requirements.txt, que permite a pip instalar especificamente las dependencias que necesitamos y en la versión exacta.

**Para agregar** dependencias nuevas al archivo, solo hay que ejecutar `pip freeze > requirements.txt`, lo que agregará todas las dependencias en el entorno virtual al archivo.

**Para descargar** dependencias desde el archivo, hay que ejecutar `pip install -r requirements.txt`.

Recordemos siempre usar un entorno virtual. El .gitignore ya incluye algunos nombres típicos de entornos virtuales, así que de lo posible usemos alguno de esos nombres.

# Estándares a usar

Los más básicos son los recomendados de Python:

* Variables en **snake_case**
* Clases en **PascalCase**
* Métodos en **camelCase**

Adicional, algunas prácticas que ayudarían a hacer el código más fácil de mantener y leer:

* Poner cada `return` en una línea propia al final de un método.
* Intentemos manejar variables, clases, funciones, etc., en español. Evitemos mezclar idiomas de ser posible.

# Este documento

Esta guía es más para nosotros, y para dejar de evidencia en el repositorio. En un entorno real normalmente no incluiríamos esto.

Este documento seguramente va a ser expandido a medida que sigamos en el desarrollo, o se creen otros documentos a forma de guía o documentación. Por favor crear todos estos archivos dentro la carpeta `docs`. El formato puede ser un archivo de texto plano, o un archivo de markdown. Algo que sea liviano y fácil de leer desde un IDE para ahorrarnos tiempo.

