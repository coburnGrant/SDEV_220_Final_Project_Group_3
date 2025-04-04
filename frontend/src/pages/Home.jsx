import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                console.log("Current token:", token);
                
                const response = await api.get("/api/user/me/");
                console.log("Response:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Home</h1>
            {user && <h2>Hello, {user.username}!</h2>}
        </div>
    );
}

export default Home;