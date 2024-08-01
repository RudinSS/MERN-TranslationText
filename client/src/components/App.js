// src/components/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import "../styles/App.css";
import Translate from "./Translate";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import History from "./History";
import Profile from "./profile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // Redirect to login page
    window.location.href = "/";
  };
  return (
    <Router>
      <div>
        <nav>
          <ul className="nav-links">
            {token && (
              <>
                <li>
                  <Link to="/api/translate">Translate</Link>
                </li>
                <li>
                  <Link to="/api/history">History</Link>
                </li>
                <li>
                  <Link to="/api/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/api/logout" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            )}
            {!token && <></>}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/api/register" element={<Register />} />
          <Route path="/api/login" element={<Login setToken={setToken} />} />
          <Route path="/api/translate" element={<ProtectedRoute token={token} component={Translate} />} />
          <Route path="/api/history" element={<ProtectedRoute token={token} component={History} />} />
          <Route path="/api/logout" element={<Logout />} />
          <Route path="/api/profile" element={<ProtectedRoute token={token} component={Profile} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
