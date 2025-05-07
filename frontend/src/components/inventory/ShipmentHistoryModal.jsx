import { useState, useEffect } from "react";
import { getStatusColor, getTypeColor, formatStatus, formatDate } from "../../utils/statusUtils";
import { shipmentService } from "../../services/shipmentService";
import InventoryHistoryChart from "./InventoryHistoryChart";

function ShipmentHistoryModal({ item, onClose }) {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShipmentHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await shipmentService.getItemHistory(item.id);
            setShipments(data);
        } catch (err) {
            setError(err.error || "Failed to load shipment history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipmentHistory();
    }, [item.id]);

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col shadow-2xl">
                {/* Fixed Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                            Shipment History - {item.name}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="text-red-600 text-center py-4">{error}</div>
                    ) : (
                        <>
                            {/* Inventory History Chart */}
                            <div className="mb-6">
                                <InventoryHistoryChart itemId={item.id} />
                            </div>

                            {shipments.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 mb-2">No shipment history found</div>
                                    <div className="text-sm text-gray-400">
                                        This item has not been included in any shipments yet.
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left">Date</th>
                                                <th className="px-4 py-2 text-left">Type</th>
                                                <th className="px-4 py-2 text-left">Status</th>
                                                <th className="px-4 py-2 text-left">Tracking</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Unit Price</th>
                                                <th className="px-4 py-2 text-left">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shipments.map((shipment) => {
                                                const shipmentItem = shipment.shipment_items.find(
                                                    (si) => si.item === item.id
                                                );
                                                const total = shipmentItem ? (shipmentItem.quantity * parseFloat(shipmentItem.unit_price)).toFixed(2) : 0;
                                                
                                                return (
                                                    <tr key={shipment.id} className="border-b">
                                                        <td className="px-4 py-2">
                                                            {formatDate(shipment.created_at)}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-sm ${getTypeColor(
                                                                    shipment.type
                                                                )}`}
                                                            >
                                                                {shipment.type === "IN"
                                                                    ? "Incoming"
                                                                    : "Outgoing"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                                                                    shipment.status
                                                                )}`}
                                                            >
                                                                {formatStatus(shipment.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {shipment.tracking_number}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {shipmentItem?.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            ${shipmentItem?.unit_price || '0.00'}
                                                        </td>
                                                        <td className="px-4 py-2 font-medium">
                                                            ${total}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShipmentHistoryModal; 