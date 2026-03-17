from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from enum import Enum

from .excepciones import OperacionNoPermitidaError, RecursoNoEncontradoError, ValidacionError


class EstadoCarrito(str, Enum):
    ABIERTO = 'abierto'
    CONVERTIDO = 'convertido'


class EstadoPedido(str, Enum):
    PENDIENTE_COMPROBANTE = 'pendiente_comprobante'
    EN_REVISION = 'en_revision'
    APROBADO = 'aprobado'
    RECHAZADO = 'rechazado'
    VENCIDO = 'vencido'


class EstadoValidacionComprobante(str, Enum):
    PENDIENTE = 'pendiente'
    APROBADO = 'aprobado'
    RECHAZADO = 'rechazado'


@dataclass
class ProductoVenta:
    producto_id: int
    nombre: str
    precio_actual: Decimal
    activo: bool
    agotado_manual: bool = False


@dataclass
class ItemCarrito:
    producto_id: int
    cantidad: int

    def __post_init__(self):
        self._validar_cantidad(self.cantidad)

    @staticmethod
    def _validar_cantidad(cantidad: int):
        if cantidad <= 0:
            raise ValidacionError('La cantidad debe ser un entero positivo.')

    def incrementar(self, cantidad: int):
        self._validar_cantidad(cantidad)
        self.cantidad += cantidad


@dataclass
class CarritoCompra:
    token_publico: str
    estado: EstadoCarrito = EstadoCarrito.ABIERTO
    items: list[ItemCarrito] = field(default_factory=list)
    id: int | None = None
    creado_en: datetime | None = None
    actualizado_en: datetime | None = None

    def asegurar_abierto(self):
        if self.estado != EstadoCarrito.ABIERTO:
            raise OperacionNoPermitidaError('El carrito ya no admite cambios.')

    def esta_vacio(self) -> bool:
        return not self.items

    def agregar_producto(self, producto: ProductoVenta, cantidad: int):
        self.asegurar_abierto()
        if not producto.activo:
            raise OperacionNoPermitidaError('El producto no está activo.')
        if producto.agotado_manual:
            raise OperacionNoPermitidaError('El producto está marcado como agotado.')

        for item in self.items:
            if item.producto_id == producto.producto_id:
                item.incrementar(cantidad)
                return

        self.items.append(ItemCarrito(producto_id=producto.producto_id, cantidad=cantidad))

    def quitar_producto(self, producto_id: int):
        self.asegurar_abierto()
        for indice, item in enumerate(self.items):
            if item.producto_id == producto_id:
                self.items.pop(indice)
                return

        raise RecursoNoEncontradoError('El producto no existe dentro del carrito.')

    def convertir(self):
        self.asegurar_abierto()
        if self.esta_vacio():
            raise ValidacionError('No se puede confirmar un carrito vacío.')
        self.estado = EstadoCarrito.CONVERTIDO


@dataclass
class ItemPedido:
    producto_id: int
    nombre_producto: str
    precio_unitario: Decimal
    cantidad: int
    subtotal_linea: Decimal | None = None

    def __post_init__(self):
        if self.cantidad <= 0:
            raise ValidacionError('La cantidad del pedido debe ser positiva.')

        if self.subtotal_linea is None:
            self.subtotal_linea = self.precio_unitario * self.cantidad


@dataclass
class ComprobantePago:
    ruta_archivo: str
    notas_cliente: str = ''
    motivo_rechazo: str = ''
    estado_validacion: EstadoValidacionComprobante = EstadoValidacionComprobante.PENDIENTE
    subido_en: datetime | None = None
    validado_en: datetime | None = None
    administrador_validador_id: int | None = None
    id: int | None = None


@dataclass
class Pedido:
    token_publico: str
    cliente_telefono: str
    nombre_cliente: str
    direccion_entrega: str
    observaciones_entrega: str = ''
    estado: EstadoPedido = EstadoPedido.PENDIENTE_COMPROBANTE
    subtotal: Decimal = Decimal('0')
    total: Decimal = Decimal('0')
    reservado_hasta: datetime | None = None
    items: list[ItemPedido] = field(default_factory=list)
    comprobante: ComprobantePago | None = None
    id: int | None = None
    creado_en: datetime | None = None
    actualizado_en: datetime | None = None

    @property
    def referencia_reserva(self) -> str:
        return self.token_publico

    def recalcular_totales(self):
        self.subtotal = sum((item.subtotal_linea for item in self.items), Decimal('0'))
        self.total = self.subtotal

    def registrar_comprobante(self, ruta_archivo: str, notas_cliente: str, ahora: datetime):
        if self.estado != EstadoPedido.PENDIENTE_COMPROBANTE:
            raise OperacionNoPermitidaError('El pedido no admite un nuevo comprobante.')

        self.comprobante = ComprobantePago(
            id=self.comprobante.id if self.comprobante else None,
            ruta_archivo=ruta_archivo,
            notas_cliente=notas_cliente,
            estado_validacion=EstadoValidacionComprobante.PENDIENTE,
            subido_en=ahora,
        )
        self.estado = EstadoPedido.EN_REVISION

    def aprobar(self, administrador_id: int, ahora: datetime):
        if self.estado != EstadoPedido.EN_REVISION or self.comprobante is None:
            raise OperacionNoPermitidaError('Solo se puede aprobar un pedido en revisión.')

        self.estado = EstadoPedido.APROBADO
        self.comprobante.estado_validacion = EstadoValidacionComprobante.APROBADO
        self.comprobante.validado_en = ahora
        self.comprobante.administrador_validador_id = administrador_id
        self.comprobante.motivo_rechazo = ''

    def rechazar(self, administrador_id: int, motivo_rechazo: str, ahora: datetime):
        if self.estado != EstadoPedido.EN_REVISION or self.comprobante is None:
            raise OperacionNoPermitidaError('Solo se puede rechazar un pedido en revisión.')
        if not motivo_rechazo.strip():
            raise ValidacionError('El motivo de rechazo es obligatorio.')

        self.estado = EstadoPedido.RECHAZADO
        self.comprobante.estado_validacion = EstadoValidacionComprobante.RECHAZADO
        self.comprobante.validado_en = ahora
        self.comprobante.administrador_validador_id = administrador_id
        self.comprobante.motivo_rechazo = motivo_rechazo.strip()

    def esta_vencido(self, ahora: datetime) -> bool:
        return self.estado == EstadoPedido.PENDIENTE_COMPROBANTE and self.reservado_hasta is not None and ahora > self.reservado_hasta

    def vencer(self, ahora: datetime):
        if not self.esta_vencido(ahora):
            raise OperacionNoPermitidaError('El pedido no está vencido.')

        self.estado = EstadoPedido.VENCIDO
