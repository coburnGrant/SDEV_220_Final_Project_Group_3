import InventoryItemRow from "./InventoryItemRow";

const InventoryList = ({ items, onEdit, onDelete }) => {
    
    return (
        <div className="overflow-x-auto">
            {items.length === 0 ? (
                <p className="text-gray-600">No inventory items available.</p>
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
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InventoryList; 