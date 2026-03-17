from django.core.management.base import BaseCommand

from ventas.infraestructura.dependencias import crear_caso_uso_liberar_vencidos


class Command(BaseCommand):
    help = 'Libera reservas y marca pedidos vencidos en el módulo ventas.'

    def handle(self, *args, **options):
        total = crear_caso_uso_liberar_vencidos().ejecutar()
        self.stdout.write(self.style.SUCCESS(f'Pedidos vencidos liberados: {total}'))
