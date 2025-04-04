import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, { username, password });

            if (method == "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/");
            } else if (method == "register") {
                navigate("/login")
            } else {
                throw new Error("Invalid form method");
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false);
        }
    }

    const formTitle = method == "login" ? "Login" : "Register";
    const buttonText = loading ? "Loading..." : formTitle;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h1>{formTitle}</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button
                type="submit"
                disabled={loading}
            >
                {buttonText}
            </button>
        </form>
    )
}

export default Form;