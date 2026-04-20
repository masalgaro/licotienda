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
