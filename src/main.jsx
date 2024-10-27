import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Verify from "./Verify.jsx";
import Home from "./Home.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/signup" element={<Register />} /> {/* Signup Page */}
        <Route path="/signup/verified" element={<Verify />} />
        {/* Verified Page */}
        <Route path="/home" element={<Home />} /> {/* Home Page */}
      </Routes>
    </Router>
  </React.StrictMode>
);
