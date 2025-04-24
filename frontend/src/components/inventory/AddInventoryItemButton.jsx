function AddInventoryItemButton({ onClick }) {
    return (
        <div className="mb-6">
            <button
                onClick={onClick}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
                Add Inventory Item
            </button>
        </div>
    );
};

export default AddInventoryItemButton; 