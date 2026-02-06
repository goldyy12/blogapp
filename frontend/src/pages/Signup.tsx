import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import useAuth from "../context/UseAuth";
import { User } from "../types";

// Define the response shape for registration
interface AuthResponse {
  token: string;
  user: User;
}

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // 1. Use your custom hook instead of raw useContext
  // This ensures setUser is never undefined
  const { setUser } = useAuth();

  // 2. FormEvent is generally preferred for form submissions
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 3. Type the API response so TS knows what's in res.data
      const res = await api.post<AuthResponse>("/auth/register", {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      navigate("/posts");
    } catch (err: any) {
      // 4. Handle the error type (axios errors have a response object)
      console.error(err);
      const errorMessage = err.response?.data?.error || "Register failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto", marginTop: "70px" }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          // 5. ChangeEvent is inferred here, but you can be explicit
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
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
