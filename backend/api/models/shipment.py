from django.db import models
from django.contrib.auth.models import User
from .enums import ShipmentType, ShipmentStatus
from .product import Product

class Shipment(models.Model):
    type = models.CharField(max_length=3, choices=ShipmentType.choices())
    status = models.CharField(max_length=10, choices=ShipmentStatus.choices())
    tracking_number = models.CharField(max_length=50, unique=True)
    carrier = models.CharField(max_length=50)
    estimated_arrival = models.DateTimeField()
    actual_arrival = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_shipments')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_shipments')
    products = models.ManyToManyField(Product, through='ShipmentItem')

    def __str__(self):
        return f"{self.get_type_display()} Shipment - {self.tracking_number}"

    class Meta:
        ordering = ['-created_at'] 