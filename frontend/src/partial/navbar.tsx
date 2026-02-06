import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

// 1. Define the Props interface based on what Layout is sending
interface NavbarProps {
  userId?: string;
  username?: string;
  logout: () => void;
  email?: string;
  role?: string;
}

export default function Navbar({ userId, username, logout }: NavbarProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Note: We are using the props passed from Layout instead of useContext here
  // This makes the component easier to test and more predictable.
  const isLoggedIn = !!userId;

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

          {isLoggedIn && (
            <NavLink
              to={`/posts/user/${userId}`}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Posts
            </NavLink>
          )}

          {isLoggedIn && (
            <NavLink to="/addpost" className="nav-link writepost">
              Write Post
            </NavLink>
          )}

          {isLoggedIn ? (
            <div className="menu-container">
              <div className="menu" onClick={() => setShowMenu(!showMenu)}>
                {/* Safe access to the first letter of username */}
                {username ? username[0] : "U"}
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

                  <Link to="/about" onClick={() => setShowMenu(false)}>
                    <button>About</button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
