import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

import './styles/index.css'

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function AppRoutes() {
    const location = useLocation();
    const isAuth = !!localStorage.getItem("access_token");

    const hideNavbar = ["/login", "/register"].includes(location.pathname);

    return (
        <>
            {!hideNavbar && isAuth && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

function App() {

  return (
    <BrowserRouter>
       <AppRoutes />
    </BrowserRouter>
  )
}

export default App
