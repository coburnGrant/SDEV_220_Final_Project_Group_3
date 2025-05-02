import { Trash, Eye, ChevronDown } from "lucide-react";
import { useState } from "react";

const ShipmentRow = ({ shipment, onViewDetails, onDelete, onStatusChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type) => {
    return type === "IN" ? "Incoming" : "Outgoing";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusWarning = (status) => {
    switch (status) {
      case "IN_TRANSIT":
        return "This will mark the shipment as in transit. This action cannot be undone.";
      case "DELIVERED":
        return "This will mark the shipment as delivered and update inventory. This action cannot be undone.";
      case "CANCELLED":
        return "This will cancel the shipment. This action cannot be undone.";
      default:
        return "Are you sure you want to change the status?";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setError(null);
      setSelectedStatus(newStatus);
      setShowConfirm(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const confirmStatusChange = async () => {
    try {
      setError(null);
      await onStatusChange(shipment.id, selectedStatus);
      setShowConfirm(false);
      setSelectedStatus(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
      setShowConfirm(false);
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="py-3 px-4">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              shipment.type === "IN"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {getTypeLabel(shipment.type)}
          </span>
        </td>
        <td className="py-3 px-4">{shipment.tracking_number}</td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-sm ${getStatusColor(shipment.status)}`}
            >
              {shipment.status.replace("_", " ")}
            </span>
            {(shipment.status === "PENDING" || shipment.status === "IN_TRANSIT") && (
              <div className="relative inline-block text-left">
                <select
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shipment.status}
                >
                  <option value={shipment.status}>Update Status</option>
                  {shipment.status === "PENDING" && (
                    <>
                      <option value="IN_TRANSIT">Mark as In Transit</option>
                      <option value="DELIVERED">Mark as Delivered</option>
                      <option value="CANCELLED">Mark as Cancelled</option>
                    </>
                  )}
                  {shipment.status === "IN_TRANSIT" && (
                    <option value="DELIVERED">Mark as Delivered</option>
                  )}
                </select>
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-600 text-xs mt-1">
              {error}
            </div>
          )}
        </td>
        <td className="py-3 px-4">{shipment.carrier}</td>
        <td className="py-3 px-4">{formatDate(shipment.estimated_arrival)}</td>
        <td className="py-3 px-4">
          {shipment.shipment_items?.length || 0} items
        </td>
        <td className="py-3 px-4 text-right space-x-2">
          <button
            onClick={() => onViewDetails(shipment)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => onDelete(shipment.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash size={20} />
          </button>
        </td>
      </tr>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="text-gray-600 mb-6">{getStatusWarning(selectedStatus)}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentRow;
