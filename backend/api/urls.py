from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CreateUserView,
    CurrentUserView,
    UserListView,
    UserDeleteView,
    InventoryItemViewSet,
    ShipmentViewSet,
    ShipmentItemViewSet
)

router = DefaultRouter()
router.register(r'inventory', InventoryItemViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'shipment-items', ShipmentItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', CreateUserView.as_view(), name='register'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),
    path('', home),
]