from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from uuid import uuid4

from ..dominio.entidades import EstadoPedido, ItemPedido, Pedido, ProductoVenta
from ..dominio.excepciones import ConflictoNegocioError, RecursoNoEncontradoError, ValidacionError
from ..dominio.puertos import (
    PuertoAlmacenamientoArchivos,
    PuertoCatalogoLectura,
    PuertoClientesCheckout,
    PuertoInventario,
    RepositorioCarritos,
    RepositorioPedidos,
    SolicitudReservaItem,
    UnidadTrabajo,
)


def ahora_utc() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class CarritoCreadoDTO:
    token_carrito: str
    estado: str


@dataclass
class ItemCarritoDetalleDTO:
    producto_id: int
    nombre_producto: str
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal
    activo: bool
    agotado_manual: bool


@dataclass
class CarritoDetalleDTO:
    token_carrito: str
    estado: str
    items: list[ItemCarritoDetalleDTO] = field(default_factory=list)
    total_items: int = 0
    subtotal: Decimal = Decimal('0')


@dataclass
class PedidoEstadoDTO:
    pedido_id: int
    token_pedido: str
    estado: str
    reservado_hasta: datetime | None
    tiene_comprobante: bool


@dataclass
class ComprobanteAdminDetalleDTO:
    estado_validacion: str
    notas_cliente: str
    motivo_rechazo: str
    url_descarga: str | None
    subido_en: datetime | None
    validado_en: datetime | None
    administrador_validador_id: int | None


@dataclass
class ItemPedidoDetalleDTO:
    producto_id: int
    nombre_producto: str
    precio_unitario: Decimal
    cantidad: int
    subtotal_linea: Decimal


@dataclass
class PedidoAdminResumenDTO:
    pedido_id: int
    token_pedido: str
    cliente_telefono: str
    nombre_cliente: str
    estado: str
    total: Decimal
    reservado_hasta: datetime | None
    creado_en: datetime | None


@dataclass
class PedidoAdminDetalleDTO(PedidoAdminResumenDTO):
    direccion_entrega: str = ''
    observaciones_entrega: str = ''
    subtotal: Decimal = Decimal('0')
    items: list[ItemPedidoDetalleDTO] = field(default_factory=list)
    comprobante: ComprobanteAdminDetalleDTO | None = None


class CrearCarritoCasoUso:
    def __init__(self, repositorio_carritos: RepositorioCarritos):
        self.repositorio_carritos = repositorio_carritos

    def ejecutar(self) -> CarritoCreadoDTO:
        carrito = self.repositorio_carritos.crear()
        return CarritoCreadoDTO(token_carrito=carrito.token_publico, estado=carrito.estado.value)


class ConsultarCarritoCasoUso:
    def __init__(self, repositorio_carritos: RepositorioCarritos, puerto_catalogo: PuertoCatalogoLectura):
        self.repositorio_carritos = repositorio_carritos
        self.puerto_catalogo = puerto_catalogo

    def ejecutar(self, token_carrito: str) -> CarritoDetalleDTO:
        carrito = self._obtener_carrito(token_carrito)
        detalle_items = []
        subtotal = Decimal('0')
        total_items = 0

        for item in carrito.items:
            producto = self._obtener_producto_seguro(item.producto_id)
            subtotal_linea = producto.precio_actual * item.cantidad
            detalle_items.append(
                ItemCarritoDetalleDTO(
                    producto_id=item.producto_id,
                    nombre_producto=producto.nombre,
                    cantidad=item.cantidad,
                    precio_unitario=producto.precio_actual,
                    subtotal=subtotal_linea,
                    activo=producto.activo,
                    agotado_manual=producto.agotado_manual,
                )
            )
            subtotal += subtotal_linea
            total_items += item.cantidad

        return CarritoDetalleDTO(
            token_carrito=carrito.token_publico,
            estado=carrito.estado.value,
            items=detalle_items,
            total_items=total_items,
            subtotal=subtotal,
        )

    def _obtener_carrito(self, token_carrito: str):
        carrito = self.repositorio_carritos.obtener_por_token(token_carrito)
        if carrito is None:
            raise RecursoNoEncontradoError('El carrito no existe.')
        return carrito

    def _obtener_producto_seguro(self, producto_id: int) -> ProductoVenta:
        try:
            return self.puerto_catalogo.obtener_producto(producto_id)
        except RecursoNoEncontradoError:
            return ProductoVenta(
                producto_id=producto_id,
                nombre='Producto no disponible',
                precio_actual=Decimal('0'),
                activo=False,
                agotado_manual=True,
            )


