from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Shipment, ShipmentItem, Product
from django.utils import timezone
from datetime import timedelta
from ..models.enums import ShipmentType, ShipmentStatus

class ShipmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Get token for authentication
        token_response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.token = token_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create test products
        self.product1 = Product.objects.create(
            name='Test Product 1',
            sku='SKU001',
            description='Test Description 1',
            price=10.99,
            quantity=10,
            reorder_level=5
        )
        
        self.product2 = Product.objects.create(
            name='Test Product 2',
            sku='SKU002',
            description='Test Description 2',
            price=20.99,
            quantity=10,
            reorder_level=5
        )

    def test_create_incoming_shipment(self):
        """Test creating an incoming shipment"""
        data = {
            'type': ShipmentType.INCOMING.value,
            'status': ShipmentStatus.PENDING.value,
            'tracking_number': 'TRACK001',
            'carrier': 'FedEx',
            'estimated_arrival': (timezone.now() + timedelta(days=5)).isoformat(),
            'items': [
                {
                    'product': self.product1.id,
                    'quantity': 5,
                    'unit_price': 10.99
                },
                {
                    'product': self.product2.id,
                    'quantity': 3,
                    'unit_price': 20.99
                }
            ]
        }
        response = self.client.post('/api/shipments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Shipment.objects.filter(tracking_number='TRACK001').exists())

    def test_create_outgoing_shipment(self):
        """Test creating an outgoing shipment"""
        data = {
            'type': ShipmentType.OUTGOING.value,
            'status': ShipmentStatus.PENDING.value,
            'tracking_number': 'TRACK002',
            'carrier': 'UPS',
            'estimated_arrival': (timezone.now() + timedelta(days=3)).isoformat(),
            'items': [
                {
                    'product': self.product1.id,
                    'quantity': 2,
                    'unit_price': 10.99
                }
            ]
        }
        response = self.client.post('/api/shipments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Shipment.objects.filter(tracking_number='TRACK002').exists())

    def test_update_shipment_status(self):
        """Test updating shipment status and inventory quantities"""
        # Create a shipment
        shipment = Shipment.objects.create(
            type=ShipmentType.INCOMING.value,
            status=ShipmentStatus.PENDING.value,
            tracking_number='TRACK003',
            carrier='FedEx',
            estimated_arrival=timezone.now() + timedelta(days=5)
        )
        ShipmentItem.objects.create(
            shipment=shipment,
            product=self.product1,
            quantity=5,
            unit_price=10.99
        )

        # Update status to DELIVERED
        response = self.client.post(f'/api/shipments/{shipment.id}/update_status/', {'status': ShipmentStatus.DELIVERED.value})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if inventory was updated
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.quantity, 15)  # Original 10 + 5 from shipment

    def test_list_shipments(self):
        """Test listing all shipments"""
        # Create some shipments
        Shipment.objects.create(
            type=ShipmentType.INCOMING.value,
            status=ShipmentStatus.PENDING.value,
            tracking_number='TRACK004',
            carrier='FedEx',
            estimated_arrival=timezone.now() + timedelta(days=5)
        )
        Shipment.objects.create(
            type=ShipmentType.OUTGOING.value,
            status=ShipmentStatus.DELIVERED.value,
            tracking_number='TRACK005',
            carrier='UPS',
            estimated_arrival=timezone.now() + timedelta(days=3),
            actual_arrival=timezone.now()
        )

        response = self.client.get('/api/shipments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_shipments(self):
        """Test filtering shipments by type and status"""
        # Create shipments with different types and statuses
        Shipment.objects.create(
            type=ShipmentType.INCOMING.value,
            status=ShipmentStatus.PENDING.value,
            tracking_number='TRACK006',
            carrier='FedEx',
            estimated_arrival=timezone.now() + timedelta(days=5)
        )
        Shipment.objects.create(
            type=ShipmentType.OUTGOING.value,
            status=ShipmentStatus.DELIVERED.value,
            tracking_number='TRACK007',
            carrier='UPS',
            estimated_arrival=timezone.now() + timedelta(days=3),
            actual_arrival=timezone.now()
        )

        # Filter by type
        response = self.client.get('/api/shipments/?type=IN')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['type'], ShipmentType.INCOMING.value)

        # Filter by status
        response = self.client.get('/api/shipments/?status=DELIVERED')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], ShipmentStatus.DELIVERED.value) 