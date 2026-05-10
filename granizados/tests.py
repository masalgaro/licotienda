import json
from decimal import Decimal

from django.test import TestCase

from .infraestructura.models import Granizado, Ingrediente


class GranizadosAPITests(TestCase):
    def setUp(self):
        self.mango = Ingrediente.objects.create(
            nombre="Mango",
            categoria=Ingrediente.CATEGORIA_FRUTA,
            precio_adicional=Decimal("1500.00"),
            disponible=True,
        )
        self.fresa_agotada = Ingrediente.objects.create(
            nombre="Fresa",
            categoria=Ingrediente.CATEGORIA_FRUTA,
            precio_adicional=Decimal("1800.00"),
            disponible=False,
        )
        self.ron = Ingrediente.objects.create(
            nombre="Ron",
            categoria=Ingrediente.CATEGORIA_LICOR,
            precio_adicional=Decimal("5000.00"),
            disponible=True,
        )
        self.menta = Ingrediente.objects.create(
            nombre="Menta",
            categoria=Ingrediente.CATEGORIA_COMPLEMENTO,
            precio_adicional=Decimal("1000.00"),
            disponible=True,
        )

    def _post_json(self, url, payload):
        return self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_lista_ingredientes_disponibles_agrupados_por_categoria(self):
        response = self.client.get("/api/v1/granizados/ingredientes/")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(set(data.keys()), {"fruta", "licor", "complemento"})
        self.assertEqual([ingrediente["nombre"] for ingrediente in data["fruta"]], ["Mango"])
        self.assertEqual([ingrediente["nombre"] for ingrediente in data["licor"]], ["Ron"])
        self.assertEqual(
            [ingrediente["nombre"] for ingrediente in data["complemento"]],
            ["Menta"],
        )
        self.assertNotIn(
            "Fresa",
            [ingrediente["nombre"] for grupo in data.values() for ingrediente in grupo],
        )

    def test_crea_granizado_y_calcula_precio_total(self):
        response = self._post_json(
            "/api/v1/granizados/",
            {
                "tiene_alcohol": True,
                "ingredientes": [self.mango.id, self.ron.id, self.menta.id],
            },
        )

        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["precio_base"], "12000.00")
        self.assertEqual(data["precio_total"], "19500.00")
        self.assertEqual(len(data["ingredientes"]), 3)

        granizado = Granizado.objects.get(id=data["id"])
        self.assertEqual(granizado.precio_total, Decimal("19500.00"))

    def test_rechaza_granizado_sin_ingredientes(self):
        response = self._post_json(
            "/api/v1/granizados/",
            {"tiene_alcohol": False, "ingredientes": []},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Granizado.objects.count(), 0)

    def test_rechaza_licor_en_granizado_sin_alcohol(self):
        response = self._post_json(
            "/api/v1/granizados/",
            {"tiene_alcohol": False, "ingredientes": [self.mango.id, self.ron.id]},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("ingredientes", response.json())
        self.assertEqual(Granizado.objects.count(), 0)

    def test_agrega_granizado_configurado_al_carrito(self):
        granizado = Granizado.objects.create(
            tiene_alcohol=False,
            precio_base=Decimal("12000.00"),
            precio_total=Decimal("13500.00"),
        )
        granizado.ingredientes.set([self.mango])

        response = self._post_json(
            "/api/v1/granizados/carrito/",
            {"granizado_id": granizado.id},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["tipo"], "granizado")
        self.assertEqual(data["id"], f"granizado-{granizado.id}")
        self.assertEqual(data["granizado"], granizado.id)
        self.assertEqual(data["precio"], "13500.00")
        self.assertEqual(data["quantity"], 1)

    def test_rechaza_agregar_granizado_inexistente_al_carrito(self):
        response = self._post_json(
            "/api/v1/granizados/carrito/",
            {"granizado_id": 99999},
        )

        self.assertEqual(response.status_code, 400)

# Create your tests here.
