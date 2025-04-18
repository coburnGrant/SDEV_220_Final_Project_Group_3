from rest_framework import serializers
from ..models import InventoryItem
from .user_serializer import UserSerializer

class InventoryItemSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    last_updated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'sku', 'description', 'quantity', 'location', 
                 'category', 'minimum_stock', 'created_at', 'updated_at',
                 'created_by', 'last_updated_by']
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'last_updated_by']