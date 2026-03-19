from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True, help_text="Set to False to mark as 'agotado'")

    def __str__(self):
        return f"{self.name} - {'Active' if self.is_active else 'Agotado'}"
