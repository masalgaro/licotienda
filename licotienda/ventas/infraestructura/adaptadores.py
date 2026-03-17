from __future__ import annotations

import json
import os
from decimal import Decimal
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen
from uuid import uuid4

from django.conf import settings
from django.core.cache import cache

from usuarios.aplicacion.servicios import guardar_o_actualizar_cliente as guardar_o_actualizar_cliente_usuario

from ..dominio.entidades import ProductoVenta
from ..dominio.excepciones import ConfiguracionInvalidaError, ConflictoNegocioError, RecursoNoEncontradoError


class AdaptadorClientesUsuarios:
    def guardar_o_actualizar_cliente(self, telefono: str, nombre: str, direccion: str, observaciones: str = '') -> str:
        cliente, _direccion = guardar_o_actualizar_cliente_usuario(
            telefono=telefono,
            nombre=nombre,
            direccion_texto=direccion,
            observaciones=observaciones,
        )
        return str(cliente.telefono)


class AdaptadorCatalogoStub:
    def obtener_producto(self, producto_id: int) -> ProductoVenta:
        productos = getattr(settings, 'VENTAS_PRODUCTOS_STUB', {})
        datos = productos.get(producto_id) or productos.get(str(producto_id))
        if datos is None:
            raise RecursoNoEncontradoError('El producto no existe en el catálogo configurado.')

        return ProductoVenta(
            producto_id=producto_id,
            nombre=datos['nombre'],
            precio_actual=Decimal(str(datos['precio_actual'])),
            activo=bool(datos.get('activo', True)),
            agotado_manual=bool(datos.get('agotado_manual', False)),
        )


class AdaptadorInventarioStub:
    prefijo_disponible = 'ventas_stub_disponible'
    prefijo_reserva = 'ventas_stub_reserva'

    def reservar_productos(self, items, referencia_reserva: str):
        if cache.get(self._clave_reserva(referencia_reserva)) is not None:
            raise ConflictoNegocioError('La reserva ya existe para este pedido.')

        snapshot = {}
        reserva = {}
        for item in items:
            disponible = self._obtener_disponible(item.producto_id)
            if disponible < item.cantidad:
                raise ConflictoNegocioError('No hay inventario suficiente para confirmar el pedido.')
            snapshot[item.producto_id] = disponible
            reserva[item.producto_id] = item.cantidad

        for producto_id, cantidad in reserva.items():
            cache.set(self._clave_disponible(producto_id), snapshot[producto_id] - cantidad, None)

        cache.set(self._clave_reserva(referencia_reserva), reserva, None)

    def liberar_reserva(self, referencia_reserva: str):
        reserva = cache.get(self._clave_reserva(referencia_reserva))
        if not reserva:
            return

        for producto_id, cantidad in reserva.items():
            disponible = self._obtener_disponible(producto_id)
            cache.set(self._clave_disponible(producto_id), disponible + cantidad, None)

        cache.delete(self._clave_reserva(referencia_reserva))

    def confirmar_reserva(self, referencia_reserva: str):
        reserva = cache.get(self._clave_reserva(referencia_reserva))
        if not reserva:
            raise ConflictoNegocioError('No existe una reserva activa para este pedido.')
        cache.delete(self._clave_reserva(referencia_reserva))

    def _obtener_disponible(self, producto_id: int) -> int:
        clave = self._clave_disponible(producto_id)
        valor = cache.get(clave)
        if valor is None:
            inventario = getattr(settings, 'VENTAS_INVENTARIO_STUB', {})
            valor = int(inventario.get(producto_id, inventario.get(str(producto_id), 0)))
            cache.set(clave, valor, None)
        return int(valor)

    @classmethod
    def _clave_disponible(cls, producto_id: int) -> str:
        return f'{cls.prefijo_disponible}:{producto_id}'

    @classmethod
    def _clave_reserva(cls, referencia_reserva: str) -> str:
        return f'{cls.prefijo_reserva}:{referencia_reserva}'


class AdaptadorSupabaseArchivos:
    def __init__(self):
        self.base_url = os.getenv('SUPABASE_URL', '').rstrip('/')
        self.api_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
        self.bucket = os.getenv('SUPABASE_BUCKET_COMPROBANTES', 'comprobantes-pedidos')

    def subir_comprobante(self, token_pedido: str, archivo) -> str:
        self._validar_configuracion()
        nombre_archivo = getattr(archivo, 'name', 'comprobante.bin').replace('/', '_')
        ruta_archivo = f'pedidos/{token_pedido}/{uuid4()}-{nombre_archivo}'
        contenido = archivo.read()
        if hasattr(archivo, 'seek'):
            archivo.seek(0)

        url = f'{self.base_url}/storage/v1/object/{self.bucket}/{quote(ruta_archivo, safe="/")}'
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'apikey': self.api_key,
            'x-upsert': 'true',
            'Content-Type': getattr(archivo, 'content_type', 'application/octet-stream'),
        }
        request = Request(url=url, data=contenido, headers=headers, method='POST')
        self._ejecutar_request(request)
        return ruta_archivo

    def generar_url_firmada(self, ruta_archivo: str, minutos_vigencia: int) -> str:
        self._validar_configuracion()
        url = f'{self.base_url}/storage/v1/object/sign/{self.bucket}/{quote(ruta_archivo, safe="/")}'
        cuerpo = json.dumps({'expiresIn': int(minutos_vigencia * 60)}).encode('utf-8')
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'apikey': self.api_key,
            'Content-Type': 'application/json',
        }
        request = Request(url=url, data=cuerpo, headers=headers, method='POST')
        respuesta = self._ejecutar_request(request)
        ruta_firmada = respuesta.get('signedURL') or respuesta.get('signedUrl')
        if not ruta_firmada:
            raise ConfiguracionInvalidaError('Supabase no devolvió una URL firmada para el comprobante.')
        if ruta_firmada.startswith('http'):
            return ruta_firmada
        return f'{self.base_url}/storage/v1{ruta_firmada}'

    def _validar_configuracion(self):
        if not self.base_url or not self.api_key:
            raise ConfiguracionInvalidaError('Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY para manejar comprobantes.')

    @staticmethod
    def _ejecutar_request(request: Request) -> dict:
        try:
            with urlopen(request) as response:
                contenido = response.read().decode('utf-8')
        except HTTPError as error:
            detalle = error.read().decode('utf-8') if hasattr(error, 'read') else ''
            raise ConfiguracionInvalidaError(f'Error al comunicarse con Supabase: {detalle or error.reason}')
        except URLError as error:
            raise ConfiguracionInvalidaError(f'No fue posible conectarse a Supabase: {error.reason}')

        if not contenido:
            return {}
        return json.loads(contenido)
