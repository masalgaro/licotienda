import json
from decimal import Decimal

from django.test import TestCase

from granizados.infraestructura.models import Granizado, Ingrediente
from inventario.infraestructura.models import CategoriaModelo, ProductoModelo
from usuarios.infraestructura.models import Usuario, UsuarioDireccion
from ventas.infraestructura.models import ItemPedido, Pedido


class VentasPedidoDomicilioTests(TestCase):
    """Cobertura HU-18: Incluir información del cliente en pedido a domicilio."""

    def setUp(self):
        categoria = CategoriaModelo.objects.create(nombre="Rones")
        self.producto = ProductoModelo.objects.create(
            nombre="Ron Medellín",
            precio=38000,
            categoria=categoria,
            esta_activo=True,
            existencias=10,
        )
        self.ingrediente = Ingrediente.objects.create(
            nombre="Mango biche",
            categoria=Ingrediente.CATEGORIA_FRUTA,
            precio_adicional=Decimal("1500.00"),
        )
        self.granizado = Granizado.objects.create(
            tiene_alcohol=False,
            precio_base=Decimal("12000.00"),
            precio_total=Decimal("13500.00"),
        )
        self.granizado.ingredientes.set([self.ingrediente])

    def _payload(self, **overrides):
        items = [{"producto": self.producto.id, "cantidad": 1, "precio": "38000"}]
        data = {
            "items": json.dumps(items),
            "telefono": "3015456939",
            "nombres": "Juan",
            "apellidos": "Pérez",
            "direccion": "Calle 50 # 40-20, Itagüí",
            "recordar_direccion": "true",
            "metodo_pago": "EFECTIVO",
            "costo_envio": "6000",
        }
        data.update(overrides)
        return data

    def test_happy_path_crea_pedido_con_datos_cliente_y_direccion(self):
        response = self.client.post("/api/v1/ventas/pedidos/", data=self._payload())

        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertTrue(body["exito"])

        pedido = Pedido.objects.get(id=body["pedido_id"])
        self.assertEqual(pedido.direccion, "Calle 50 # 40-20, Itagüí")

        cliente = pedido.cliente
        self.assertEqual(cliente.first_name, "Juan")
        self.assertEqual(cliente.last_name, "Pérez")
        self.assertEqual(cliente.telefono, "3015456939")
        self.assertTrue(
            UsuarioDireccion.objects.filter(
                usuario=cliente, direccion="Calle 50 # 40-20, Itagüí"
            ).exists()
        )

    def test_flujo_alterno_rechaza_pedido_sin_telefono_del_cliente(self):
        response = self.client.post("/api/v1/ventas/pedidos/", data=self._payload(telefono=""))

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())
        self.assertEqual(Pedido.objects.count(), 0)
        self.assertEqual(Usuario.objects.count(), 0)

    def test_crea_pedido_con_granizado_configurado(self):
        items = [{"granizado": self.granizado.id, "cantidad": 2}]

        response = self.client.post(
            "/api/v1/ventas/pedidos/",
            data=self._payload(items=json.dumps(items)),
        )

        self.assertEqual(response.status_code, 201)
        pedido = Pedido.objects.get(id=response.json()["pedido_id"])
        item = pedido.items.get()
        self.assertIsNone(item.producto)
        self.assertEqual(item.granizado, self.granizado)
        self.assertEqual(item.cantidad, 2)
        self.assertEqual(item.precio, Decimal("13500.00"))

        pedidos_response = self.client.get("/api/v1/ventas/todos/")
        self.assertEqual(pedidos_response.status_code, 200)
        item_serializado = pedidos_response.json()[0]["items"][0]
        self.assertEqual(item_serializado["tipo"], "granizado")
        self.assertEqual(item_serializado["granizado_nombre"], "Granizado sin alcohol")
        self.assertEqual(item_serializado["granizado_ingredientes"][0]["nombre"], "Mango biche")

    def test_crea_pedido_mixto_producto_y_granizado(self):
        items = [
            {"producto": self.producto.id, "cantidad": 1, "precio": "38000"},
            {"granizado": self.granizado.id, "cantidad": 1},
        ]

        response = self.client.post(
            "/api/v1/ventas/pedidos/",
            data=self._payload(items=json.dumps(items)),
        )

        self.assertEqual(response.status_code, 201)
        pedido = Pedido.objects.get(id=response.json()["pedido_id"])
        self.assertEqual(ItemPedido.objects.filter(pedido=pedido).count(), 2)

        self.producto.refresh_from_db()
        self.assertEqual(self.producto.existencias, 9)

    def test_valida_carrito_con_granizado_configurado(self):
        response = self.client.post(
            "/api/v1/ventas/validar-carrito/",
            data=json.dumps(
                {"items": [{"producto": f"granizado-{self.granizado.id}", "cantidad": 1}]}
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["exito"])

    def test_rechaza_validar_carrito_con_granizado_inexistente(self):
        response = self.client.post(
            "/api/v1/ventas/validar-carrito/",
            data=json.dumps({"items": [{"producto": "granizado-99999", "cantidad": 1}]}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())
