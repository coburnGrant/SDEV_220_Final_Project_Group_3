from rest_framework import serializers
from ..models import Shipment, ShipmentItem
from .shipment_item_serializer import ShipmentItemSerializer
from .user_serializer import UserSerializer

class ShipmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Shipment model.
    
    Handles:
    - Creating and updating shipments
    - Managing nested shipment items
    - Tracking user actions
    - Status and type validation
    """
    items = ShipmentItemSerializer(many=True, required=False)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = ['id', 'type', 'status', 'tracking_number', 'carrier',
                 'estimated_arrival', 'actual_arrival', 'created_at',
                 'updated_at', 'items', 'created_by', 'updated_by']
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']

    def create(self, validated_data):
        """
        Create a new shipment with its items.
        """
        items_data = validated_data.pop('items', [])
        shipment = Shipment.objects.create(**validated_data)
        
        for item_data in items_data:
            ShipmentItem.objects.create(shipment=shipment, **item_data)
            
        return shipment

    def update(self, instance, validated_data):
        """
        Update a shipment and its items.
        """
        items_data = validated_data.pop('items', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if items_data is not None:
            # Delete existing items
            instance.items.all().delete()
            # Create new items
            for item_data in items_data:
                ShipmentItem.objects.create(shipment=instance, **item_data)
                
        return instance 