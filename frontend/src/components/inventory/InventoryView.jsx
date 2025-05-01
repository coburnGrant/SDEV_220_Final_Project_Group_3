import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import InventoryList from "./InventoryList";
import AddInventoryItemButton from "./AddInventoryItemButton";
import InventoryItemForm from "./InventoryItemForm";

function InventoryView() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    description: "",
    location: "",
    minimum_stock: 0,
  });

  // Fetch categories when component mounts
  const fetchCategories = async () => {
    try {
      const categories = await inventoryService.getCategories();
      setCategories(categories);
      // Set default category if available
      if (categories.length > 0) {
        setNewItem((prev) => ({ ...prev, category: categories[0] }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    }
  };

  // Fetch inventory items when component mounts
  const fetchInventoryItems = async () => {
    try {
      const items = await inventoryService.getAll();
      setInventoryItems(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      alert("Failed to load inventory items");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?",
    );
    if (!confirmed) return;

    try {
      await inventoryService.delete(id);
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
      alert("Inventory item deleted!");
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("Failed to delete inventory item");
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      description: item.description,
      location: item.location,
      minimum_stock: item.minimum_stock,
    });
    setIsEditing(true);
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing) {
        response = await inventoryService.update(editId, newItem);
        setInventoryItems((prev) =>
          prev.map((item) => (item.id === editId ? response : item)),
        );
      } else {
        response = await inventoryService.create(newItem);
        setInventoryItems((prev) => [...prev, response]);
      }

      setIsModalOpen(false);
      setNewItem({
        name: "",
        sku: "",
        category: categories[0] || "",
        quantity: 0,
        description: "",
        location: "",
        minimum_stock: 0,
      });
      alert(`Inventory item ${isEditing ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} inventory item:`,
        error,
      );
      alert(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} inventory item`,
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchInventoryItems();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Inventory</h2>
        <AddInventoryItemButton onClick={() => setIsModalOpen(true)} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <InventoryList
          items={inventoryItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <InventoryItemForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewItem({
            name: "",
            sku: "",
            category: categories[0] || "",
            quantity: 0,
            description: "",
            location: "",
            minimum_stock: 0,
          });
        }}
        onSubmit={handleSubmit}
        item={newItem}
        setItem={setNewItem}
        isEditing={isEditing}
        categories={categories}
      />
    </div>
  );
}

export default InventoryView;
