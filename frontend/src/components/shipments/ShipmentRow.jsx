import { Trash, Eye, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getStatusColor, getTypeColor, formatStatus, formatDate } from "../../utils/statusUtils";

const ShipmentRow = ({ shipment, onViewDetails, onDelete, onStatusChange, onStatsRefresh }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState(null);

  const getTypeLabel = (type) => {
    return type === "IN" ? "Incoming" : "Outgoing";
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
      // Refresh inventory stats after status change
      await onStatsRefresh();
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
            className={`px-2 py-1 rounded-full text-sm ${getTypeColor(shipment.type)}`}
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
              {formatStatus(shipment.status)}
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the status to {formatStatus(selectedStatus)}?
            </p>
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
