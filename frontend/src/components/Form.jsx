import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, FORM_METHOD_LOGIN, FORM_METHOD_REGISTER } from "../constants";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (
      method === FORM_METHOD_REGISTER &&
      (!username || !password || !firstName || !lastName || !email)
    ) {
      alert("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting:", { username, password });

      let payload = { username, password };

      if (method === "register") {
        payload = {
          ...payload,
          first_name: firstName,
          last_name: lastName,
          email,
        };
      }

      const response = await api.post(route, payload);

      if (method == FORM_METHOD_LOGIN) {
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
          navigate("/");
      } else if (method == FORM_METHOD_REGISTER) {
          navigate("/login")
      } else {
          throw new Error("Invalid form method");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = method === "login" ? "Login" : "Register";
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

        {method === "register" && (
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

        {method === "login" ? (
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
