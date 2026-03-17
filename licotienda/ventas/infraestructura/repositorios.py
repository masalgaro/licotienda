from __future__ import annotations

from django.db import transaction

from ..dominio.entidades import (
    CarritoCompra,
    ComprobantePago,
    EstadoCarrito,
    EstadoPedido,
    EstadoValidacionComprobante,
    ItemCarrito,
    ItemPedido,
    Pedido,
)
from .models import CarritoCompraModelo, ComprobantePagoModelo, ItemCarritoModelo, ItemPedidoModelo, PedidoModelo


class UnidadTrabajoDjango:
    def __init__(self):
        self._transaccion = None

    def __enter__(self):
        self._transaccion = transaction.atomic()
        self._transaccion.__enter__()
        return self

    def __exit__(self, tipo_excepcion, valor_excepcion, traceback):
        if self._transaccion is not None:
            return self._transaccion.__exit__(tipo_excepcion, valor_excepcion, traceback)
        return False


class RepositorioCarritosDjango:
    def crear(self) -> CarritoCompra:
        modelo = CarritoCompraModelo.objects.create()
        return self._a_entidad(modelo)

    def obtener_por_token(self, token_publico: str) -> CarritoCompra | None:
        try:
            modelo = CarritoCompraModelo.objects.prefetch_related('items').get(token_publico=token_publico)
        except CarritoCompraModelo.DoesNotExist:
            return None
        return self._a_entidad(modelo)

    def guardar(self, carrito: CarritoCompra) -> CarritoCompra:
        modelo = self._obtener_modelo(carrito)
        modelo.estado = carrito.estado.value
        modelo.save()

        ItemCarritoModelo.objects.filter(carrito=modelo).delete()
        ItemCarritoModelo.objects.bulk_create(
            [
                ItemCarritoModelo(carrito=modelo, producto_id=item.producto_id, cantidad=item.cantidad)
                for item in carrito.items
            ]
        )
        modelo.refresh_from_db()
        return self._a_entidad(modelo)

    @staticmethod
    def _obtener_modelo(carrito: CarritoCompra) -> CarritoCompraModelo:
        if carrito.id is not None:
            return CarritoCompraModelo.objects.get(pk=carrito.id)
        return CarritoCompraModelo.objects.get(token_publico=carrito.token_publico)

    @staticmethod
    def _a_entidad(modelo: CarritoCompraModelo) -> CarritoCompra:
        return CarritoCompra(
            id=modelo.id,
            token_publico=str(modelo.token_publico),
            estado=EstadoCarrito(modelo.estado),
            items=[ItemCarrito(producto_id=item.producto_id, cantidad=item.cantidad) for item in modelo.items.all()],
            creado_en=modelo.creado_en,
            actualizado_en=modelo.actualizado_en,
        )


class RepositorioPedidosDjango:
    def guardar(self, pedido: Pedido) -> Pedido:
        if pedido.id is not None:
            modelo = PedidoModelo.objects.get(pk=pedido.id)
        else:
            modelo, _ = PedidoModelo.objects.get_or_create(token_publico=pedido.token_publico)

        modelo.cliente_telefono = pedido.cliente_telefono
        modelo.nombre_cliente = pedido.nombre_cliente
        modelo.direccion_entrega = pedido.direccion_entrega
        modelo.observaciones_entrega = pedido.observaciones_entrega
        modelo.estado = pedido.estado.value
        modelo.subtotal = pedido.subtotal
        modelo.total = pedido.total
        modelo.reservado_hasta = pedido.reservado_hasta
        modelo.save()

        ItemPedidoModelo.objects.filter(pedido=modelo).delete()
        ItemPedidoModelo.objects.bulk_create(
            [
                ItemPedidoModelo(
                    pedido=modelo,
                    producto_id=item.producto_id,
                    nombre_producto=item.nombre_producto,
                    precio_unitario=item.precio_unitario,
                    cantidad=item.cantidad,
                    subtotal_linea=item.subtotal_linea,
                )
                for item in pedido.items
            ]
        )

        if pedido.comprobante is not None:
            comprobante_modelo, _ = ComprobantePagoModelo.objects.get_or_create(pedido=modelo)
            comprobante_modelo.ruta_archivo = pedido.comprobante.ruta_archivo
            comprobante_modelo.notas_cliente = pedido.comprobante.notas_cliente
            comprobante_modelo.motivo_rechazo = pedido.comprobante.motivo_rechazo
            comprobante_modelo.estado_validacion = pedido.comprobante.estado_validacion.value
            comprobante_modelo.subido_en = pedido.comprobante.subido_en
            comprobante_modelo.validado_en = pedido.comprobante.validado_en
            comprobante_modelo.administrador_validador_id = pedido.comprobante.administrador_validador_id
            comprobante_modelo.save()

        return self.obtener_por_id(modelo.id)

    def obtener_por_token(self, token_publico: str) -> Pedido | None:
        try:
            modelo = self._consulta_base().get(token_publico=token_publico)
        except PedidoModelo.DoesNotExist:
            return None
        return self._a_entidad(modelo)

    def obtener_por_id(self, pedido_id: int) -> Pedido | None:
        try:
            modelo = self._consulta_base().get(pk=pedido_id)
        except PedidoModelo.DoesNotExist:
            return None
        return self._a_entidad(modelo)

    def listar_por_estado(self, estado: str | None = None) -> list[Pedido]:
        consulta = self._consulta_base()
        if estado:
            consulta = consulta.filter(estado=estado)
        return [self._a_entidad(modelo) for modelo in consulta]

    def listar_vencidos(self, ahora) -> list[Pedido]:
        consulta = self._consulta_base().filter(
            estado=EstadoPedido.PENDIENTE_COMPROBANTE.value,
            reservado_hasta__lt=ahora,
        )
        return [self._a_entidad(modelo) for modelo in consulta]

    @staticmethod
    def _consulta_base():
        return PedidoModelo.objects.select_related('comprobante').prefetch_related('items')

    @staticmethod
    def _a_entidad(modelo: PedidoModelo) -> Pedido:
        comprobante = None
        if hasattr(modelo, 'comprobante'):
            comprobante = ComprobantePago(
                id=modelo.comprobante.id,
                ruta_archivo=modelo.comprobante.ruta_archivo,
                notas_cliente=modelo.comprobante.notas_cliente,
                motivo_rechazo=modelo.comprobante.motivo_rechazo,
                estado_validacion=EstadoValidacionComprobante(modelo.comprobante.estado_validacion),
                subido_en=modelo.comprobante.subido_en,
                validado_en=modelo.comprobante.validado_en,
                administrador_validador_id=modelo.comprobante.administrador_validador_id,
            )

        return Pedido(
            id=modelo.id,
            token_publico=str(modelo.token_publico),
            cliente_telefono=modelo.cliente_telefono,
            nombre_cliente=modelo.nombre_cliente,
            direccion_entrega=modelo.direccion_entrega,
            observaciones_entrega=modelo.observaciones_entrega,
            estado=EstadoPedido(modelo.estado),
            subtotal=modelo.subtotal,
            total=modelo.total,
            reservado_hasta=modelo.reservado_hasta,
            items=[
                ItemPedido(
                    producto_id=item.producto_id,
                    nombre_producto=item.nombre_producto,
                    precio_unitario=item.precio_unitario,
                    cantidad=item.cantidad,
                    subtotal_linea=item.subtotal_linea,
                )
                for item in modelo.items.all()
            ],
            comprobante=comprobante,
            creado_en=modelo.creado_en,
            actualizado_en=modelo.actualizado_en,
        )
