import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  FORM_METHOD_LOGIN,
  FORM_METHOD_REGISTER,
} from "../constants/constants";
import {
  validateRegisterForm,
  validateLoginForm,
} from "../utils/FormValidator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isRegister = method === FORM_METHOD_REGISTER;
  const isLogin = method === FORM_METHOD_LOGIN;

  // Validates the form
  const validateForm = () => {
    if (isRegister) {
      validateRegisterForm(username, password, firstName, lastName, email);
    } else if (isLogin) {
      validateLoginForm(username, password);
    } else {
      throw new Error("Invalid form method");
    }
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateForm();

      const payload = isRegister
        ? {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            email,
          }
        : { username, password };

      const response = await api.post(route, payload);

      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isLogin ? "Login" : "Register";
  const buttonText = loading ? "Loading..." : formTitle;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-blue-900">
          {formTitle}
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
        />

        {isRegister && (
          <>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
        >
          {buttonText}
        </button>

        {isLogin ? (
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-700 hover:underline cursor-pointer font-medium"
            >
              Register
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-700 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default Form;
