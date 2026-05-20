import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from granizados.infraestructura.models import Ingrediente


def populate():
    Ingrediente.objects.all().delete()

    ingredientes = [
        {"nombre": "Cereza",               "categoria": "complemento", "precio_adicional": 4000},
        {"nombre": "Chantilly + Chocolate","categoria": "complemento", "precio_adicional": 5000},
        {"nombre": "Jeringa Tequila",      "categoria": "complemento", "precio_adicional": 3000},
        {"nombre": "Jeringa Vodka",        "categoria": "complemento", "precio_adicional": 3000},
        {"nombre": "Jeringa Whiskey",      "categoria": "complemento", "precio_adicional": 3000},
        {"nombre": "Lychee",               "categoria": "complemento", "precio_adicional": 4000},
        {"nombre": "Manzana Verde",        "categoria": "complemento", "precio_adicional": 4000},
        {"nombre": "Maracuyá",             "categoria": "complemento", "precio_adicional": 4000},
        {"nombre": "Bom Bom Bum",          "categoria": "fruta",       "precio_adicional": 0},
        {"nombre": "Chicle",               "categoria": "fruta",       "precio_adicional": 0},
        {"nombre": "Mango Biche",          "categoria": "fruta",       "precio_adicional": 0},
        {"nombre": "Baileys",              "categoria": "licor",       "precio_adicional": 3000},
        {"nombre": "Four Loko",            "categoria": "licor",       "precio_adicional": 4000},
        {"nombre": "Jamaica Tropical",     "categoria": "licor",       "precio_adicional": 2000},
        {"nombre": "Maracumango",          "categoria": "licor",       "precio_adicional": 2000},
        {"nombre": "Mojito",               "categoria": "licor",       "precio_adicional": 2000},
        {"nombre": "Mora Azul",            "categoria": "licor",       "precio_adicional": 2000},
        {"nombre": "Piña Colada",          "categoria": "licor",       "precio_adicional": 3000},
        {"nombre": "Red Bull Jagger",      "categoria": "licor",       "precio_adicional": 5000},
        {"nombre": "Smirnoff",             "categoria": "licor",       "precio_adicional": 3000},
        {"nombre": "Tequila Sunrise",      "categoria": "licor",       "precio_adicional": 3000},
    ]

    for ing in ingredientes:
        Ingrediente.objects.create(
            nombre=ing["nombre"],
            categoria=ing["categoria"],
            precio_adicional=ing["precio_adicional"],
            disponible=True,
        )

    print(f"Granizados poblados: {Ingrediente.objects.count()} ingredientes creados.")


if __name__ == "__main__":
    populate()
