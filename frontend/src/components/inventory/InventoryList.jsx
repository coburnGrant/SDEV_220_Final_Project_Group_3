import InventoryItemRow from "./InventoryItemRow";

const InventoryList = ({ items, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Inventory List</h2>

            {items.length === 0 ? (
                <p className="text-gray-600">No inventory items available.</p>
            ) : (
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Name</th>
                            <th className="py-2">Category</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2 text-right">Actions</th>
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