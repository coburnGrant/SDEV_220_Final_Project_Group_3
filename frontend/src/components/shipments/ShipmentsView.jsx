import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { shipmentService } from "../../services/shipmentService";
import ShipmentForm from "./ShipmentForm";
import ShipmentList from "./ShipmentList";
import ShipmentDetails from "./ShipmentDetails";

const ShipmentsView = ({ onStatsRefresh }) => {
  const [shipments, setShipments] = useState([]);
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newShipment, setNewShipment] = useState({
    type: "IN",
    status: "PENDING",
    carrier: "",
    tracking_number: "",
    estimated_arrival: "",
    items: [],
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const data = await shipmentService.getAll();
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      alert("Failed to load shipments");
    }
  };

  const handleNewShipment = () => {
    // Set default date to 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const formattedDate = defaultDate.toISOString().split('T')[0];

    setNewShipment({
      type: "IN",
      status: "PENDING",
      carrier: "",
      tracking_number: "",
      estimated_arrival: formattedDate,
      shipment_items: [],
    });
    setShowNewShipmentForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedShipment = {
        ...newShipment,
        carrier: newShipment.carrier === "Other" ? newShipment.custom_carrier : newShipment.carrier,
        tracking_number: newShipment.tracking_number,
        shipment_items: newShipment.shipment_items.map((item) => ({
          item: item.item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };
      
      await shipmentService.create(transformedShipment);
      setShowNewShipmentForm(false);
      fetchShipments();
      await onStatsRefresh();
      alert("Shipment created successfully!");
    } catch (error) {
      console.error("Error creating shipment:", error);
      // Extract the error message from the response
      const errorMessage = error.response?.data?.tracking_number?.[0] || 
                          error.response?.data?.message || 
                          "Failed to create shipment";
      alert(errorMessage);
    }
  };

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleCloseDetails = () => {
    setSelectedShipment(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      try {
        await shipmentService.delete(id);
        fetchShipments();
        await onStatsRefresh();
        alert("Shipment deleted successfully!");
      } catch (error) {
        console.error("Error deleting shipment:", error);
        alert("Failed to delete shipment");
      }
    }
  };

  const handleStatusChange = async (shipmentId, newStatus) => {
    try {
      const updatedShipment = await shipmentService.updateStatus(
        shipmentId,
        newStatus,
      );

      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? updatedShipment : s)),
      );

      alert("Shipment status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update shipment status");
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
          onStatusChange={handleStatusChange}
          onStatsRefresh={onStatsRefresh}
        />
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
