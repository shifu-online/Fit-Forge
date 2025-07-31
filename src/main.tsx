// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/fitforge.css"; // ✅ Use your custom styles only

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
