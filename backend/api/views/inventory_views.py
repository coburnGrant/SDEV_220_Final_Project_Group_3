from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F
from ..models import InventoryItem
from ..serializers.inventory_item_serializer import InventoryItemSerializer

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
        Get a list of all unique categories in the inventory.
        """
        categories = InventoryItem.objects.values_list('category', flat=True).distinct()
        return Response(categories)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """
        Get a list of all items that are below their minimum stock level.
        """
        low_stock_items = InventoryItem.objects.filter(quantity__lte=F('minimum_stock'))
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data) 