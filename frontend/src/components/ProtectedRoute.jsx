import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        authenticate().catch(() => setIsAuthenticated(false));
    }, []);

    const refreshApi = async (refreshToken) => {
        const response = await api.post("/api/token/refresh/", {
            refresh: refreshToken,
        });

        if (response.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            return true;
        } else {
            return false;
        }
    }

    const attemptToRefreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try { 
            const didRefresh = await refreshApi(refreshToken);

            setIsAuthenticated(didRefresh);
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
        }
    }

    const checkToken = async (token) => {
        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await attemptToRefreshToken()
        } else {
            setIsAuthenticated(true);
        }
    }

    const authenticate = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            checkToken(token);
        } else {
            setIsAuthenticated(false);
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;