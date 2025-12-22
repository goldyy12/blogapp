import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import "../styles/navbar.css";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="navbar">
            <div className="navbar-content">
                <Link to="/posts" className="logo">
                    <h3>Blog App</h3>
                </Link>

                <div className="nav-links">
                    <NavLink
                        to="/posts"
                        end
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        About
                    </NavLink>

                    {user && (
                        <NavLink
                            to={`/posts/user/${user.userId}`}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            My Posts
                        </NavLink>
                    )}



                    {user && (
                        <NavLink
                            to="/addpost"
                            className="nav-link writepost"
                        >
                            Write Post
                        </NavLink>
                    )}

                    {user ? (
                        <div className="menu-container">
                            <div
                                className="menu"
                                onClick={() => setShowMenu(!showMenu)}
                            >
                                {user.username[0].toUpperCase()}
                            </div>

                            {showMenu && (
                                <div className="menu-dropdown">
                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowMenu(false);
                                        }}
                                    >
                                        Logout
                                    </button>

                                    <Link to="/about">
                                        <button>About</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/signup">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
