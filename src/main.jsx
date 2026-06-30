import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import favicon from "./assets/logo.png"; // Import the favicon from src/assets

// Dynamically add the favicon to the head
const link = document.createElement("link");
link.rel = "icon";
link.type = "image/png";
link.href = favicon; // Use the imported favicon
document.head.appendChild(link);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
