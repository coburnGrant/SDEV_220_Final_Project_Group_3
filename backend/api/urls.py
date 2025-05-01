from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.inventory_views import InventoryItemViewSet
from .views.shipment_views import ShipmentViewSet
from .views.user_views import CurrentUserView, UserListView, UserDeleteView

router = DefaultRouter()
router.register(r'inventory', InventoryItemViewSet, basename='inventory')
router.register(r'shipments', ShipmentViewSet, basename='shipments')

urlpatterns = [
    path('', include(router.urls)),
    path('user/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),
]