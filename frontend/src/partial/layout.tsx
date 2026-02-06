import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import useAuth from "../context/UseAuth";

export default function Layout() {
  // Using your custom hook provides automatic type safety for 'user' and 'logout'
  const { user, logout } = useAuth();

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
