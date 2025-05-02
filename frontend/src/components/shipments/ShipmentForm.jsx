import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";

const ShipmentForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    shipment, 
    setShipment, 
    isEditing 
}) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const items = await inventoryService.getAll();
                console.log("Fetched inventory items:", items);
                setInventoryItems(items);
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };
        console.log("fetching inventory items...");
        fetchInventoryItems();
    }, []);

    const handleAddItem = (itemId) => {
        
        // Check if item already exists in the shipment
        if (shipment.shipment_items?.some(item => item.item_id === itemId)) {
            console.log("Item already exists in shipment");
            return;
        }

        console.log("Adding item:", itemId);
        
        const newItems = [...(shipment.shipment_items || []), { 
            item_id: itemId,
            quantity: 1,
            unit_price: 0 // Default price, will be updated by user
        }];

        setShipment({ ...shipment, shipment_items: newItems });
    };

    const handleRemoveItem = (itemId) => {
        const newItems = shipment.shipment_items.filter(item => item.item_id !== itemId);
        setShipment({ ...shipment, shipment_items: newItems });
    };

    const handleItemQuantityChange = (itemId, quantity) => {
        const newItems = shipment.shipment_items.map(item => 
            item.item_id === itemId 
                ? { ...item, quantity: parseInt(quantity) } 
                : item
        );
        setShipment({ ...shipment, shipment_items: newItems });
    };

    const handleItemPriceChange = (itemId, price) => {
        const newItems = shipment.shipment_items.map(item => 
            item.item_id === itemId 
                ? { ...item, unit_price: parseFloat(price) } 
                : item
        );
        setShipment({ ...shipment, shipment_items: newItems });
    };

    const filteredItems = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Edit Shipment' : 'New Shipment'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={shipment.type}
                                onChange={(e) => setShipment({ ...shipment, type: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                required
                            >
                                <option value="IN">Incoming</option>
                                <option value="OUT">Outgoing</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                            <select
                                value={shipment.carrier}
                                onChange={(e) => setShipment({ ...shipment, carrier: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                required
                            >
                                <option value="">Select a carrier</option>
                                <option value="USPS">USPS</option>
                                <option value="UPS">UPS</option>
                                <option value="FedEx">FedEx</option>
                                <option value="DHL">DHL</option>
                                <option value="Amazon">Amazon</option>
                                <option value="Other">Other</option>
                            </select>
                            {shipment.carrier === "Other" && (
                                <input
                                    type="text"
                                    value={shipment.custom_carrier || ""}
                                    onChange={(e) => setShipment({ ...shipment, custom_carrier: e.target.value })}
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                    placeholder="Enter carrier name"
                                    required
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                            <input
                                type="text"
                                value={shipment.tracking_number}
                                onChange={(e) => setShipment({ ...shipment, tracking_number: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                required
                                placeholder="Enter carrier tracking number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Arrival</label>
                            <input
                                type="date"
                                value={shipment.estimated_arrival}
                                onChange={(e) => setShipment({ ...shipment, estimated_arrival: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Items</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Search by name or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            />
                        </div>
                        <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleAddItem(item.id)}
                                >
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Available: {item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selected Items</label>
                        <div className="border rounded-md">
                            {shipment.shipment_items?.map((item) => {
                                const inventoryItem = inventoryItems.find(i => i.id === item.item_id);

                                if (!inventoryItem) return null;
                                
                                return (
                                    <div key={item.item_id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                                        <div>
                                            <div className="font-medium">{inventoryItem.name}</div>
                                            <div className="text-sm text-gray-500">SKU: {inventoryItem.sku}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm text-gray-500">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemQuantityChange(item.item_id, e.target.value)}
                                                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm text-gray-500">Unit Price</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemPriceChange(item.item_id, e.target.value)}
                                                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.item_id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
                        >
                            {isEditing ? 'Update' : 'Create'} Shipment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShipmentForm; 