import React, { useState } from "react";
import axios from "axios";
import { USERS_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    if (!name || !email || !mobile || !password) {
      alert("Fill all fields");
      return;
    }

    try {

      const response = await axios.post(
        `${USERS_URL}/register`,
        { name, email, mobile, password }
      );

      alert("Register Success ✅ Please Login");
      navigate("/");

    } catch {
      alert("Register Failed");
    }

  };

  return (

    <div style={container}>

      <div style={card}>

        <h1 style={title}>🎬 CineVerse</h1>

        <input
          placeholder="Full Name"
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          style={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Mobile Number"
          style={input}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} style={button}>
          Register
        </button>

        <p style={text}>
          Already User ?
          <span style={link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </div>

    </div>

  );
}

export default Register;

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "var(--bg-primary)"
};

const card = {
  width: "500px",
  padding: "60px",
  borderRadius: "24px",
  background: "var(--bg-secondary)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 10px 40px rgba(0,0,0,0.6)"
};

const title = {
  color: "var(--accent-primary)",
  marginBottom: "40px",
  textShadow: "0 0 15px rgba(245, 57, 102, 0.6)",
  fontSize: "32px"
};

const input = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #444",
  background: "var(--bg-input)",
  color: "white",
  marginBottom: "20px",
  outline: "none",
  textAlign: "center",
  fontSize: "16px"
};

const button = {
  width: "100%",
  padding: "16px",
  borderRadius: "25px",
  border: "none",
  background: "var(--accent-primary)",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer",
  marginTop: "10px",
  boxShadow: "0 0 20px rgba(245, 57, 102, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const text = {
  marginTop: "20px",
  color: "var(--text-secondary)",
  fontSize: "16px"
};

const link = {
  color: "var(--accent-primary)",
  marginLeft: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};
