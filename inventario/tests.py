import base64
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from .infraestructura.models import CategoriaModelo, ProductoModelo

TEST_IMAGE_BYTES = base64.b64decode("R0lGODdhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=")
TEMP_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class InventarioOfertaTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.categoria = CategoriaModelo.objects.create(nombre="Whiskies Premium")
        self.producto = ProductoModelo.objects.create(
            nombre="Whisky Reserva",
            precio=45000,
            categoria=self.categoria,
            esta_activo=True,
            existencias=5,
            en_oferta=True,
            descuento_porcentaje=10,
        )

    def test_listado_inventario_filtra_por_ofertas(self):
        ProductoModelo.objects.create(
            nombre="Vodka Regular",
            precio=30000,
            categoria=self.categoria,
            esta_activo=False,
            existencias=0,
            en_oferta=False,
            descuento_porcentaje=0,
        )

        response = self.client.get("/api/v1/inventario/productos/", {"en_oferta": "true"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["nombre"], "Whisky Reserva")

    def test_crear_producto_con_oferta_y_descuento_invalido_falla(self):
        image = SimpleUploadedFile(
            "oferta.gif",
            TEST_IMAGE_BYTES,
            content_type="image/gif",
        )

        response = self.client.post(
            "/api/v1/inventario/productos/",
            data={
                "nombre": "Nuevo Licor",
                "precio": 22000,
                "existencias": 7,
                "categoria": self.categoria.id,
                "en_oferta": True,
                "descuento_porcentaje": 0,
                "imagen": image,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("descuento_porcentaje", response.json())

    def test_actualizar_oferta_con_descuento_cero_falla(self):
        response = self.client.put(
            f"/api/v1/inventario/productos/{self.producto.id}/",
            data={
                "en_oferta": True,
                "descuento_porcentaje": 0,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("descuento_porcentaje", response.json())

    def test_desactivar_oferta_normaliza_descuento_a_cero(self):
        response = self.client.put(
            f"/api/v1/inventario/productos/{self.producto.id}/",
            data={
                "en_oferta": False,
                "descuento_porcentaje": 35,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)

        self.producto.refresh_from_db()
        self.assertFalse(self.producto.en_oferta)
        self.assertEqual(self.producto.descuento_porcentaje, 0)


class InventarioCrearCategoriaTests(TestCase):
    """Cobertura HU-15: Agregar categorías a productos."""

    def test_happy_path_crea_categoria_nueva(self):
        response = self.client.post(
            "/api/v1/inventario/categorias/",
            data={"nombre": "Tequilas Premium"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(CategoriaModelo.objects.filter(nombre="Tequilas Premium").exists())

    def test_flujo_alterno_rechaza_categoria_duplicada(self):
        CategoriaModelo.objects.create(nombre="Vinos")

        response = self.client.post(
            "/api/v1/inventario/categorias/",
            data={"nombre": "Vinos"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("nombre", response.json())
        self.assertEqual(CategoriaModelo.objects.filter(nombre__iexact="Vinos").count(), 1)


class InventarioEditarCategoriaTests(TestCase):
    """Cobertura HU-19: Editar categorías de productos existentes."""

    def setUp(self):
        self.categoria = CategoriaModelo.objects.create(nombre="Vinos Tintos")

    def test_happy_path_edita_nombre_categoria(self):
        response = self.client.put(
            f"/api/v1/inventario/categorias/{self.categoria.id}/",
            data={"nombre": "Vinos Reserva"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.categoria.refresh_from_db()
        self.assertEqual(self.categoria.nombre, "Vinos Reserva")

    def test_flujo_alterno_editar_categoria_inexistente_retorna_404(self):
        response = self.client.put(
            "/api/v1/inventario/categorias/99999/",
            data={"nombre": "Nueva"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 404)


class InventarioEliminarCategoriaTests(TestCase):
    """Cobertura HU-22: Eliminar categorías de productos."""

    def setUp(self):
        self.categoria = CategoriaModelo.objects.create(nombre="Sodas")

    def test_happy_path_elimina_categoria_sin_productos(self):
        response = self.client.delete(f"/api/v1/inventario/categorias/{self.categoria.id}/")

        self.assertEqual(response.status_code, 204)
        self.assertFalse(CategoriaModelo.objects.filter(id=self.categoria.id).exists())

    def test_flujo_alterno_eliminar_categoria_inexistente_retorna_404(self):
        response = self.client.delete("/api/v1/inventario/categorias/99999/")

        self.assertEqual(response.status_code, 404)
