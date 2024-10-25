import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./Login.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Login />
  </StrictMode>
);
