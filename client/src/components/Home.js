// src/components/Home.js

import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="above-container">
        <h1 className="above-container-content">
          <span>Go</span> Translate
        </h1>
      </div>
      <div className="home-buttons">
        <Link to="/api/login" className="button">
          Login
        </Link>
        <Link to="/api/register" className="button">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
