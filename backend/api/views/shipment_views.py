from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from ..models import Shipment, InventoryItem
from ..serializers.shipment_serializer import ShipmentSerializer
from ..models.enums import ShipmentType, ShipmentStatus

class ShipmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing shipments.
    
    Provides operations for:
    - Creating incoming and outgoing shipments
    - Tracking shipment status
    - Managing inventory updates
    - Filtering and searching shipments
    """
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Shipment.objects.all()
        search = self.request.query_params.get('search', None)
        status = self.request.query_params.get('status', None)
        type = self.request.query_params.get('type', None)

        if search:
            queryset = queryset.filter(
                tracking_number__icontains=search
            )
        
        if status:
            queryset = queryset.filter(status=status)
        
        if type:
            queryset = queryset.filter(type=type)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of a shipment.
        
        Status transitions and inventory handling:
        - PENDING -> IN_TRANSIT: No inventory changes
        - PENDING/IN_TRANSIT -> DELIVERED: Updates inventory based on shipment type
        - PENDING/IN_TRANSIT -> CANCELLED: No inventory changes
        - DELIVERED/CANCELLED: Cannot be changed (final states)
        """
        
        shipment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [s.value for s in ShipmentStatus]:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prevent changing from final states
        if shipment.status in [ShipmentStatus.DELIVERED.value, ShipmentStatus.CANCELLED.value]:
            return Response(
                {'error': f'Cannot change status from {shipment.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Handle inventory changes
        if new_status == ShipmentStatus.DELIVERED.value:
            shipment.actual_arrival = timezone.now()

            # Update inventory quantities
            for item in shipment.shipment_items.all():
                if shipment.type == ShipmentType.INCOMING.value:
                    # Handle INCOMING Shipments

                    # Add the quantity to the inventory
                    item.item.quantity += item.quantity
                else:  
                    # Handle OUTGOING Shipments

                    # Check if we have enough inventory
                    if item.item.quantity < item.quantity:
                        return Response(
                            {'error': f'Not enough inventory for item {item.item.name}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # Subtract the quantity from the inventory
                    item.item.quantity -= item.quantity
                
                # Save the inventory item
                item.item.save()
        
        # Update the shipment status
        shipment.status = new_status
        shipment.save()

        # Return the updated shipment
        serializer = self.get_serializer(shipment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get shipments from the last 30 days.
        """

        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_shipments = Shipment.objects.filter(
            created_at__gte=thirty_days_ago
        ).order_by('-created_at')
        
        serializer = self.get_serializer(recent_shipments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def item_history(self, request):
        """
        Get shipment history for a specific item.
        """
        
        item_id = request.query_params.get('item_id')
        if not item_id:
            return Response(
                {'error': 'Item ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            shipments = Shipment.objects.filter(
                shipment_items__item_id=item_id
            ).order_by('-created_at')
            
            serializer = self.get_serializer(shipments, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 