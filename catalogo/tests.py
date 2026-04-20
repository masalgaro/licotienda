from django.test import TestCase

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo


class CatalogoOfertaFilterTests(TestCase):
    def setUp(self):
        categoria = CategoriaModelo.objects.create(nombre="Rones Premium")
        ProductoModelo.objects.create(
            nombre="Ron en Oferta",
            precio=32000,
            categoria=categoria,
            esta_activo=True,
            existencias=10,
            en_oferta=True,
            descuento_porcentaje=20,
        )
        ProductoModelo.objects.create(
            nombre="Ron Regular",
            precio=28000,
            categoria=categoria,
            esta_activo=True,
            existencias=8,
            en_oferta=False,
            descuento_porcentaje=0,
        )
        ProductoModelo.objects.create(
            nombre="Oferta Inactiva",
            precio=25000,
            categoria=categoria,
            esta_activo=False,
            existencias=0,
            en_oferta=True,
            descuento_porcentaje=15,
        )

    def test_lista_catalogo_filtra_solo_productos_en_oferta(self):
        response = self.client.get("/api/v1/catalogo/productos/", {"en_oferta": "true"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["nombre"], "Ron en Oferta")
