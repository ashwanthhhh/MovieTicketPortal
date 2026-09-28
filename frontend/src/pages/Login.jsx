import React, { useState, useContext } from "react";
import axios from "axios";
import { USERS_URL } from "../api/config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter Email & Password");
      return;
    }

    try {
      const response = await axios.post(
        `${USERS_URL}/login`,
        { email, password }
      );

      // Store user data and token
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);

      alert(`Login Success As ${role.toUpperCase()} ✅`);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert("Invalid Login / Register First");
    }
  };

  return (

    <div style={{
      height: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        background: "var(--bg-secondary)",
        padding: "60px",
        borderRadius: "24px",
        width: "500px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        <h1 style={{
          color: "var(--accent-primary)",
          textAlign: "center",
          textShadow: "0 0 15px rgba(245, 57, 102, 0.6)",
          fontSize: "32px",
          marginBottom: "20px"
        }}>
          🎬 CineVerse
        </h1>

        <div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "25px", justifyContent: "center" }}>
          <label style={{ color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
            <input type="radio" value="user" checked={role === "user"} onChange={() => setRole("user")} style={{ accentColor: "var(--accent-primary)", transform: "scale(1.2)" }} /> User
          </label>
          <label style={{ color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
            <input type="radio" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} style={{ accentColor: "var(--accent-primary)", transform: "scale(1.2)" }} /> Admin
          </label>
        </div>

        <input
          placeholder="Email"
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "20px", fontSize: "16px" }}>
          New User ?
          <span
            style={{ color: "var(--accent-primary)", cursor: "pointer", fontWeight: "bold", marginLeft: "8px" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div >

  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "20px",
  background: "var(--bg-input)",
  border: "1px solid #444",
  color: "white",
  outline: "none",
  textAlign: "center",
  fontSize: "16px"
};

const btnStyle = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "25px",
  background: "var(--accent-primary)",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "10px",
  marginBottom: "25px",
  boxShadow: "0 0 20px rgba(245, 57, 102, 0.5)",
  transition: "transform 0.2s"
};

export default Login;
