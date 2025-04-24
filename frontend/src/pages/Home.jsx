import { useState, useEffect } from "react";
import api from "../services/api";
import { ACCESS_TOKEN } from "../constants";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import InventoryView from "../components/inventory/InventoryView";

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                console.log("Current token:", token);

                const response = await api.get("/api/users/me/");
                console.log("Response:", response.data);
                setUser(response.data);
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
            <Navbar username={user?.username} firstName={user?.first_name} lastName={user?.last_name} />

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Top bar */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Welcome, <span className="text-blue-900">{user.username}</span>
                    </h1>

                    {user.is_staff && (
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="text-sm bg-blue-100 text-blue-900 px-4 py-2 rounded hover:bg-blue-200"
                        >
                            Admin Panel
                        </button>
                    )}
                </div>

                <InventoryView />
            </main>
        </div>
    );
}

export default Home;