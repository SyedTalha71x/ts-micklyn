import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { HistoryProvider } from "./Context/HistoryContext";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import { CurrencyProvider } from "./Context/CurrencyContext";

createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Loader />}>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
        <HistoryProvider>
          <CurrencyProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            <App />
          </CurrencyProvider>
        </HistoryProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </Suspense>,
);
