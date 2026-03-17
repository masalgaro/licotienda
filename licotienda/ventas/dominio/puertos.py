from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from .entidades import CarritoCompra, Pedido, ProductoVenta


@dataclass(frozen=True)
class SolicitudReservaItem:
    producto_id: int
    cantidad: int


class RepositorioCarritos(ABC):
    @abstractmethod
    def crear(self) -> CarritoCompra:
        raise NotImplementedError

    @abstractmethod
    def obtener_por_token(self, token_publico: str) -> CarritoCompra | None:
        raise NotImplementedError

    @abstractmethod
    def guardar(self, carrito: CarritoCompra) -> CarritoCompra:
        raise NotImplementedError


class RepositorioPedidos(ABC):
    @abstractmethod
    def guardar(self, pedido: Pedido) -> Pedido:
        raise NotImplementedError

    @abstractmethod
    def obtener_por_token(self, token_publico: str) -> Pedido | None:
        raise NotImplementedError

    @abstractmethod
    def obtener_por_id(self, pedido_id: int) -> Pedido | None:
        raise NotImplementedError

    @abstractmethod
    def listar_por_estado(self, estado: str | None = None) -> list[Pedido]:
        raise NotImplementedError

    @abstractmethod
    def listar_vencidos(self, ahora) -> list[Pedido]:
        raise NotImplementedError


class PuertoCatalogoLectura(ABC):
    @abstractmethod
    def obtener_producto(self, producto_id: int) -> ProductoVenta:
        raise NotImplementedError


class PuertoInventario(ABC):
    @abstractmethod
    def reservar_productos(self, items: list[SolicitudReservaItem], referencia_reserva: str):
        raise NotImplementedError

    @abstractmethod
    def liberar_reserva(self, referencia_reserva: str):
        raise NotImplementedError

    @abstractmethod
    def confirmar_reserva(self, referencia_reserva: str):
        raise NotImplementedError


class PuertoClientesCheckout(ABC):
    @abstractmethod
    def guardar_o_actualizar_cliente(self, telefono: str, nombre: str, direccion: str, observaciones: str = '') -> str:
        raise NotImplementedError


class PuertoAlmacenamientoArchivos(ABC):
    @abstractmethod
    def subir_comprobante(self, token_pedido: str, archivo) -> str:
        raise NotImplementedError

    @abstractmethod
    def generar_url_firmada(self, ruta_archivo: str, minutos_vigencia: int) -> str:
        raise NotImplementedError


class UnidadTrabajo(ABC):
    @abstractmethod
    def __enter__(self):
        raise NotImplementedError

    @abstractmethod
    def __exit__(self, tipo_excepcion, valor_excepcion, traceback):
        raise NotImplementedError
