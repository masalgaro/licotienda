from django.conf import settings
from django.utils.module_loading import import_string

from ..aplicacion.casos_de_uso import (
    AgregarProductoAlCarritoCasoUso,
    AprobarComprobantePagoCasoUso,
    ConfirmarPedidoCasoUso,
    ConsultarCarritoCasoUso,
    ConsultarEstadoPedidoCasoUso,
    ConsultarPedidoAdminCasoUso,
    CrearCarritoCasoUso,
    LiberarPedidosVencidosCasoUso,
    ListarPedidosPendientesCasoUso,
    QuitarProductoDelCarritoCasoUso,
    RechazarComprobantePagoCasoUso,
    SubirComprobantePagoCasoUso,
)
from .adaptadores import AdaptadorClientesUsuarios, AdaptadorSupabaseArchivos
from .repositorios import RepositorioCarritosDjango, RepositorioPedidosDjango, UnidadTrabajoDjango


def _instanciar(ruta_setting: str, ruta_predeterminada: str):
    ruta = getattr(settings, ruta_setting, ruta_predeterminada)
    clase = import_string(ruta)
    return clase()


def obtener_repositorio_carritos():
    return RepositorioCarritosDjango()


def obtener_repositorio_pedidos():
    return RepositorioPedidosDjango()


def obtener_puerto_catalogo():
    return _instanciar('VENTAS_ADAPTADOR_CATALOGO', 'ventas.infraestructura.adaptadores.AdaptadorCatalogoStub')


def obtener_puerto_inventario():
    return _instanciar('VENTAS_ADAPTADOR_INVENTARIO', 'ventas.infraestructura.adaptadores.AdaptadorInventarioStub')


def obtener_puerto_clientes():
    ruta = getattr(settings, 'VENTAS_ADAPTADOR_CLIENTES', None)
    if ruta:
        clase = import_string(ruta)
        return clase()
    return AdaptadorClientesUsuarios()


def obtener_puerto_almacenamiento():
    ruta = getattr(settings, 'VENTAS_ADAPTADOR_ALMACENAMIENTO', None)
    if ruta:
        clase = import_string(ruta)
        return clase()
    return AdaptadorSupabaseArchivos()


def obtener_unidad_trabajo():
    return UnidadTrabajoDjango()


def crear_caso_uso_crear_carrito():
    return CrearCarritoCasoUso(obtener_repositorio_carritos())


def crear_caso_uso_consultar_carrito():
    return ConsultarCarritoCasoUso(obtener_repositorio_carritos(), obtener_puerto_catalogo())


def crear_caso_uso_agregar_producto():
    return AgregarProductoAlCarritoCasoUso(obtener_repositorio_carritos(), obtener_puerto_catalogo())


def crear_caso_uso_quitar_producto():
    return QuitarProductoDelCarritoCasoUso(obtener_repositorio_carritos(), obtener_puerto_catalogo())


def crear_caso_uso_confirmar_pedido():
    return ConfirmarPedidoCasoUso(
        repositorio_carritos=obtener_repositorio_carritos(),
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_catalogo=obtener_puerto_catalogo(),
        puerto_inventario=obtener_puerto_inventario(),
        puerto_clientes=obtener_puerto_clientes(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )


def crear_caso_uso_subir_comprobante():
    return SubirComprobantePagoCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_almacenamiento=obtener_puerto_almacenamiento(),
        puerto_inventario=obtener_puerto_inventario(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )


def crear_caso_uso_consultar_estado():
    return ConsultarEstadoPedidoCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_inventario=obtener_puerto_inventario(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )


def crear_caso_uso_listar_pedidos_admin():
    return ListarPedidosPendientesCasoUso(obtener_repositorio_pedidos())


def crear_caso_uso_consultar_pedido_admin():
    return ConsultarPedidoAdminCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_almacenamiento=obtener_puerto_almacenamiento(),
    )


def crear_caso_uso_aprobar_comprobante():
    return AprobarComprobantePagoCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_inventario=obtener_puerto_inventario(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )


def crear_caso_uso_rechazar_comprobante():
    return RechazarComprobantePagoCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_inventario=obtener_puerto_inventario(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )


def crear_caso_uso_liberar_vencidos():
    return LiberarPedidosVencidosCasoUso(
        repositorio_pedidos=obtener_repositorio_pedidos(),
        puerto_inventario=obtener_puerto_inventario(),
        unidad_trabajo=obtener_unidad_trabajo(),
    )
