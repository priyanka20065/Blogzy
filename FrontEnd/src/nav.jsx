import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "./themeContext";
import "./nav.css";

function Navbar() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <nav className="Navbar-full">
                <div className="Navbar-name">
                    <Link to="/">Blogzy</Link>
                </div>

                <div className="Navbar-ele">
                    <NavLink to="/" end>
                        Home
                    </NavLink>

                    <div className="dropdown">
                        <button className="dropdown-btn">Blogs ▾</button>
                        <div className="dropdown-content">
                            <NavLink to="/blogs">All Blogs</NavLink>
                            <NavLink to="/blogs/political">Political</NavLink>
                            <NavLink to="/blogs/sports">Sports</NavLink>
                            <NavLink to="/blogs/art">Art</NavLink>
                        </div>
                    </div>

                    <NavLink to="/authors">Authors</NavLink>
                    <NavLink to="/contact">Get in Touch</NavLink>

                    {user && (
                        <div className="profile-menu">
                            <div
                                className="profile-avatar"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {user.image ? (
                                    <img src={user.image} alt="Profile" />
                                ) : (
                                    <div className="profile-initials">
                                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {user.role === "author" && (
                                    <div className="status-badge author-badge" title="Verified Author">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                )}
                                {user.isPremium && user.role !== "author" && (
                                    <div className="status-badge premium-badge" title="Premium Member">
                                        <i className="fas fa-crown"></i>
                                    </div>
                                )}
                            </div>

                            {showDropdown && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-header">
                                        <p className="user-name">{user.name || "User"}</p>
                                        <p className="user-email">{user.email}</p>
                                    </div>
                                    <hr />
                                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        <i className="fas fa-user"></i> My Profile
                                    </Link>

                                    {(user.isPremium || user.role === "author") && (
                                        <div className="dropdown-item theme-switch-item">
                                            <div className="theme-info">
                                                <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
                                                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                                            </div>
                                            <label className="theme-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={theme === "dark"}
                                                    onChange={toggleTheme}
                                                />
                                                <span className="theme-slider round"></span>
                                            </label>
                                        </div>
                                    )}

                                    {(user.isPremium || user.role === "author") && (
                                        <Link to="/bookmarks" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <i className="fas fa-bookmark"></i> Bookmarks
                                        </Link>
                                    )}
                                    <hr />
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <hr />
        </>
    );
}

export default Navbar;