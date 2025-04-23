import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const alertShown = useRef(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const isAdmin = currentUser?.is_staff;

    if (!isAdmin) {
      if (!alertShown.current) {
        alert("Access denied: You don't have admin rights to view this page.");
        alertShown.current = true; // Prevent future alerts
        navigate("/");
      }
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/");
        console.log("Users fetched:", response.data);
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means it only runs once on mount

  const handleDelete = async (userId) => {
    console.log("Deleting user:", userId);

    console.log("Deleting of users not set up yet!");
    // try {
    //   await api.delete(`/api/admin/users/${userId}/`);
    //   setUsers((prev) => prev.filter((user) => user.id !== userId));
    // } catch (error) {
    //   console.error("Delete failed:", error);
    // }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen ">
      <Navbar username={currentUser?.username} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button onClick={() => navigate("/")} className="text-sm bg-blue-100 text-blue-900 px-4 py-2 rounded hover:bg-blue-200">
              Back to Home
            </button>
            <a 
              href={`${API_URL}/admin`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm bg-green-100 text-green-900 px-4 py-2 rounded hover:bg-green-200"
            >
              Django Admin Panel
            </a>
          </div>
        </div>

        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">
              Registered Users
            </h1>
            <div className="max-w-6xl mx-auto bg-white shadow rounded overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Username</th>
                    <th className="px-6 py-3 font-medium">First Name</th>
                    <th className="px-6 py-3 font-medium">Last Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{user.username}</td>
                      <td className="px-6 py-3">{user.first_name}</td>
                      <td className="px-6 py-3">{user.last_name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        {user.is_staff ? "Admin" : "Staff"}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} className="cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </main>
    </div>
  );
};

export default AdminUsers;
