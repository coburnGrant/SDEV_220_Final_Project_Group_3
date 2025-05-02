from rest_framework import serializers
from ..models import Shipment, ShipmentItem
from .shipment_item_serializer import ShipmentItemSerializer
from .user_serializer import UserSerializer
from django.utils import timezone
from datetime import timedelta

class ShipmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Shipment model.
    
    Handles:
    - Creating and updating shipments
    - Managing nested shipment items
    - Tracking user actions
    - Status and type validation
    """
    shipment_items = ShipmentItemSerializer(many=True, required=False)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    tracking_number = serializers.CharField(required=True)

    class Meta:
        model = Shipment
        fields = ['id', 'type', 'status', 'tracking_number', 'carrier',
                 'estimated_arrival', 'actual_arrival', 'created_at',
                 'updated_at', 'shipment_items', 'created_by', 'updated_by']
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']

    def validate_estimated_arrival(self, value):
        """
        Validate that the estimated arrival date is:
        1. Not in the past
        2. Not more than 1 year in the future
        """
        now = timezone.now()
        one_year_from_now = now + timedelta(days=365)

        if value < now:
            raise serializers.ValidationError("Estimated arrival date cannot be in the past")
        
        if value > one_year_from_now:
            raise serializers.ValidationError("Estimated arrival date cannot be more than 1 year in the future")
        
        return value

    def validate(self, data):
        """
        Additional validation for the entire shipment data
        """
        # Validate that there are items in the shipment
        if not data.get('shipment_items'):
            raise serializers.ValidationError("Shipment must contain at least one item")
        
        return data

    def create(self, validated_data):
        """
        Create a new shipment with its items.
        """
        items_data = validated_data.pop('shipment_items', [])
        shipment = Shipment.objects.create(**validated_data)
        
        for item_data in items_data:
            ShipmentItem.objects.create(shipment=shipment, **item_data)
            
        return shipment

    def update(self, instance, validated_data):
        """
        Update a shipment and its items.
        """
        items_data = validated_data.pop('shipment_items', None)
        
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