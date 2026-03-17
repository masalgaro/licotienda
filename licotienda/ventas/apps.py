from django.apps import AppConfig


class VentasConfig(AppConfig):
    default_auto_field = 'django.db.models.AutoField'
    name = 'ventas'
    verbose_name = 'Ventas'

    def ready(self):
        import ventas.infraestructura.models
