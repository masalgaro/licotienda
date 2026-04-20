import json

from django.test import TestCase

from inventario.infraestructura.models import CategoriaModelo, ProductoModelo
from usuarios.infraestructura.models import Usuario, UsuarioDireccion

from ventas.infraestructura.models import Pedido


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
