import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

function getUserFromToken() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUserFromToken);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser(jwtDecode(token)); // ✅ THIS fixes refresh issue
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
