from rest_framework import serializers
from ..models import ShipmentItem, InventoryItem

class ShipmentItemSerializer(serializers.ModelSerializer):
    """
    Serializer for ShipmentItem model.
    
    Handles:
    - Creating and updating shipment items
    - Nested inventory item relationship
    - Quantity and unit price validation
    """
    item = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all())
    
    class Meta:
        model = ShipmentItem
        fields = ['id', 'item', 'quantity', 'unit_price']
        read_only_fields = ['id'] 