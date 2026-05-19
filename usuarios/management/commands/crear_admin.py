import os
from django.core.management.base import BaseCommand
from usuarios.infraestructura.models import Usuario


class Command(BaseCommand):
    help = "Crea un superusuario administrador interactivamente si no existe."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="admin")
        parser.add_argument("--password", default="")

    def handle(self, *args, **options):
        username = options["username"]
        if Usuario.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"El usuario '{username}' ya existe."))
            return

        password = options["password"]
        if not password:
            password = os.environ.get("DJANGO_ADMING_PASSWORD") or input(f"Contraseña para '{username}': ")

        u = Usuario.objects.create_superuser(username=username, password=password)
        u.es_administrador = True
        u.save()
        self.stdout.write(self.style.SUCCESS(f"Superusuario '{username}' creado correctamente."))
