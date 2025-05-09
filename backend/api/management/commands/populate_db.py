from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import InventoryItem, Shipment, ShipmentItem
from api.models.enums import ShipmentStatus, ShipmentType
from django.contrib.auth.models import User
import random
from datetime import timedelta
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populates the database with sample inventory and shipment data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        ShipmentItem.objects.all().delete()
        Shipment.objects.all().delete()
        InventoryItem.objects.all().delete()
        self.stdout.write('Existing data cleared successfully')

        # Ensure we have at least one admin user
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            is_staff=True,
            is_superuser=True
        )

        # Define some realistic inventory items
        inventory_data = [
            # Electronics
            {"name": "Dell Latitude Laptop", "category": "Electronics", "min_stock": 5, "price": 999.99},
            {"name": "HP LaserJet Printer", "category": "Electronics", "min_stock": 3, "price": 299.99},
            {"name": "iPad Pro 12.9", "category": "Electronics", "min_stock": 10, "price": 1099.99},
            {"name": "Logitech Wireless Mouse", "category": "Electronics", "min_stock": 20, "price": 29.99},
            {"name": "Samsung 27\" Monitor", "category": "Electronics", "min_stock": 8, "price": 249.99},
            
            # Office Supplies
            {"name": "Premium Copy Paper", "category": "Office Supplies", "min_stock": 50, "price": 7.99},
            {"name": "Stapler Set", "category": "Office Supplies", "min_stock": 15, "price": 12.99},
            {"name": "Sticky Notes Pack", "category": "Office Supplies", "min_stock": 30, "price": 3.99},
            {"name": "Ballpoint Pens Box", "category": "Office Supplies", "min_stock": 40, "price": 15.99},
            {"name": "File Folders Bundle", "category": "Office Supplies", "min_stock": 25, "price": 19.99},
            
            # Furniture
            {"name": "Ergonomic Office Chair", "category": "Furniture", "min_stock": 10, "price": 299.99},
            {"name": "Standing Desk", "category": "Furniture", "min_stock": 5, "price": 499.99},
            {"name": "Filing Cabinet", "category": "Furniture", "min_stock": 8, "price": 199.99},
            {"name": "Conference Table", "category": "Furniture", "min_stock": 3, "price": 899.99},
            {"name": "Bookshelf", "category": "Furniture", "min_stock": 6, "price": 149.99},
            
            # Storage
            {"name": "Storage Bin Large", "category": "Storage", "min_stock": 15, "price": 29.99},
            {"name": "Plastic Storage Box", "category": "Storage", "min_stock": 20, "price": 19.99},
            {"name": "Metal Shelving Unit", "category": "Storage", "min_stock": 10, "price": 129.99},
            {"name": "Tool Cabinet", "category": "Storage", "min_stock": 5, "price": 299.99},
            {"name": "Utility Cart", "category": "Storage", "min_stock": 8, "price": 149.99}
        ]

        # Warehouse locations
        locations = [
            "Main Warehouse A1",
            "Main Warehouse B2",
            "Electronics Storage C3",
            "Furniture Showroom D4",
            "Office Supplies Store E5"
        ]

        # Carriers for shipments
        carriers = ["UPS", "FedEx", "DHL", "USPS", "Amazon"]

        # Create inventory items
        inventory_items = []
        # Randomly select one item to be in low stock
        low_stock_item_idx = random.randint(0, len(inventory_data) - 1)
        
        for idx, item_data in enumerate(inventory_data, 1):
            # Generate unique SKU: Category prefix + 3-digit sequence + random 2-digit suffix
            category_prefix = item_data['category'][:3].upper()
            random_suffix = random.randint(10, 99)
            sku = f"{category_prefix}{idx:03d}{random_suffix}"
            
            # If this is the selected low stock item, set quantity below minimum_stock
            if idx - 1 == low_stock_item_idx:
                quantity = random.randint(1, item_data['min_stock'] - 1)
                self.stdout.write(f'Setting low stock for {item_data["name"]}: {quantity} (min: {item_data["min_stock"]})')
            else:
                quantity = random.randint(item_data['min_stock'], item_data['min_stock'] * 3)
            
            item = InventoryItem.objects.create(
                name=item_data['name'],
                sku=sku,
                description=f"High-quality {item_data['name'].lower()} for professional use",
                quantity=quantity,
                location=random.choice(locations),
                category=item_data['category'],
                minimum_stock=item_data['min_stock'],
                created_by=admin_user,
                last_updated_by=admin_user
            )
            inventory_items.append(item)

        # Create shipments
        for i in range(1, 11):  # Create 10 shipments
            created_at = timezone.now() - timedelta(days=random.randint(0, 30))
            estimated_arrival = created_at + timedelta(days=random.randint(2, 7))
            actual_arrival = None
            if random.random() > 0.3:  # 70% chance of having actual arrival
                actual_arrival = estimated_arrival + timedelta(days=random.randint(-1, 2))
            
            shipment = Shipment.objects.create(
                type=random.choice([t[0] for t in ShipmentType.choices()]),
                status=random.choice([s[0] for s in ShipmentStatus.choices()]),
                tracking_number=f"TRK{i:06d}",
                carrier=random.choice(carriers),
                estimated_arrival=estimated_arrival,
                actual_arrival=actual_arrival,
                created_by=admin_user,
                updated_by=admin_user
            )

            # Add 1-5 items to each shipment
            num_items = random.randint(1, 5)
            selected_items = random.sample(inventory_items, num_items)
            
            for item in selected_items:
                # Find the matching item data to get the price
                item_data = next(d for d in inventory_data if d['name'] == item.name)
                ShipmentItem.objects.create(
                    shipment=shipment,
                    item=item,
                    quantity=random.randint(1, min(5, item.quantity)),
                    unit_price=Decimal(str(item_data['price']))
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))
        self.stdout.write(f'Created:')
        self.stdout.write(f'- {len(inventory_items)} inventory items')
        self.stdout.write(f'- {Shipment.objects.count()} shipments')
        self.stdout.write(f'- {ShipmentItem.objects.count()} shipment items') 