const InventoryItemForm = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  setItem,
  isEditing,
  categories,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? "Edit Inventory Item" : "Add Inventory Item"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={item.sku}
              onChange={(e) => setItem({ ...item, sku: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              list="category-suggestions"
              value={item.category}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
              className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
              required
            />
            <datalist id="category-suggestions">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <p className="mt-1 text-xs text-gray-500">
              Choose from suggestions or enter a custom category.
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={item.location}
              onChange={(e) => setItem({ ...item, location: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
              required
            />
          </div>

          {/* Quantity */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  setItem({ ...item, quantity: parseInt(e.target.value) || 0 })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
                min="0"
                required
              />
            </div>

            {/* Minimum Stock */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Minimum Stock
              </label>
              <input
                type="number"
                value={item.minimum_stock}
                onChange={(e) =>
                  setItem({
                    ...item,
                    minimum_stock: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
                min="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200 px-4 py-1.5 text-sm"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md focus:outline-none"
            >
              {isEditing ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryItemForm;
