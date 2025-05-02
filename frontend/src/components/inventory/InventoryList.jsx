import { useState } from "react";
import InventoryItemRow from "./InventoryItemRow";
import ShipmentHistoryModal from "./ShipmentHistoryModal";

function InventoryList({ items, onEdit, onDelete }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleViewHistory = (item) => {
        setSelectedItem(item);
    };

    const handleCloseHistory = () => {
        setSelectedItem(null);
    };

    return (
        <div className="overflow-x-auto">
            {items.length === 0 ? (
                <p className="text-gray-600 p-4">No inventory items available.</p>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-600">Category</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-600">Quantity</th>
                            <th className="py-3 px-4 text-right font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <InventoryItemRow
                                key={item.id}
                                item={item}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewHistory={handleViewHistory}
                            />
                        ))}
                    </tbody>
                </table>
            )}

            {selectedItem && (
                <ShipmentHistoryModal
                    item={selectedItem}
                    onClose={handleCloseHistory}
                />
            )}
        </div>
    );
}

export default InventoryList; 