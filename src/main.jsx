import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { HistoryProvider } from "./Context/HistoryContext";
import { Suspense } from "react";
import Loader from "./components/Loader";

createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Loader />}>
    <ThemeProvider>
      <HistoryProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
        <App />
      </HistoryProvider>
    </ThemeProvider>
  </Suspense>
);
