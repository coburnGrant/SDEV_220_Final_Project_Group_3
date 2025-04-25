import { Pencil, Trash } from "lucide-react";

function InventoryItemRow({ item, onEdit, onDelete }) {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-4">{item.name}</td>
            <td className="py-3 px-4">{item.category}</td>
            <td className="py-3 px-4">{item.quantity}</td>
            <td className="py-3 px-4 text-right">
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
    );
}

export default InventoryItemRow; 