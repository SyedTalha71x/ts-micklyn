import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <StrictMode>
      <Toaster position="bottom-right" reverseOrder={false} />
      <App />
    </StrictMode>
  </ThemeProvider>
);