class AgregarProductoAlCarritoCasoUso:
    def __init__(self, repositorio_carritos: RepositorioCarritos, puerto_catalogo: PuertoCatalogoLectura):
        self.repositorio_carritos = repositorio_carritos
        self.puerto_catalogo = puerto_catalogo

    def ejecutar(self, token_carrito: str, producto_id: int, cantidad: int) -> CarritoDetalleDTO:
        carrito = self._obtener_carrito(token_carrito)
        producto = self.puerto_catalogo.obtener_producto(producto_id)
        carrito.agregar_producto(producto, cantidad)
        self.repositorio_carritos.guardar(carrito)
        return ConsultarCarritoCasoUso(self.repositorio_carritos, self.puerto_catalogo).ejecutar(token_carrito)

    def _obtener_carrito(self, token_carrito: str):
        carrito = self.repositorio_carritos.obtener_por_token(token_carrito)
        if carrito is None:
            raise RecursoNoEncontradoError('El carrito no existe.')
        return carrito


class QuitarProductoDelCarritoCasoUso:
    def __init__(self, repositorio_carritos: RepositorioCarritos, puerto_catalogo: PuertoCatalogoLectura):
        self.repositorio_carritos = repositorio_carritos
        self.puerto_catalogo = puerto_catalogo

    def ejecutar(self, token_carrito: str, producto_id: int) -> CarritoDetalleDTO:
        carrito = self._obtener_carrito(token_carrito)
        carrito.quitar_producto(producto_id)
        self.repositorio_carritos.guardar(carrito)
        return ConsultarCarritoCasoUso(self.repositorio_carritos, self.puerto_catalogo).ejecutar(token_carrito)

    def _obtener_carrito(self, token_carrito: str):
        carrito = self.repositorio_carritos.obtener_por_token(token_carrito)
        if carrito is None:
            raise RecursoNoEncontradoError('El carrito no existe.')
        return carrito


class ConfirmarPedidoCasoUso:
    def __init__(
        self,
        repositorio_carritos: RepositorioCarritos,
        repositorio_pedidos: RepositorioPedidos,
        puerto_catalogo: PuertoCatalogoLectura,
        puerto_inventario: PuertoInventario,
        puerto_clientes: PuertoClientesCheckout,
        unidad_trabajo: UnidadTrabajo,
    ):
        self.repositorio_carritos = repositorio_carritos
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_catalogo = puerto_catalogo
        self.puerto_inventario = puerto_inventario
        self.puerto_clientes = puerto_clientes
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self, token_carrito: str, telefono: str, nombre: str, direccion: str, observaciones: str = '') -> PedidoEstadoDTO:
        carrito = self.repositorio_carritos.obtener_por_token(token_carrito)
        if carrito is None:
            raise RecursoNoEncontradoError('El carrito no existe.')
        if carrito.esta_vacio():
            raise ValidacionError('No se puede confirmar un carrito vacío.')

        self.puerto_clientes.guardar_o_actualizar_cliente(telefono, nombre, direccion, observaciones)

        pedido = Pedido(
            token_publico=str(uuid4()),
            cliente_telefono=telefono,
            nombre_cliente=nombre.strip(),
            direccion_entrega=direccion.strip(),
            observaciones_entrega=observaciones.strip(),
            reservado_hasta=ahora_utc() + timedelta(hours=2),
        )
        reservas = []

        for item in carrito.items:
            producto = self.puerto_catalogo.obtener_producto(item.producto_id)
            if not producto.activo or producto.agotado_manual:
                raise ConflictoNegocioError('Todos los productos deben estar activos y disponibles para confirmar el pedido.')

            pedido.items.append(
                ItemPedido(
                    producto_id=producto.producto_id,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_actual,
                    cantidad=item.cantidad,
                )
            )
            reservas.append(SolicitudReservaItem(producto_id=item.producto_id, cantidad=item.cantidad))

        pedido.recalcular_totales()

        try:
            with self.unidad_trabajo:
                self.puerto_inventario.reservar_productos(reservas, pedido.referencia_reserva)
                carrito.convertir()
                self.repositorio_carritos.guardar(carrito)
                pedido = self.repositorio_pedidos.guardar(pedido)
        except Exception:
            try:
                self.puerto_inventario.liberar_reserva(pedido.referencia_reserva)
            except Exception:
                pass
            raise

        return _construir_estado_pedido(pedido)


