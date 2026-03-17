from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase

from usuarios.infraestructura.models import Cliente

from .dominio.entidades import CarritoCompra, EstadoPedido, ItemPedido, Pedido, ProductoVenta
from .dominio.excepciones import ConflictoNegocioError, RecursoNoEncontradoError
from .infraestructura.models import ComprobantePagoModelo, PedidoModelo


class AdaptadorCatalogoPruebas:
    productos = {}

    @classmethod
    def reiniciar(cls):
        cls.productos = {
            1: {'nombre': 'Ron Añejo', 'precio_actual': Decimal('25000.00'), 'activo': True, 'agotado_manual': False},
            2: {'nombre': 'Producto Inactivo', 'precio_actual': Decimal('18000.00'), 'activo': False, 'agotado_manual': False},
            3: {'nombre': 'Producto Agotado', 'precio_actual': Decimal('19000.00'), 'activo': True, 'agotado_manual': True},
        }

    def obtener_producto(self, producto_id: int) -> ProductoVenta:
        datos = self.productos.get(producto_id)
        if datos is None:
            raise RecursoNoEncontradoError('Producto inexistente.')
        return ProductoVenta(
            producto_id=producto_id,
            nombre=datos['nombre'],
            precio_actual=Decimal(str(datos['precio_actual'])),
            activo=datos['activo'],
            agotado_manual=datos['agotado_manual'],
        )


class AdaptadorInventarioPruebas:
    disponibles = {}
    reservas = {}
    confirmadas = []

    @classmethod
    def reiniciar(cls, disponibles=None):
        cls.disponibles = dict(disponibles or {1: 10, 2: 5, 3: 5})
        cls.reservas = {}
        cls.confirmadas = []

    def reservar_productos(self, items, referencia_reserva: str):
        if referencia_reserva in self.reservas:
            raise ConflictoNegocioError('Reserva duplicada.')

        snapshot = {}
        for item in items:
            disponible = self.disponibles.get(item.producto_id, 0)
            if disponible < item.cantidad:
                raise ConflictoNegocioError('Inventario insuficiente.')
            snapshot[item.producto_id] = disponible

        self.reservas[referencia_reserva] = {}
        for item in items:
            self.disponibles[item.producto_id] = snapshot[item.producto_id] - item.cantidad
            self.reservas[referencia_reserva][item.producto_id] = item.cantidad

    def liberar_reserva(self, referencia_reserva: str):
        reserva = self.reservas.pop(referencia_reserva, None)
        if not reserva:
            return
        for producto_id, cantidad in reserva.items():
            self.disponibles[producto_id] = self.disponibles.get(producto_id, 0) + cantidad

    def confirmar_reserva(self, referencia_reserva: str):
        reserva = self.reservas.pop(referencia_reserva, None)
        if not reserva:
            raise ConflictoNegocioError('No existe reserva.')
        self.confirmadas.append(referencia_reserva)


class AdaptadorAlmacenamientoPruebas:
    archivos = {}

    @classmethod
    def reiniciar(cls):
        cls.archivos = {}

    def subir_comprobante(self, token_pedido: str, archivo) -> str:
        ruta = f'pruebas/{token_pedido}/{archivo.name}'
        self.archivos[token_pedido] = ruta
        return ruta

    def generar_url_firmada(self, ruta_archivo: str, minutos_vigencia: int) -> str:
        return f'https://archivos.example/{ruta_archivo}?v={minutos_vigencia}'


@override_settings(
    VENTAS_ADAPTADOR_CATALOGO='ventas.tests.AdaptadorCatalogoPruebas',
    VENTAS_ADAPTADOR_INVENTARIO='ventas.tests.AdaptadorInventarioPruebas',
    VENTAS_ADAPTADOR_ALMACENAMIENTO='ventas.tests.AdaptadorAlmacenamientoPruebas',
)
class VentasDominioTests(TestCase):
    def test_carrito_incrementa_cantidad_de_producto_repetido(self):
        producto = ProductoVenta(
            producto_id=1,
            nombre='Ron',
            precio_actual=Decimal('10000.00'),
            activo=True,
            agotado_manual=False,
        )
        carrito = CarritoCompra(token_publico='carrito-prueba')

        carrito.agregar_producto(producto, 1)
        carrito.agregar_producto(producto, 2)

        self.assertEqual(len(carrito.items), 1)
        self.assertEqual(carrito.items[0].cantidad, 3)

    def test_pedido_recalcula_totales_y_cambia_estado_al_aprobar(self):
        pedido = Pedido(
            token_publico='pedido-prueba',
            cliente_telefono='3000000000',
            nombre_cliente='Cliente Prueba',
            direccion_entrega='Calle 1',
        )
        pedido.items.append(
            ItemPedido(
                producto_id=1,
                nombre_producto='Ron',
                precio_unitario=Decimal('10000.00'),
                cantidad=2,
            )
        )
        pedido.recalcular_totales()
        pedido.registrar_comprobante('ruta/comprobante.png', 'listo', timezone.now())
        pedido.aprobar(administrador_id=1, ahora=timezone.now())

        self.assertEqual(pedido.total, Decimal('20000.00'))
        self.assertEqual(pedido.estado, EstadoPedido.APROBADO)


