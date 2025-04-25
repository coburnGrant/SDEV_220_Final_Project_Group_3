import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { shipmentService } from "../../services/shipmentService";
import ShipmentForm from "./ShipmentForm";
import ShipmentList from "./ShipmentList";
import ShipmentDetails from "./ShipmentDetails";

const ShipmentsView = () => {
    const [shipments, setShipments] = useState([]);
    const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [toast, setToast] = useState({ message: "", color: "" });
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
            showToast('Failed to load shipments', 'red');
        }
    };

    const showToast = (message, color = "green") => {
        setToast({ message, color });
        setTimeout(() => {
            setToast({ message: "", color: "" });
        }, 2000);
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
            const transformedShipment = {
                ...newShipment,
                shipment_items: newShipment.shipment_items.map(item => ({
                    item: item.item_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }))
            };

            await shipmentService.create(transformedShipment);
            setShowNewShipmentForm(false);
            fetchShipments();
            showToast('Shipment created successfully!', 'green');
        } catch (error) {
            console.error('Error creating shipment:', error);
            showToast(error.response?.data?.message || 'Failed to create shipment', 'red');
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
                showToast('Shipment deleted successfully!', 'red');
            } catch (error) {
                console.error('Error deleting shipment:', error);
                showToast('Failed to delete shipment', 'red');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Shipments</h2>

                <button
                    onClick={handleNewShipment}
                    className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ShipmentList 
                    shipments={shipments}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDelete}
                />
            </div>

            {selectedShipment && (
                <ShipmentDetails
                    shipment={selectedShipment}
                    onClose={handleCloseDetails}
                />
            )}

            {toast.message && (
                <div
                    className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 font-semibold text-lg ${
                        toast.color === "red" ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default ShipmentsView; 