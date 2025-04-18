from rest_framework import viewsets, permissions
from ..models import ShipmentItem
from ..serializers.shipment_item_serializer import ShipmentItemSerializer

class ShipmentItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing shipment items.
    
    Provides operations for:
    - Adding items to shipments
    - Updating item quantities
    - Filtering items by shipment
    """
    queryset = ShipmentItem.objects.all()
    serializer_class = ShipmentItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ShipmentItem.objects.all()
        shipment_id = self.request.query_params.get('shipment', None)
        
        if shipment_id:
            queryset = queryset.filter(shipment_id=shipment_id)
        
        return queryset 