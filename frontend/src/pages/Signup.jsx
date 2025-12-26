import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // use Axios instance

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/register", {
                email,
                password,
                username,
            });

            // Save token and update user state for auto-login
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);

            navigate("/posts"); // redirect to posts after signup
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "300px", margin: "0 auto", marginTop: "70px" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                <div style={{ marginTop: "10px" }}>
                    <Link to="/login">
                        <button type="button">Go to Login</button>
                    </Link>
                </div>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
