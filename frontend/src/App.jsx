import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

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
