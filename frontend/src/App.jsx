
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

import './styles/App.css'

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
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
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/logout"
          element={
            <Logout />
          }
        />

        <Route 
          path="/register"
          element={
            <RegisterAndLogout />
          }
        />

        <Route
          path="*" 
          element={
            <NotFound />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
