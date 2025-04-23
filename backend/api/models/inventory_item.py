from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class InventoryItem(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    location = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    minimum_stock = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_items')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_items')

    def __str__(self):
        return f"{self.name} ({self.sku})"

    class Meta:
        ordering = ['name'] 