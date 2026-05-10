from decimal import Decimal

from django.db import models

PRECIO_BASE_GRANIZADO = Decimal("12000.00")


class Ingrediente(models.Model):
    CATEGORIA_FRUTA = "fruta"
    CATEGORIA_LICOR = "licor"
    CATEGORIA_COMPLEMENTO = "complemento"

    CATEGORIAS = [
        (CATEGORIA_FRUTA, "Fruta"),
        (CATEGORIA_LICOR, "Licor"),
        (CATEGORIA_COMPLEMENTO, "Complemento"),
    ]

    nombre = models.CharField(max_length=120, unique=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    precio_adicional = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    disponible = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ingrediente"
        verbose_name_plural = "Ingredientes"
        ordering = ["categoria", "nombre"]

    def __str__(self):
        return f"{self.nombre} ({self.categoria})"


class Granizado(models.Model):
    tiene_alcohol = models.BooleanField(default=False)
    ingredientes = models.ManyToManyField(Ingrediente, related_name="granizados")
    precio_base = models.DecimalField(
        max_digits=10, decimal_places=2, default=PRECIO_BASE_GRANIZADO
    )
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Granizado"
        verbose_name_plural = "Granizados"
        ordering = ["-creado_en"]

    def __str__(self):
        tipo = "con alcohol" if self.tiene_alcohol else "sin alcohol"
        return f"Granizado {tipo} #{self.id}"

    def calcular_precio_total(self):
        adicionales = sum(
            (ingrediente.precio_adicional for ingrediente in self.ingredientes.all()),
            Decimal("0.00"),
        )
        return self.precio_base + adicionales

    def actualizar_precio_total(self, commit=True):
        self.precio_total = self.calcular_precio_total()
        if commit:
            self.save(update_fields=["precio_total", "actualizado_en"])
        return self.precio_total
