from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from ..models import InventoryItem, Shipment, ShipmentItem
from django.utils import timezone
from datetime import timedelta

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
        
        # Create test inventory items
        self.item1 = InventoryItem.objects.create(
            name='Test Item 1',
            sku='SKU001',
            description='Test Description 1',
            quantity=10,
            location='A1',
            category='Electronics',
            minimum_stock=5,
            created_by=self.user,
            last_updated_by=self.user
        )
        
        self.item2 = InventoryItem.objects.create(
            name='Test Item 2',
            sku='SKU002',
            description='Test Description 2',
            quantity=10,
            location='B2',
            category='Furniture',
            minimum_stock=5,
            created_by=self.user,
            last_updated_by=self.user
        )

    def test_create_incoming_shipment(self):
        """Test creating an incoming shipment"""
        data = {
            'type': 'IN',
            'tracking_number': 'TRACK001',
            'expected_delivery_date': (timezone.now() + timedelta(days=5)).isoformat(),
            'items': [
                {
                    'inventory_item_id': self.item1.id,
                    'quantity': 5
                },
                {
                    'inventory_item_id': self.item2.id,
                    'quantity': 3
                }
            ]
        }
        response = self.client.post('/api/shipments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Shipment.objects.filter(tracking_number='TRACK001').exists())

    def test_create_outgoing_shipment(self):
        """Test creating an outgoing shipment"""
        data = {
            'type': 'OUT',
            'tracking_number': 'TRACK002',
            'expected_delivery_date': (timezone.now() + timedelta(days=3)).isoformat(),
            'items': [
                {
                    'inventory_item_id': self.item1.id,
                    'quantity': 2
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
            type='IN',
            tracking_number='TRACK003',
            status='PENDING',
            created_by=self.user,
            updated_by=self.user
        )
        ShipmentItem.objects.create(
            shipment=shipment,
            inventory_item=self.item1,
            quantity=5
        )

        # Update status to DELIVERED
        response = self.client.post(f'/api/shipments/{shipment.id}/update_status/', {'status': 'DELIVERED'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if inventory was updated
        self.item1.refresh_from_db()
        self.assertEqual(self.item1.quantity, 15)  # Original 10 + 5 from shipment

    def test_list_shipments(self):
        """Test listing all shipments"""
        # Create some shipments
        Shipment.objects.create(
            type='IN',
            tracking_number='TRACK004',
            status='PENDING',
            created_by=self.user,
            updated_by=self.user
        )
        Shipment.objects.create(
            type='OUT',
            tracking_number='TRACK005',
            status='DELIVERED',
            created_by=self.user,
            updated_by=self.user
        )

        response = self.client.get('/api/shipments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_shipments(self):
        """Test filtering shipments by type and status"""
        # Create shipments with different types and statuses
        Shipment.objects.create(
            type='IN',
            tracking_number='TRACK006',
            status='PENDING',
            created_by=self.user,
            updated_by=self.user
        )
        Shipment.objects.create(
            type='OUT',
            tracking_number='TRACK007',
            status='DELIVERED',
            created_by=self.user,
            updated_by=self.user
        )

        # Filter by type
        response = self.client.get('/api/shipments/?type=IN')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['type'], 'IN')

        # Filter by status
        response = self.client.get('/api/shipments/?status=DELIVERED')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], 'DELIVERED') 