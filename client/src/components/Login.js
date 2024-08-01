// src/components/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("https://lai24a-k6.tekomits.my.id/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setMessage("Login successful");
        navigate("/api/translate");
      } else {
        setMessage("Login failed: Invalid credentials");
      }
    } catch (error) {
      setMessage("Login failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>{message}</p>
      </form>
      <p className="link-paragraph">
        Don't have an account?{" "}
        <Link to="/api/register" className="link">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
