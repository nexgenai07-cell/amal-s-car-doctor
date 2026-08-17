/**
 * ================================================================
 * main.jsx
 * ================================================================
 * The true entry point of the entire React application. This file
 * takes our <App /> component and mounts it into the actual HTML
 * page (into the <div id="root"> inside index.html).
 *
 * WHY BrowserRouter IS HERE (not inside App.jsx):
 * React Router's <BrowserRouter> needs to wrap the ENTIRE app so
 * that routing features (useNavigate, <Link>, useParams, etc.) work
 * anywhere inside App and its children. Placing it here, at the
 * very top level, is the standard/correct pattern.
 * ================================================================
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
