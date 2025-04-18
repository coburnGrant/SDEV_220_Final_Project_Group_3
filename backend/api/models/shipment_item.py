from django.db import models
from .product import Product
from .shipment import Shipment

class ShipmentItem(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Shipment {self.shipment.tracking_number}"

    class Meta:
        unique_together = ['shipment', 'product'] 