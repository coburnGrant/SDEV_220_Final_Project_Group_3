from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            password='adminpass123',
            email='admin@example.com'
        )
        self.regular_user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )

    def test_user_registration(self):
        """Test user registration endpoint"""
        data = {
            'username': 'newuser',
            'password': 'newpass123'
        }
        response = self.client.post('/api/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_token_obtain(self):
        """Test JWT token obtain endpoint"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_get_current_user(self):
        """Test getting current user info"""
        # Login to get token
        token_response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        token = token_response.data['access']
        
        # Set token in header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Get current user
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_admin_user_list(self):
        """Test admin-only user list endpoint"""
        # Login as admin
        token_response = self.client.post('/api/token/', {
            'username': 'admin',
            'password': 'adminpass123'
        })
        token = token_response.data['access']
        
        # Set token in header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Get user list
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # admin and regular user

    def test_admin_user_delete(self):
        """Test admin-only user delete endpoint"""
        # Login as admin
        token_response = self.client.post('/api/token/', {
            'username': 'admin',
            'password': 'adminpass123'
        })
        token = token_response.data['access']
        
        # Set token in header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Delete regular user
        response = self.client.delete(f'/api/users/{self.regular_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username='testuser').exists()) 