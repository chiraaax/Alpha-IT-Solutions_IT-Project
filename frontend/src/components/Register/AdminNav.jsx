import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom"; 

function UserNav() {
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "#fff", position: "relative" }}>
            <h2>Admin Dashboard</h2>
            <Link to="/FAQManage">FAQ Management</Link>
            <div>
                {user ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                        {/* User Name Clickable */}
                        <span 
                            onClick={() => setDropdownOpen(!dropdownOpen)} 
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                            Welcome, {user.name} 
                        </span>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div 
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    background: "#444",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                                    width: "150px",
                                    textAlign: "left",
                                    padding: "5px 0",
                                    zIndex: 1000
                                }}
                            >
                                <Link 
                                    to="" 
                                    style={{ display: "block", padding: "10px", color: "white", textDecoration: "none" }}
                                >
                                    My Profile
                                </Link>
                                <button 
                                    onClick={logout} 
                                    style={{ 
                                        width: "100%", 
                                        padding: "10px", 
                                        background: "transparent", 
                                        border: "none", 
                                        color: "white", 
                                        cursor: "pointer", 
                                        textAlign: "left"
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href="/" style={{ color: "white" }}>Login</a>
                )}
            </div>
        </nav>
    );
}

export default UserNav;
