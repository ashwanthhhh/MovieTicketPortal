import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 40px",
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-primary)",
      borderBottom: "1px solid var(--bg-input)",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <h2
          onClick={() => navigate("/dashboard")}
          style={{
            color: "var(--accent-primary)",
            cursor: "pointer",
            margin: 0,
            fontSize: "1.6rem",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(245, 57, 102, 0.5)"
          }}
        >
          🎬 CineVerse
        </h2>
        <div style={{ display: "flex", gap: "20px", marginLeft: "20px" }}>
          <Link to="/dashboard" style={navLink}>Home</Link>
          <Link to="/movies" style={navLink}>Movies</Link>
          <Link to="/stream" style={navLink}>Stream</Link>
          {user && user.isAdmin && <Link to="/admin" style={{ ...navLink, color: "var(--accent-secondary)" }}>Admin</Link>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {user
          ? <>
            <div style={{ textAlign: "right", marginRight: "10px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{user.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Premium Member</div>
            </div>
            <Link to="/profile" style={{
              textDecoration: "none",
              background: "var(--bg-input)",
              padding: "8px 18px",
              borderRadius: "20px",
              color: "white",
              fontSize: "0.9rem",
              border: "1px solid #444"
            }}>My Profile</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500"
              }}
            >
              Logout
            </button>
          </>
          : <Link to="/" style={{
            textDecoration: "none",
            background: "var(--accent-primary)",
            padding: "8px 25px",
            borderRadius: "20px",
            color: "white",
            fontWeight: "bold"
          }}>Login</Link>
        }
      </div>
    </nav>
  );
};

const navLink = {
  color: "var(--text-primary)",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "color 0.2s"
};

export default Navbar;
