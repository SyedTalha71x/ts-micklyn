import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { HistoryProvider } from "./Context/HistoryContext";
createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <HistoryProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <App />
    </HistoryProvider>
  </ThemeProvider>
);
