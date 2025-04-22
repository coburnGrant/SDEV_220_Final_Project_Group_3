import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "Electronics",
        quantity: 0,
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ message: "", color: "" });

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                console.log("Current token:", token);

                const response = await api.get("/api/user/me/");
                console.log("Response:", response.data);
                setUser(response.data);
                // Store user for Navbar to read
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error("Error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        setProducts((prev) => prev.filter((product) => product.id !== id));
        showToast("Product Deleted!", "red");
    };

    const showToast = (message, color = "green") => {
        setToast({ message, color });
        setTimeout(() => {
            setToast({ message: "", color: "" });
        }, 2000); //  2 seconds
    };




    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-blue-800">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-100">
                <p className="text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Navbar username={user?.username} />

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Top bar */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Welcome, <span className="text-blue-900">{user.username}</span>
                    </h1>

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="text-sm bg-blue-100 text-blue-900 px-4 py-2 rounded hover:bg-blue-200"
                    >
                        Admin Area
                    </button>
                </div>

                {/* Add Product Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
                    >
                        ➕ Add Product
                    </button>
                </div>

                {/* Product List */}
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Product List</h2>

                    {products.length === 0 ? (
                        <p className="text-gray-600">No products available.</p>
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
                            {products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">{product.category}</td>
                                    <td className="py-2">{product.quantity}</td>
                                    <td className="py-2 text-right">
                                        <div className="flex justify-end gap-4 items-center">
                                            <button
                                                onClick={() => {
                                                    setNewProduct({
                                                        name: product.name,
                                                        category: product.category,
                                                        quantity: product.quantity,
                                                        description: product.description,
                                                    });
                                                    setIsEditing(true);
                                                    setEditId(product.id);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                title="Edit"
                                            >
                                                <Pencil size={20} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product.id)}
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
            </main>

            {toast.message && (
                <div
                    className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 font-semibold text-lg ${
                        toast.color === "red" ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}


            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                const tempProduct = {
                                    ...newProduct,
                                    id: isEditing ? editId : Date.now()
                                };

                                if (isEditing) {
                                    setProducts((prev) =>
                                        prev.map((p) => (p.id === editId ? tempProduct : p))
                                    );
                                } else {
                                    setProducts((prev) => [...prev, tempProduct]);
                                }

                                setIsModalOpen(false);
                                setIsEditing(false);
                                setEditId(null);
                                setNewProduct({
                                    name: "",
                                    category: "Electronics",
                                    quantity: 0,
                                    description: ""
                                });

                                showToast(isEditing ? "Product Updated!" : "Product Added!", "green");
                            }}

                            className="space-y-4"
                        >
                            <input
                                type="text"
                                required
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />

                            <select
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Other">Other</option>
                            </select>

                            <input
                                type="number"
                                required
                                placeholder="Quantity"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />

                            <textarea
                                placeholder="Description (optional)"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            ></textarea>

                            <div className="flex justify-end gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>

    );
}
export default Home;