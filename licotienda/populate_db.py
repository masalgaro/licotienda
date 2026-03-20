import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'licotienda.settings')

import django
django.setup()

from inventario.infraestructura.models import ProductoModelo, CategoriaModelo

# Clean DB
ProductoModelo.objects.all().delete()
CategoriaModelo.objects.all().delete()

inventory = {
    "Licores": [
        ("Tequila Jose Cuervo Botella 750ml", 100000),
        ("Jack Daniels N7 Botella 750ml", 130000),
        ("Black and White Botella 750ml", 80000),
    ],
    "Snacks": [
        ("Detodito Natural 185gr", 10000),
        ("Detodito BBQ 185gr", 10000),
        ("Detodito limon 185gr", 10000),
        ("Doritos 185gr", 10000),
        ("Choclitos 185gr", 10000),
    ],
    "Aguardiente": [
        ("Aguardiente antioqueño verde Media", 30000),
        ("Aguardiente antioqueño verde Litro tetra", 65000),
        ("Aguardiente antioqueño verde litro vidrio", 75000),
        ("Aguardiente antioqueño verde Garrafa", 110000),
    ],
    "Rones": [
        ("RVC Esencial media", 30000),
        ("RVC Esencial botella 750", 55000),
        ("RVC Esecnial Litro vidrio", 75000),
        ("RVC esencial garrafa", 110000),
    ],
    "Cervezas": [
        ("Aguila Laton", 7000),
        ("Pilsen laton", 7000),
        ("Poker Laton", 7000),
        ("Andina Laton", 7000),
        ("Heineken laton", 9000),
    ]
}

# Add realistic product thumbnails using UI-Avatars
def get_image(name):
    initials = "".join([w[0].upper() for w in name.split()[:2]]) 
    return f"https://ui-avatars.com/api/?name={initials}&background=171717&color=32BD49&size=400&font-size=0.4"

for category_name, products in inventory.items():
    categoria, _ = CategoriaModelo.objects.get_or_create(nombre=category_name)
    for name, price in products:
        ProductoModelo.objects.create(
            nombre=name,
            precio=price,
            categoria=categoria,
            descripcion=f"Delicioso '{name}' ideal para tus mejores momentos.",
            imagen_url=get_image(name)
        )

print("¡Inventario actualizado con éxito (Modelos en Español)!")