class SubirComprobantePagoCasoUso:
    def __init__(
        self,
        repositorio_pedidos: RepositorioPedidos,
        puerto_almacenamiento: PuertoAlmacenamientoArchivos,
        puerto_inventario: PuertoInventario,
        unidad_trabajo: UnidadTrabajo,
    ):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_almacenamiento = puerto_almacenamiento
        self.puerto_inventario = puerto_inventario
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self, token_pedido: str, archivo, notas: str = '') -> PedidoEstadoDTO:
        pedido = self.repositorio_pedidos.obtener_por_token(token_pedido)
        if pedido is None:
            raise RecursoNoEncontradoError('El pedido no existe.')

        ahora = ahora_utc()
        if pedido.esta_vencido(ahora):
            with self.unidad_trabajo:
                pedido.vencer(ahora)
                self.repositorio_pedidos.guardar(pedido)
                self.puerto_inventario.liberar_reserva(pedido.referencia_reserva)
            raise ConflictoNegocioError('El pedido ya venció y no admite comprobantes.')

        ruta_archivo = self.puerto_almacenamiento.subir_comprobante(pedido.token_publico, archivo)
        pedido.registrar_comprobante(ruta_archivo, notas, ahora)

        with self.unidad_trabajo:
            pedido = self.repositorio_pedidos.guardar(pedido)

        return _construir_estado_pedido(pedido)


class ConsultarEstadoPedidoCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos, puerto_inventario: PuertoInventario, unidad_trabajo: UnidadTrabajo):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_inventario = puerto_inventario
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self, token_pedido: str) -> PedidoEstadoDTO:
        pedido = self.repositorio_pedidos.obtener_por_token(token_pedido)
        if pedido is None:
            raise RecursoNoEncontradoError('El pedido no existe.')

        ahora = ahora_utc()
        if pedido.esta_vencido(ahora):
            with self.unidad_trabajo:
                pedido.vencer(ahora)
                pedido = self.repositorio_pedidos.guardar(pedido)
                self.puerto_inventario.liberar_reserva(pedido.referencia_reserva)

        return _construir_estado_pedido(pedido)


class ListarPedidosPendientesCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos):
        self.repositorio_pedidos = repositorio_pedidos

    def ejecutar(self, estado: str | None = None) -> list[PedidoAdminResumenDTO]:
        return [_construir_resumen_admin(pedido) for pedido in self.repositorio_pedidos.listar_por_estado(estado)]


class ConsultarPedidoAdminCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos, puerto_almacenamiento: PuertoAlmacenamientoArchivos):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_almacenamiento = puerto_almacenamiento

    def ejecutar(self, pedido_id: int) -> PedidoAdminDetalleDTO:
        pedido = self.repositorio_pedidos.obtener_por_id(pedido_id)
        if pedido is None:
            raise RecursoNoEncontradoError('El pedido no existe.')
        return _construir_detalle_admin(pedido, self.puerto_almacenamiento)


class AprobarComprobantePagoCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos, puerto_inventario: PuertoInventario, unidad_trabajo: UnidadTrabajo):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_inventario = puerto_inventario
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self, pedido_id: int, administrador_id: int) -> PedidoEstadoDTO:
        pedido = self.repositorio_pedidos.obtener_por_id(pedido_id)
        if pedido is None:
            raise RecursoNoEncontradoError('El pedido no existe.')

        pedido.aprobar(administrador_id, ahora_utc())

        with self.unidad_trabajo:
            pedido = self.repositorio_pedidos.guardar(pedido)
            self.puerto_inventario.confirmar_reserva(pedido.referencia_reserva)

        return _construir_estado_pedido(pedido)


class RechazarComprobantePagoCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos, puerto_inventario: PuertoInventario, unidad_trabajo: UnidadTrabajo):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_inventario = puerto_inventario
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self, pedido_id: int, administrador_id: int, motivo_rechazo: str) -> PedidoEstadoDTO:
        pedido = self.repositorio_pedidos.obtener_por_id(pedido_id)
        if pedido is None:
            raise RecursoNoEncontradoError('El pedido no existe.')

        pedido.rechazar(administrador_id, motivo_rechazo, ahora_utc())

        with self.unidad_trabajo:
            pedido = self.repositorio_pedidos.guardar(pedido)
            self.puerto_inventario.liberar_reserva(pedido.referencia_reserva)

        return _construir_estado_pedido(pedido)


class LiberarPedidosVencidosCasoUso:
    def __init__(self, repositorio_pedidos: RepositorioPedidos, puerto_inventario: PuertoInventario, unidad_trabajo: UnidadTrabajo):
        self.repositorio_pedidos = repositorio_pedidos
        self.puerto_inventario = puerto_inventario
        self.unidad_trabajo = unidad_trabajo

    def ejecutar(self) -> int:
        ahora = ahora_utc()
        pedidos_vencidos = self.repositorio_pedidos.listar_vencidos(ahora)
        total = 0

        for pedido in pedidos_vencidos:
            with self.unidad_trabajo:
                pedido.vencer(ahora)
                self.repositorio_pedidos.guardar(pedido)
                self.puerto_inventario.liberar_reserva(pedido.referencia_reserva)
            total += 1

        return total


def _construir_estado_pedido(pedido: Pedido) -> PedidoEstadoDTO:
    return PedidoEstadoDTO(
        pedido_id=pedido.id or 0,
        token_pedido=pedido.token_publico,
        estado=pedido.estado.value,
        reservado_hasta=pedido.reservado_hasta,
        tiene_comprobante=pedido.comprobante is not None,
    )


def _construir_resumen_admin(pedido: Pedido) -> PedidoAdminResumenDTO:
    return PedidoAdminResumenDTO(
        pedido_id=pedido.id or 0,
        token_pedido=pedido.token_publico,
        cliente_telefono=pedido.cliente_telefono,
        nombre_cliente=pedido.nombre_cliente,
        estado=pedido.estado.value,
        total=pedido.total,
        reservado_hasta=pedido.reservado_hasta,
        creado_en=pedido.creado_en,
    )


def _construir_detalle_admin(pedido: Pedido, puerto_almacenamiento: PuertoAlmacenamientoArchivos) -> PedidoAdminDetalleDTO:
    comprobante = None
    if pedido.comprobante is not None:
        url_descarga = puerto_almacenamiento.generar_url_firmada(pedido.comprobante.ruta_archivo, 10)
        comprobante = ComprobanteAdminDetalleDTO(
            estado_validacion=pedido.comprobante.estado_validacion.value,
            notas_cliente=pedido.comprobante.notas_cliente,
            motivo_rechazo=pedido.comprobante.motivo_rechazo,
            url_descarga=url_descarga,
            subido_en=pedido.comprobante.subido_en,
            validado_en=pedido.comprobante.validado_en,
            administrador_validador_id=pedido.comprobante.administrador_validador_id,
        )

    return PedidoAdminDetalleDTO(
        pedido_id=pedido.id or 0,
        token_pedido=pedido.token_publico,
        cliente_telefono=pedido.cliente_telefono,
        nombre_cliente=pedido.nombre_cliente,
        estado=pedido.estado.value,
        total=pedido.total,
        reservado_hasta=pedido.reservado_hasta,
        creado_en=pedido.creado_en,
        direccion_entrega=pedido.direccion_entrega,
        observaciones_entrega=pedido.observaciones_entrega,
        subtotal=pedido.subtotal,
        items=[
            ItemPedidoDetalleDTO(
                producto_id=item.producto_id,
                nombre_producto=item.nombre_producto,
                precio_unitario=item.precio_unitario,
                cantidad=item.cantidad,
                subtotal_linea=item.subtotal_linea,
            )
            for item in pedido.items
        ],
        comprobante=comprobante,
    )
