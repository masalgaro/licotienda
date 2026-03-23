from django.db import models

class CategoriaModelo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre

class ProductoModelo(models.Model):
    nombre = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    descripcion = models.TextField(blank=True, null=True)
    imagen_url = models.URLField(max_length=500, blank=True, null=True)
    categoria = models.ForeignKey(CategoriaModelo, on_delete=models.SET_NULL, null=True, related_name="productos")
    esta_activo = models.BooleanField(default=True, help_text="Marque como False para indicar que el producto está agotado")
    
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return f"{self.nombre} - {'Activo' if self.esta_activo else 'Agotado'}"
