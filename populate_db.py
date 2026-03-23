import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo

def populate():
    # Clear existing to be safe
    CategoriaModelo.objects.all().delete()
    ProductoModelo.objects.all().delete()

    data = {
        'Licores': [
            {'nombre': 'Tequila Jose Cuervo Botella 750ml', 'precio': 100000, 'imagen': '/productos/licores/jcuervo_750ml.jpg'},
            {'nombre': 'Jack Daniels N7 Botella 750ml', 'precio': 130000, 'imagen': '/productos/licores/jdaniels_750ml.png'},
            {'nombre': 'Black and White Botella 750ml', 'precio': 80000, 'imagen': '/productos/licores/b&w_750ml.jpg'},
        ],
        'Snacks': [
            {'nombre': 'Detodito Natural 185gr', 'precio': 10000, 'imagen': '/productos/snacks/DetoditoN_165g.jpg'},
            {'nombre': 'Detodito BBQ 185gr', 'precio': 10000, 'imagen': '/productos/snacks/DetoditoBBQ_165g.jpg'},
            {'nombre': 'Detodito limon 185gr', 'precio': 10000, 'imagen': '/productos/snacks/DetoditoL_165g.png'},
            {'nombre': 'Doritos 185gr', 'precio': 10000, 'imagen': '/productos/snacks/doritosN_185g.jpg'},
            {'nombre': 'Choclitos 185gr', 'precio': 10000, 'imagen': '/productos/snacks/choclitos_210g.png'},
        ],
        'Aguardiente': [
            {'nombre': 'Aguardiente antioqueño verde Media', 'precio': 30000, 'imagen': '/productos/aguardiente/AG_verde_350ml.png'},
            {'nombre': 'Aguardiente antioqueño verde Litro tetra', 'precio': 65000, 'imagen': '/productos/aguardiente/AG_verde_tetra_1000ml.png'},
            {'nombre': 'Aguardiente antioqueño verde litro vidrio', 'precio': 75000, 'imagen': '/productos/aguardiente/AG_verde_botella_100ml.png'},
            {'nombre': 'Aguardiente antioqueño verde Garrafa', 'precio': 110000, 'imagen': '/productos/aguardiente/AG_verde_1750ml.png'},
        ],
        'Rones': [
            {'nombre': 'RVC Esencial media', 'precio': 30000, 'imagen': '/productos/rones/RVC_esencial_350ml.png'},
            {'nombre': 'RVC Esencial botella 750', 'precio': 55000, 'imagen': '/productos/rones/RVC_esencial_750ml.png'},
            {'nombre': 'RVC Esecnial Litro vidrio', 'precio': 75000, 'imagen': '/productos/rones/RVC_esencial_10000ml.png'},
            {'nombre': 'RVC esencial garrafa', 'precio': 110000, 'imagen': '/productos/rones/RVC_esencial_1750ml.png'},
        ],
        'Cervezas': [
            {'nombre': 'Aguila Laton', 'precio': 7000, 'imagen': '/productos/cervezas latones/Screenshot 2026-03-22 204152.png'},
            {'nombre': 'Pilsen laton', 'precio': 7000, 'imagen': '/productos/cervezas latones/Screenshot 2026-03-22 204422.png'},
            {'nombre': 'Poker Laton', 'precio': 7000, 'imagen': '/productos/cervezas latones/Screenshot 2026-03-22 204434.png'},
            {'nombre': 'Andina Laton', 'precio': 7000, 'imagen': '/productos/cervezas latones/Screenshot 2026-03-22 204457.png'},
            {'nombre': 'Heineken laton', 'precio': 9000, 'imagen': '/productos/cervezas latones/Screenshot 2026-03-22 204514.png'},
        ]
    }

    for cat_name, productos in data.items():
        cat, created = CategoriaModelo.objects.get_or_create(nombre=cat_name)
        for p in productos:
            ProductoModelo.objects.create(
                nombre=p['nombre'],
                precio=p['precio'],
                imagen_url=p['imagen'],
                categoria=cat,
                esta_activo=True
            )
    print("Database populated successfully!")

if __name__ == '__main__':
    populate()
