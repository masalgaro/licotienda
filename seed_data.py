import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo
from ventas.infraestructura.models import ItemPedido, Pedido


def populate():
    # 1. Limpiar datos existentes
    print("Limpiando datos antiguos...")
    ItemPedido.objects.all().delete()
    Pedido.objects.all().delete()
    ProductoModelo.objects.all().delete()
    CategoriaModelo.objects.all().delete()

    # 2. Definición de Categorías
    categorias_data = {
        "Licores": "Licores diferentes a Aguardiente y Ron",
        "Aguardiente": "Toda clase de aguardientes.",
        "Rones": "Toda clase de rones",
        "Snacks": "Toda clase de snacks comestibles",
        "Cervezas": "toda clase de cervezas.",
    }

    # 3. Datos de Productos por Categoría
    productos_data = {
        "Licores": [
            {
                "nombre": "Tequila Jose Cuervo Botella 750ml",
                "precio": 100000,
                "imagen": "/productos/licores/jcuervo_750ml.jpg",
            },
            {
                "nombre": "Jack Daniels N7 Botella 750ml",
                "precio": 130000,
                "imagen": "/productos/licores/jdaniels_750ml.png",
            },
            {
                "nombre": "Black and White Botella 750ml",
                "precio": 80000,
                "imagen": "/productos/licores/b&w_750ml.jpg",
            },
        ],
        "Snacks": [
            {
                "nombre": "Detodito Natural 185gr",
                "precio": 10000,
                "imagen": "/productos/snacks/DetoditoN_165g.jpg",
            },
            {
                "nombre": "Detodito BBQ 185gr",
                "precio": 10000,
                "imagen": "/productos/snacks/DetoditoBBQ_165g.jpg",
            },
            {
                "nombre": "Detodito limon 185gr",
                "precio": 10000,
                "imagen": "/productos/snacks/DetoditoL_165g.png",
            },
            {
                "nombre": "Doritos 185gr",
                "precio": 10000,
                "imagen": "/productos/snacks/doritosN_185g.jpg",
            },
            {
                "nombre": "Choclitos 185gr",
                "precio": 10000,
                "imagen": "/productos/snacks/choclitos_210g.png",
            },
        ],
        "Aguardiente": [
            {
                "nombre": "Aguardiente antioqueño verde Media",
                "precio": 30000,
                "imagen": "/productos/aguardiente/AG_verde_350ml.png",
            },
            {
                "nombre": "Aguardiente antioqueño verde Litro tetra",
                "precio": 65000,
                "imagen": "/productos/aguardiente/AG_verde_tetra_1000ml.png",
            },
            {
                "nombre": "Aguardiente antioqueño verde litro vidrio",
                "precio": 75000,
                "imagen": "/productos/aguardiente/AG_verde_botella_100ml.png",
            },
            {
                "nombre": "Aguardiente antioqueño verde Garrafa",
                "precio": 110000,
                "imagen": "/productos/aguardiente/AG_verde_1750ml.png",
            },
        ],
        "Rones": [
            {
                "nombre": "RVC Esencial media",
                "precio": 30000,
                "imagen": "/productos/rones/RVC_esencial_350ml.png",
            },
            {
                "nombre": "RVC Esencial botella 750",
                "precio": 55000,
                "imagen": "/productos/rones/RVC_esencial_750ml.png",
            },
            {
                "nombre": "RVC Esecnial Litro vidrio",
                "precio": 75000,
                "imagen": "/productos/rones/RVC_esencial_10000ml.png",
            },
            {
                "nombre": "RVC esencial garrafa",
                "precio": 110000,
                "imagen": "/productos/rones/RVC_esencial_1750ml.png",
            },
        ],
        "Cervezas": [
            {
                "nombre": "Aguila Laton",
                "precio": 7000,
                "imagen": "/productos/cervezas latones/Screenshot 2026-03-22 204434.png",
            },
            {
                "nombre": "Pilsen laton",
                "precio": 7000,
                "imagen": "/productos/cervezas latones/Screenshot 2026-03-22 204514.png",
            },
            {
                "nombre": "Poker Laton",
                "precio": 7000,
                "imagen": "/productos/cervezas latones/Screenshot 2026-03-22 204457.png",
            },
            {
                "nombre": "Andina Laton",
                "precio": 7000,
                "imagen": "/productos/cervezas latones/Screenshot 2026-03-22 204422.png",
            },
            {
                "nombre": "Heineken laton",
                "precio": 9000,
                "imagen": "/productos/cervezas latones/Screenshot 2026-03-22 204152.png",
            },
        ],
    }

    # 4. Insertar en la BD
    for cat_nombre, descripcion in categorias_data.items():
        print(f"Insertando categoría: {cat_nombre}")
        cat_obj = CategoriaModelo.objects.create(nombre=cat_nombre)

        productos_lista = productos_data.get(cat_nombre, [])
        for p in productos_lista:
            ProductoModelo.objects.create(
                nombre=p["nombre"],
                precio=p["precio"],
                imagen=p["imagen"],
                categoria=cat_obj,
                existencias=10,  # Stock inicial por defecto
                esta_activo=True,
            )
            print(f"  - Producto: {p['nombre']} (${p['precio']})")

    print("\n¡Base de datos populada exitosamente!")


if __name__ == "__main__":
    populate()
