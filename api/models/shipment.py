from django.db import models
from .product import Product

class Shipment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    ]

    carrier = models.CharField(max_length=100, null=True, blank=True)
    tracking_number = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    expected_arrival = models.DateTimeField()
    actual_arrival = models.DateTimeField(null=True, blank=True)
    products = models.ManyToManyField(Product, through='ShipmentProduct')
    
    def __str__(self):
        return f"Shipment {self.tracking_number} ({self.status})"

class ShipmentProduct(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Shipment {self.shipment.tracking_number}" 