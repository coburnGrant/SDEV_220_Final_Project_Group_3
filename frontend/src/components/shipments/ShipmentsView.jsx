import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { shipmentService } from "../../services/shipmentService";
import ShipmentForm from "./ShipmentForm";
import ShipmentRow from "./ShipmentRow";
import ShipmentDetails from "./ShipmentDetails";

const ShipmentsView = () => {
    const [shipments, setShipments] = useState([]);
    const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [newShipment, setNewShipment] = useState({
        type: 'IN',
        status: 'PENDING',
        carrier: '',
        tracking_number: '',
        estimated_arrival: '',
        items: []
    });

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const data = await shipmentService.getAll();
            setShipments(data);
        } catch (error) {
            console.error('Error fetching shipments:', error);
        }
    };

    const handleNewShipment = () => {
        setNewShipment({
            type: 'IN',
            status: 'PENDING',
            carrier: '',
            tracking_number: '',
            estimated_arrival: '',
            shipment_items: []
        });
        setShowNewShipmentForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Transform the data to match the API expectations
            const transformedShipment = {
                ...newShipment,
                shipment_items: newShipment.shipment_items.map(item => ({
                    item: item.item_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }))
            };

            console.log("Creating shipment with transformed data:", transformedShipment);

            await shipmentService.create(transformedShipment);

            setShowNewShipmentForm(false);

            fetchShipments();
        } catch (error) {
            console.error('Error creating shipment:', error);
        }
    };

    const handleViewDetails = (shipment) => {
        setSelectedShipment(shipment);
    };

    const handleCloseDetails = () => {
        setSelectedShipment(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            try {
                await shipmentService.delete(id);
                fetchShipments();
            } catch (error) {
                console.error('Error deleting shipment:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Shipments</h2>
                <button
                    onClick={handleNewShipment}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Shipment
                </button>
            </div>

            {showNewShipmentForm && (
                <ShipmentForm
                    isOpen={showNewShipmentForm}
                    onClose={() => setShowNewShipmentForm(false)}
                    onSubmit={handleFormSubmit}
                    shipment={newShipment}
                    setShipment={setNewShipment}
                    isEditing={false}
                />
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="py-3 px-4 text-left">Type</th>
                                <th className="py-3 px-4 text-left">Tracking Number</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Carrier</th>
                                <th className="py-3 px-4 text-left">Estimated Arrival</th>
                                <th className="py-3 px-4 text-left">Items</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((shipment) => (
                                <ShipmentRow
                                    key={shipment.id}
                                    shipment={shipment}
                                    onViewDetails={handleViewDetails}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedShipment && (
                <ShipmentDetails
                    shipment={selectedShipment}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default ShipmentsView; 