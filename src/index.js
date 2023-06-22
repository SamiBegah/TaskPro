import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./firebase";
import "./tailwind.css";
import App from "./App";
import { AuthProvider } from "./App";

import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
