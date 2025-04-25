import { Trash, Eye } from "lucide-react";

const ShipmentRow = ({ shipment, onViewDetails, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'IN_TRANSIT':
                return 'bg-blue-100 text-blue-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        return type === 'IN' ? 'Incoming' : 'Outgoing';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                    shipment.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {getTypeLabel(shipment.type)}
                </span>
            </td>
            <td className="py-3 px-4">{shipment.tracking_number}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                </span>
            </td>
            <td className="py-3 px-4">{shipment.carrier}</td>
            <td className="py-3 px-4">
                {formatDate(shipment.estimated_arrival)}
            </td>
            <td className="py-3 px-4">{shipment.shipment_items?.length || 0} items</td>
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
    );
};

export default ShipmentRow; 