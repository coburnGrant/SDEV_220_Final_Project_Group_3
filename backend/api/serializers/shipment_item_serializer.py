from rest_framework import serializers
from ..models import ShipmentItem, Product

class ShipmentItemSerializer(serializers.ModelSerializer):
    """
    Serializer for ShipmentItem model.
    
    Handles:
    - Creating and updating shipment items
    - Nested product relationship
    - Quantity and unit price validation
    """
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    
    class Meta:
        model = ShipmentItem
        fields = ['id', 'product', 'quantity', 'unit_price']
        read_only_fields = ['id'] 