@override_settings(
    VENTAS_ADAPTADOR_CATALOGO='ventas.tests.AdaptadorCatalogoPruebas',
    VENTAS_ADAPTADOR_INVENTARIO='ventas.tests.AdaptadorInventarioPruebas',
    VENTAS_ADAPTADOR_ALMACENAMIENTO='ventas.tests.AdaptadorAlmacenamientoPruebas',
)
class VentasAPITests(APITestCase):
    def setUp(self):
        AdaptadorCatalogoPruebas.reiniciar()
        AdaptadorInventarioPruebas.reiniciar()
        AdaptadorAlmacenamientoPruebas.reiniciar()

        usuario_modelo = get_user_model()
        self.admin = usuario_modelo.objects.create_user(
            username='admin_ventas',
            password='clave-segura',
            email='admin@example.com',
        )
        self.cliente_publico = APIClient()
        self.cliente_admin = APIClient()
        self.cliente_admin.force_authenticate(user=self.admin)

    def crear_carrito(self) -> str:
        respuesta = self.cliente_publico.post(reverse('ventas_crear_carrito'))
        self.assertEqual(respuesta.status_code, 201)
        return respuesta.data['token_carrito']

    def agregar_producto(self, token_carrito: str, producto_id: int, cantidad: int):
        return self.cliente_publico.post(
            reverse('ventas_agregar_producto_carrito', kwargs={'token_carrito': token_carrito}),
            {'producto_id': producto_id, 'cantidad': cantidad},
            format='json',
        )

    def confirmar_pedido(self, token_carrito: str):
        return self.cliente_publico.post(
            reverse('ventas_confirmar_pedido', kwargs={'token_carrito': token_carrito}),
            {
                'telefono': '3001234567',
                'nombre': 'Cliente Demo',
                'direccion': 'Calle Principal 123',
                'observaciones': 'Apartamento 4',
            },
            format='json',
        )

    def subir_comprobante(self, token_pedido: str):
        archivo = SimpleUploadedFile('comprobante.png', b'contenido-imagen', content_type='image/png')
        return self.cliente_publico.post(
            reverse('ventas_subir_comprobante', kwargs={'token_pedido': token_pedido}),
            {'archivo': archivo, 'notas': 'Transferencia realizada'},
        )

    def test_agregar_producto_repetido_incrementa_cantidad(self):
        token_carrito = self.crear_carrito()

        primera = self.agregar_producto(token_carrito, 1, 1)
        segunda = self.agregar_producto(token_carrito, 1, 2)

        self.assertEqual(primera.status_code, 200)
        self.assertEqual(segunda.status_code, 200)
        self.assertEqual(len(segunda.data['items']), 1)
        self.assertEqual(segunda.data['items'][0]['cantidad'], 3)
        self.assertEqual(segunda.data['total_items'], 3)

    def test_quitar_producto_elimina_la_linea_del_carrito(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 1)

        respuesta = self.cliente_publico.delete(
            reverse('ventas_quitar_producto_carrito', kwargs={'token_carrito': token_carrito, 'producto_id': 1})
        )

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['items'], [])
        self.assertEqual(respuesta.data['total_items'], 0)

    def test_no_permite_agregar_producto_inactivo_o_agotado(self):
        token_carrito = self.crear_carrito()

        respuesta_inactivo = self.agregar_producto(token_carrito, 2, 1)
        respuesta_agotado = self.agregar_producto(token_carrito, 3, 1)

        self.assertEqual(respuesta_inactivo.status_code, 409)
        self.assertEqual(respuesta_agotado.status_code, 409)

    def test_confirmar_pedido_crea_snapshot_y_reserva_stock(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 2)

        respuesta = self.confirmar_pedido(token_carrito)

        self.assertEqual(respuesta.status_code, 201)
        pedido = PedidoModelo.objects.get(token_publico=respuesta.data['token_pedido'])
        item = pedido.items.get()
        self.assertEqual(pedido.estado, EstadoPedido.PENDIENTE_COMPROBANTE.value)
        self.assertEqual(item.nombre_producto, 'Ron Añejo')
        self.assertEqual(item.precio_unitario, Decimal('25000.00'))
        self.assertTrue(Cliente.objects.filter(telefono='3001234567').exists())
        self.assertEqual(AdaptadorInventarioPruebas.disponibles[1], 8)

    def test_confirmar_pedido_falla_si_no_hay_inventario(self):
        AdaptadorInventarioPruebas.reiniciar(disponibles={1: 1, 2: 5, 3: 5})
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 2)

        respuesta = self.confirmar_pedido(token_carrito)

        self.assertEqual(respuesta.status_code, 409)
        self.assertEqual(PedidoModelo.objects.count(), 0)

    def test_subir_comprobante_mueve_el_pedido_a_en_revision(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 1)
        confirmacion = self.confirmar_pedido(token_carrito)

        respuesta = self.subir_comprobante(confirmacion.data['token_pedido'])

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['estado'], EstadoPedido.EN_REVISION.value)
        self.assertEqual(ComprobantePagoModelo.objects.count(), 1)

    def test_aprobar_comprobante_confirma_la_reserva(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 1)
        confirmacion = self.confirmar_pedido(token_carrito)
        self.subir_comprobante(confirmacion.data['token_pedido'])
        pedido = PedidoModelo.objects.get(token_publico=confirmacion.data['token_pedido'])

        respuesta = self.cliente_admin.post(reverse('ventas_aprobar_comprobante', kwargs={'pedido_id': pedido.id}))

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['estado'], EstadoPedido.APROBADO.value)
        self.assertIn(confirmacion.data['token_pedido'], AdaptadorInventarioPruebas.confirmadas)

    def test_rechazar_comprobante_repone_stock(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 2)
        confirmacion = self.confirmar_pedido(token_carrito)
        self.subir_comprobante(confirmacion.data['token_pedido'])
        pedido = PedidoModelo.objects.get(token_publico=confirmacion.data['token_pedido'])
        self.assertEqual(AdaptadorInventarioPruebas.disponibles[1], 8)

        respuesta = self.cliente_admin.post(
            reverse('ventas_rechazar_comprobante', kwargs={'pedido_id': pedido.id}),
            {'motivo_rechazo': 'Comprobante ilegible'},
            format='json',
        )

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['estado'], EstadoPedido.RECHAZADO.value)
        self.assertEqual(AdaptadorInventarioPruebas.disponibles[1], 10)

    def test_no_permite_subir_comprobante_a_pedido_cerrado(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 1)
        confirmacion = self.confirmar_pedido(token_carrito)
        self.subir_comprobante(confirmacion.data['token_pedido'])
        pedido = PedidoModelo.objects.get(token_publico=confirmacion.data['token_pedido'])
        self.cliente_admin.post(reverse('ventas_aprobar_comprobante', kwargs={'pedido_id': pedido.id}))

        respuesta = self.subir_comprobante(confirmacion.data['token_pedido'])

        self.assertEqual(respuesta.status_code, 409)

    def test_endpoints_admin_requieren_autenticacion(self):
        respuesta = self.cliente_publico.get(reverse('ventas_listar_pedidos_admin'))

        self.assertIn(respuesta.status_code, [401, 403])

    def test_comando_liberar_pedidos_vencidos_repone_stock(self):
        token_carrito = self.crear_carrito()
        self.agregar_producto(token_carrito, 1, 2)
        confirmacion = self.confirmar_pedido(token_carrito)
        pedido = PedidoModelo.objects.get(token_publico=confirmacion.data['token_pedido'])
        pedido.reservado_hasta = timezone.now() - timedelta(minutes=5)
        pedido.save(update_fields=['reservado_hasta'])

        call_command('liberar_pedidos_vencidos')
        pedido.refresh_from_db()

        self.assertEqual(pedido.estado, EstadoPedido.VENCIDO.value)
        self.assertEqual(AdaptadorInventarioPruebas.disponibles[1], 10)
