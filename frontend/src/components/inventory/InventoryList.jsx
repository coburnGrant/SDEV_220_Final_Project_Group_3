import { Pencil, Trash } from "lucide-react";

function InventoryList({ items, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Inventory</h2>

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
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2">{item.category}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2 text-right">
                                    <div className="flex justify-end gap-4 items-center">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                            title="Edit"
                                        >
                                            <Pencil size={20} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="text-red-600 hover:text-red-800 cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InventoryList; 