import { Plus } from "lucide-react";

function AddInventoryItemButton({ onClick }) {
    return (
        <div className="mb-6">
            <button
                onClick={onClick}
                className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
                <Plus size={20} />
                Add Inventory Item
            </button>
        </div>
    );
};

export default AddInventoryItemButton; 