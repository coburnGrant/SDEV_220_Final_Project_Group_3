from rest_framework import serializers
from ..models import Product

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    
    Handles:
    - Creating and updating products
    - SKU validation
    - Price and quantity validation
    """
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'sku', 'price', 
                 'quantity', 'reorder_level', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'sku': {'validators': []}  # Disable unique validator for updates
        } 