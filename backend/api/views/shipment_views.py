from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from ..models import Shipment
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
        shipment_type = self.request.query_params.get('type', None)
        status = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)

        if shipment_type:
            queryset = queryset.filter(type=shipment_type)
        
        if status:
            queryset = queryset.filter(status=status)
        
        if search:
            queryset = queryset.filter(
                Q(tracking_number__icontains=search) |
                Q(carrier__icontains=search)
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of a shipment.
        
        When status is set to DELIVERED:
        - Updates the actual arrival time
        - Adjusts inventory quantities based on shipment type
        """
        shipment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [s.value for s in ShipmentStatus]:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        shipment.status = new_status
        if new_status == ShipmentStatus.DELIVERED.value:
            shipment.actual_arrival = timezone.now()
            # Update inventory quantities
            for item in shipment.shipment_items.all():
                if shipment.type == ShipmentType.INCOMING.value:
                    item.item.quantity += item.quantity
                else:  # OUTGOING
                    item.item.quantity -= item.quantity
                item.item.save()
        
        shipment.save()
        serializer = self.get_serializer(shipment)
        return Response(serializer.data) 