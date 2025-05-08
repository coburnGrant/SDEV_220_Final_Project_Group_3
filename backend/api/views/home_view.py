from django.shortcuts import render, redirect
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .inventory_views import InventoryItemViewSet
from .shipment_views import ShipmentViewSet
from ..models.enums import ShipmentStatus
from rest_framework.response import Response
from django.db.models import Count, Sum
from api.models import Shipment, InventoryItem
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from django.contrib.auth import logout

class APIInfoHelper:
    """Basic helper class to get information about the API"""

    @staticmethod
    def get_available_endpoints():
        """Gets lookup of API endpoints keyed by their description"""

        return {
            "inventory": "/api/inventory/",
            "shipments": "/api/shipments/",
            "users": "/api/users/",
            "dashboard": "/api/inventory/dashboard_data/",
            "documentation": "/swagger/"
        }
    
    @staticmethod
    def get_version():
        """Gets the API's version"""

        return "1.0.0"

class HomeView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [SessionAuthentication]

    def get_basic_context(self) -> dict:
        """Get the basic context that should always be returned"""

        return {
            "version": APIInfoHelper.get_version(),
            "status": "operational",
            "timestamp": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "available_endpoints": APIInfoHelper.get_available_endpoints()
        }

    def get_system_stats(self) -> dict:
        """Get system statistics for authenticated users"""
        inventory_count = 0
        outstanding_shipments = 0
        
        try:
            inventory_count = InventoryItemViewSet.queryset.count()
            outstanding_shipments = ShipmentViewSet.queryset.exclude(
                status=ShipmentStatus.DELIVERED.value
            ).count()
        except:
            pass

        return {
            "total_inventory_items": inventory_count,
            "outstanding_shipments": outstanding_shipments
        }

    def get(self, request):        
        # Start with basic context that's always included
        context = self.get_basic_context()
        
        # Add authentication status
        context['isAuthenticated'] = request.user.is_authenticated
        
        # Add system stats if user is authenticated
        if request.user.is_authenticated:
            context['system_stats'] = self.get_system_stats()
        
        return render(request, 'api/home.html', context)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request):
    """Logout view that works with GET requests. Will redirect to home after logging out."""

    logout(request)
    return redirect('/')