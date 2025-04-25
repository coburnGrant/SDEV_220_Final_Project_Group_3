const InventoryItemForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    item, 
    setItem, 
    isEditing,
    categories 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
                <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => setItem({ ...item, sku: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                list="category-suggestions"
                                value={item.category}
                                onChange={(e) => setItem({ ...item, category: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                                required
                            />
                            <datalist id="category-suggestions">
                                {categories.map((category) => (
                                    <option key={category} value={category} />
                                ))}
                            </datalist>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Choose from suggestions or enter a custom category
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={item.location}
                            onChange={(e) => setItem({ ...item, location: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => setItem({ ...item, quantity: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                        <input
                            type="number"
                            value={item.minimum_stock}
                            onChange={(e) => setItem({ ...item, minimum_stock: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={item.description}
                            onChange={(e) => setItem({ ...item, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                            rows="3"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
                        >
                            {isEditing ? 'Update' : 'Add'} Inventory Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryItemForm; 