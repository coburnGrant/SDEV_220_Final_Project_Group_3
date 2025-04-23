from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from ..models import InventoryItem

class InventoryTests(TestCase):
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
            quantity=3,
            location='B2',
            category='Furniture',
            minimum_stock=5,
            created_by=self.user,
            last_updated_by=self.user
        )

    def test_create_inventory_item(self):
        """Test creating a new inventory item"""
        data = {
            'name': 'New Item',
            'sku': 'SKU003',
            'description': 'New Description',
            'quantity': 15,
            'location': 'C3',
            'category': 'Tools',
            'minimum_stock': 10
        }
        response = self.client.post('/api/inventory/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(InventoryItem.objects.filter(sku='SKU003').exists())

    def test_list_inventory_items(self):
        """Test listing all inventory items"""
        response = self.client.get('/api/inventory/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_inventory_item(self):
        """Test retrieving a single inventory item"""
        response = self.client.get(f'/api/inventory/{self.item1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Item 1')

    def test_update_inventory_item(self):
        """Test updating an inventory item"""
        data = {
            'name': 'Updated Item',
            'quantity': 20
        }
        response = self.client.patch(f'/api/inventory/{self.item1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item1.refresh_from_db()
        self.assertEqual(self.item1.name, 'Updated Item')
        self.assertEqual(self.item1.quantity, 20)

    def test_delete_inventory_item(self):
        """Test deleting an inventory item"""
        response = self.client.delete(f'/api/inventory/{self.item1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(InventoryItem.objects.filter(id=self.item1.id).exists())

    def test_search_inventory_items(self):
        """Test searching inventory items"""
        response = self.client.get('/api/inventory/?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_category(self):
        """Test filtering inventory items by category"""
        response = self.client.get('/api/inventory/?category=Electronics')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['category'], 'Electronics')

    def test_low_stock_items(self):
        """Test getting low stock items"""
        response = self.client.get('/api/inventory/low_stock/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only item2 has quantity < minimum_stock 