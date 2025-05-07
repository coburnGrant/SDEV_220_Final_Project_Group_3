from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F, Count
from django.utils import timezone
from datetime import timedelta
from ..models import InventoryItem, Shipment, ShipmentItem
from ..models.inventory_item import InventoryCategory
from ..serializers.inventory_item_serializer import InventoryItemSerializer
from ..models.enums import ShipmentType, ShipmentStatus

class InventoryItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing inventory items.
    
    Provides operations for:
    - Creating and updating inventory items
    - Searching and filtering items
    - Tracking low stock items
    - Managing categories
    """
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        low_stock = self.request.query_params.get('low_stock', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(sku__icontains=search) |
                Q(description__icontains=search)
            )
        
        if category:
            queryset = queryset.filter(category=category)
        
        if low_stock == 'true':
            queryset = queryset.filter(quantity__lte=F('minimum_stock'))
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, last_updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(last_updated_by=self.request.user)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Get a list of all unique categories in the inventory and suggested categories.
        """
        # Get existing categories from inventory items
        existing_categories = InventoryItem.objects.values_list('category', flat=True).distinct()
        
        # Get suggested categories
        suggested_categories = InventoryCategory.get_suggested_categories()
        
        # Combine and deduplicate categories
        all_categories = list(set(list(existing_categories) + suggested_categories))
        return Response(sorted(all_categories))

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """
        Get all items that are at or below their minimum stock level.
        """
        low_stock_items = InventoryItem.objects.filter(
            quantity__lte=F('minimum_stock')
        )
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Get historical inventory data for an item.
        Returns quantity changes over time based on shipment history.
        """
        try:
            item = self.get_object()
            
            # Get all shipments that include this item
            shipments = item.shipmentitem_set.all().order_by('shipment__created_at')
            
            # Process history with default quantity calculation
            history_data = self.process_shipment_history(
                shipments,
                current_value=item.quantity  # Add current quantity as final point
            )
            
            # Rename 'value' to 'quantity' for this endpoint
            for point in history_data:
                point['quantity'] = point.pop('value')
            
            return Response(history_data)
            
        except InventoryItem.DoesNotExist:
            return Response(
                {'error': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def value_history(self, request):
        """
        Get the total inventory value history over time.
        Returns data points for the last 30 days.
        """
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        # Get all delivered shipments in the last 30 days
        shipments = Shipment.objects.filter(
            Q(status=ShipmentStatus.DELIVERED.value) &
            Q(created_at__gte=thirty_days_ago)
        ).order_by('created_at')

        # Calculate current total value
        current_value = sum(
            item.quantity * float(item.unit_price)
            for item in InventoryItem.objects.all()
        )

        # Define value calculator for this endpoint
        def calculate_value(shipment_item, current_value):
            if shipment_item.shipment.type == ShipmentType.INCOMING.value:
                return current_value + (shipment_item.quantity * float(shipment_item.unit_price))
            else:  # OUT
                return current_value - (shipment_item.quantity * float(shipment_item.unit_price))

        # Process history with value calculation
        history_data = self.process_shipment_history(
            ShipmentItem.objects.filter(shipment__in=shipments),
            value_calculator=calculate_value,
            current_value=current_value  # Add current total value as final point
        )

        return Response(history_data)

    @action(detail=False, methods=['get'])
    def dashboard_data(self, request):
        """
        Get all data needed for the dashboard charts.
        Returns processed data for:
        - Recent shipment activity
        - Top items by quantity
        - Outstanding shipments count
        """
        try:
            thirty_days_ago = timezone.now() - timedelta(days=30)

            # Get recent shipment activity
            try:
                recent_shipments = Shipment.objects.filter(
                    created_at__gte=thirty_days_ago
                )
                shipment_activity = recent_shipments.values('type').annotate(
                    count=Count('id')
                )
            except Exception as e:
                shipment_activity = []

            # Get top items by quantity
            try:
                top_items = InventoryItem.objects.order_by('-quantity')[:5].values(
                    'name', 'quantity', 'minimum_stock'
                )
            except Exception as e:
                top_items = []

            # Get outstanding shipments count
            try:
                outstanding_shipments = Shipment.objects.exclude(
                    status=ShipmentStatus.DELIVERED.value
                ).count()
            except Exception as e:
                outstanding_shipments = 0

            return Response({
                'shipment_activity': list(shipment_activity),
                'top_items': list(top_items),
                'outstanding_shipments': outstanding_shipments
            })

        except Exception as e:
            return Response(
                {'error': 'Failed to process dashboard data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @staticmethod
    def process_shipment_history(shipments, initial_value=0, value_calculator=None, current_value=None):
        """
        Process shipment history and calculate values over time.
        
        Args:
            shipments: QuerySet of ShipmentItems
            initial_value: Starting value (default 0)
            value_calculator: Optional function to calculate value change for each shipment
            current_value: Optional current value to add as final data point
        
        Returns:
            List of data points with date and calculated value
        """
        
        history_data = []
        running_value = initial_value
        
        for shipment_item in shipments:
            shipment = shipment_item.shipment
            
            # Only consider delivered shipments
            if shipment.status == ShipmentStatus.DELIVERED.value:
                if value_calculator:
                    running_value = value_calculator(shipment_item, running_value)
                else:
                    # Default quantity calculation
                    if shipment.type == ShipmentType.INCOMING.value:
                        running_value += shipment_item.quantity
                    else:  # OUT
                        running_value -= shipment_item.quantity
                
                history_data.append({
                    'date': shipment.created_at,
                    'value': running_value,
                    'shipment_id': shipment.id,
                    'type': shipment.type,
                    'status': shipment.status
                })
        
        # Add current state as final data point if provided
        if current_value is not None:
            history_data.append({
                'date': timezone.now(),
                'value': current_value,
                'shipment_id': None,
                'type': None,
                'status': 'CURRENT'
            })
        
        return history_data