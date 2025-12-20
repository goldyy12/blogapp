import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/auth/register", {
                email, password, username,
            });
            localStorage.setItem("token", res.data.token);
            alert("Register success");
            navigate("/");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "300px", margin: "auto", marginTop: "70px" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
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