# Example inventory dictionary
inventory = {
    "laptop": 10,
    "mouse": 25,
    "keyboard": 15
}

# Example shipment data
shipments = [
    {
        "id": 1,
        "status": "departed",
        "items": {
            "laptop": 2,
            "mouse": 5
        }
    },
    {
        "id": 2,
        "status": "delivered",
        "items": {
            "laptop": 3,
            "keyboard": 4
        }
    }
]

def update_inventory(shipment, inventory):
    for item, qty in shipment['items'].items():
        if shipment['status'] == "delivered":
            # Increase inventory
            inventory[item] = inventory.get(item, 0) + qty
            print(f"Added {qty} of {item} to inventory.")
        elif shipment['status'] == "departed":
            # Decrease inventory, ensuring it doesn't go negative
            if inventory.get(item, 0) >= qty:
                inventory[item] -= qty
                print(f"Removed {qty} of {item} from inventory.")
            else:
                print(f"Warning: Not enough {item} in inventory to remove {qty}.")
        else:
            print(f"Unknown shipment status: {shipment['status']}")

# Run updates for all shipments
for shipment in shipments:
    update_inventory(shipment, inventory)

print("\nFinal inventory:", inventory)
