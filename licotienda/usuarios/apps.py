from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.AutoField'
    name = 'usuarios'
    
    def ready(self):
        import usuarios.infraestructura.models
