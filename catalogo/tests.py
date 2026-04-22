from django.test import TestCase

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo


class CatalogoOfertaFilterTests(TestCase):
    """Cobertura HU-21: Listar ofertas activas para el cliente."""

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


class CatalogoBusquedaPorCategoriaTests(TestCase):
    """Cobertura HU-13: Buscar productos por categoría en el catálogo."""

    def setUp(self):
        self.cat_rones = CategoriaModelo.objects.create(nombre="Rones")
        self.cat_cervezas = CategoriaModelo.objects.create(nombre="Cervezas")

        ProductoModelo.objects.create(
            nombre="Ron Viejo de Caldas",
            precio=40000,
            categoria=self.cat_rones,
            esta_activo=True,
            existencias=5,
        )
        ProductoModelo.objects.create(
            nombre="Cerveza Águila",
            precio=3000,
            categoria=self.cat_cervezas,
            esta_activo=True,
            existencias=20,
        )

    def test_happy_path_filtra_productos_por_categoria(self):
        response = self.client.get(
            "/api/v1/catalogo/productos/", {"categoria": self.cat_rones.id}
        )

        self.assertEqual(response.status_code, 200)
        nombres = [p["nombre"] for p in response.json()]
        self.assertEqual(nombres, ["Ron Viejo de Caldas"])

    def test_flujo_alterno_categoria_inexistente_retorna_lista_vacia(self):
        response = self.client.get("/api/v1/catalogo/productos/", {"categoria": 99999})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])


class CatalogoStockVisibleTests(TestCase):
    """Cobertura HU-17: Ver cantidad de stock en vista de producto."""

    def setUp(self):
        categoria = CategoriaModelo.objects.create(nombre="Aguardientes")
        self.producto_con_stock = ProductoModelo.objects.create(
            nombre="Aguardiente Antioqueño",
            precio=35000,
            categoria=categoria,
            esta_activo=True,
            existencias=12,
        )
        self.producto_agotado = ProductoModelo.objects.create(
            nombre="Aguardiente Edición Limitada",
            precio=45000,
            categoria=categoria,
            esta_activo=False,
            existencias=0,
        )

    def test_happy_path_producto_expone_cantidad_existencias(self):
        response = self.client.get("/api/v1/catalogo/productos/")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        encontrado = next(p for p in data if p["id"] == self.producto_con_stock.id)
        self.assertIn("existencias", encontrado)
        self.assertEqual(encontrado["existencias"], 12)

    def test_flujo_alterno_producto_agotado_no_aparece_en_catalogo(self):
        response = self.client.get("/api/v1/catalogo/productos/")

        self.assertEqual(response.status_code, 200)
        ids = [p["id"] for p in response.json()]
        self.assertNotIn(self.producto_agotado.id, ids)
