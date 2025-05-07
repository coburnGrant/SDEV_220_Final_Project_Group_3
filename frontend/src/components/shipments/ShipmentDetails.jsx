import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";

const ShipmentDetails = ({ shipment, onClose }) => {
    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                // Reset inventory items
                setInventoryItems([]);

                const items = shipment.shipment_items;

                console.log("getting inventory items for shipment items", items);
                
                // Fetch each inventory item for the shipment items
                for (const shipmentItem of items) {
                    const item = await inventoryService.getById(shipmentItem.item);
                    setInventoryItems(prevItems => [...prevItems, item]);
                }
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };

        if (shipment?.shipment_items) {
            fetchInventoryItems();
        }
    }, [shipment]);

    if (!shipment) return null;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Shipment Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Type</h3>
                            <p className="mt-1">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    shipment.type === 'IN' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {shipment.type === 'IN' ? 'Incoming' : 'Outgoing'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    shipment.status === 'DELIVERED' 
                                        ? 'bg-green-100 text-green-800'
                                        : shipment.status === 'IN_TRANSIT'
                                        ? 'bg-blue-100 text-blue-800'
                                        : shipment.status === 'CANCELLED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {shipment.status}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Tracking Number</h3>
                            <p className="mt-1">{shipment.tracking_number}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Carrier</h3>
                            <p className="mt-1">{shipment.carrier}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Estimated Arrival</h3>
                            <p className="mt-1">{new Date(shipment.estimated_arrival).toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Actual Arrival</h3>
                            <p className="mt-1">
                                {shipment.actual_arrival 
                                    ? new Date(shipment.actual_arrival).toLocaleString()
                                    : 'Not yet arrived'}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Items</h3>
                        <div className="border rounded-md">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">SKU</th>
                                        <th className="py-2 px-4 text-right">Quantity</th>
                                        <th className="py-2 px-4 text-right">Unit Price</th>
                                        <th className="py-2 px-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipment.shipment_items?.map((item) => {
                                        const inventoryItem = inventoryItems.find(i => i.id === item.item);
                                        if (!inventoryItem) return null;
                                        
                                        const unitPrice = parseFloat(item.unit_price);
                                        const total = unitPrice * item.quantity;
                                        
                                        return (
                                            <tr key={item.id} className="border-b last:border-b-0">
                                                <td className="py-2 px-4">{inventoryItem.name}</td>
                                                <td className="py-2 px-4">{inventoryItem.sku}</td>
                                                <td className="py-2 px-4 text-right">{item.quantity}</td>
                                                <td className="py-2 px-4 text-right">
                                                    ${unitPrice.toFixed(2)}
                                                </td>
                                                <td className="py-2 px-4 text-right">
                                                    ${total.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-6 text-sm text-gray-500">
                        <div>
                            <p>Created by: {shipment.created_by?.username}</p>
                            <p>Created at: {new Date(shipment.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p>Last updated by: {shipment.updated_by?.username}</p>
                            <p>Last updated at: {new Date(shipment.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails; 