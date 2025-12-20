import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <Navbar
                userId={user?.userId}
                username={user?.username?.toUpperCase()}
                logout={logout}
                email={user?.email}
                role={user?.role}
            />

            <Outlet />
        </>
    );
}
