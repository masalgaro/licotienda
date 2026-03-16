from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    """
    Permiso personalizado para permitir acceso solo a los administradores del sistema.
    Asume el uso del JWT para el UsuarioAdministrador.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'admin')


class EsClienteVerificado(permissions.BasePermission):
    """
    Permiso conceptual.
    Como los clientes no usan login/JWT, gran parte de la validación del cliente 
    se debe hacer a nivel del Body (enviando el teléfono) o Session. 
    Este permiso puede usarse si en el futuro se implementa una autenticación ligera por Header.
    Por ahora, endpoints de clientes serán públicos y validarán internamente el teléfono.
    """
    def has_permission(self, request, view):
        return True # Por definir según flujo específico del carrito/checkout
