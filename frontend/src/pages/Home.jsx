import { useState, useEffect } from "react";
import { TabType, TabLabel } from "../constants/tabs";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import InventoryView from "../components/inventory/InventoryView";
import ShipmentsView from "../components/shipments/ShipmentsView";
import DashboardView from "../components/dashboard/DashboardView";
import { userService } from "../services/userService";
import { inventoryService } from "../services/inventoryService";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TabType.DASHBOARD);

  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const userData = await userService.getCurrent();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
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
  };

  useEffect(() => {
    (async () => {
      await getUser();
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
      <Navbar
        username={user?.username}
        firstName={user?.first_name}
        lastName={user?.last_name}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab(TabType.DASHBOARD)}
              className={`${
                activeTab === TabType.DASHBOARD
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {TabLabel[TabType.DASHBOARD]}
            </button>
            <button
              onClick={() => setActiveTab(TabType.INVENTORY)}
              className={`${
                activeTab === TabType.INVENTORY
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {TabLabel[TabType.INVENTORY]}
            </button>
            <button
              onClick={() => setActiveTab(TabType.SHIPMENTS)}
              className={`${
                activeTab === TabType.SHIPMENTS
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {TabLabel[TabType.SHIPMENTS]}
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === TabType.DASHBOARD && <DashboardView />}
        {activeTab === TabType.INVENTORY && <InventoryView />}
        {activeTab === TabType.SHIPMENTS && <ShipmentsView />}
      </main>
    </div>
  );
};

export default Home;
