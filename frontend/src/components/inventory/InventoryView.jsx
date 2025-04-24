import { useState } from "react";
import api from "../../services/api";
import InventoryList from "./InventoryList";
import AddInventoryItemButton from "./AddInventoryItemButton";
import InventoryItemForm from "./InventoryItemForm";

function InventoryView() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newItem, setNewItem] = useState({
        name: "",
        sku: "",
        category: "Electronics",
        quantity: 0,
        description: "",
        location: "",
        minimum_stock: 0
    });
    const [toast, setToast] = useState({ message: "", color: "" });

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this inventory item?");
        if (!confirmed) return;

        setInventoryItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Inventory item deleted!", "red");
    };

    const handleEdit = (item) => {
        setNewItem({
            name: item.name,
            sku: item.sku,
            category: item.category,
            quantity: item.quantity,
            description: item.description,
            location: item.location,
            minimum_stock: item.minimum_stock
        });
        setIsEditing(true);
        setEditId(item.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/inventory/', newItem);
            setInventoryItems(prev => [...prev, response.data]);
            setIsModalOpen(false);
            setNewItem({
                name: "",
                sku: "",
                category: "Electronics",
                quantity: 0,
                description: "",
                location: "",
                minimum_stock: 0
            });
            showToast("Inventory item added successfully!", "green");
        } catch (error) {
            console.error('Error adding inventory item:', error);
            showToast(error.response?.data?.message || "Failed to add inventory item", "red");
        }
    };

    const showToast = (message, color = "green") => {
        setToast({ message, color });
        setTimeout(() => {
            setToast({ message: "", color: "" });
        }, 2000);
    };

    return (
        <div>
            <AddInventoryItemButton onClick={() => setIsModalOpen(true)} />
            <InventoryList 
                items={inventoryItems} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {toast.message && (
                <div
                    className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 font-semibold text-lg ${
                        toast.color === "red" ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            <InventoryItemForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setNewItem({
                        name: "",
                        sku: "",
                        category: "Electronics",
                        quantity: 0,
                        description: "",
                        location: "",
                        minimum_stock: 0
                    });
                }}
                onSubmit={handleSubmit}
                item={newItem}
                setItem={setNewItem}
                isEditing={isEditing}
            />
        </div>
    );
};

export default InventoryView; 