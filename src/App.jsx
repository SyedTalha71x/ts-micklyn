import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MobileSidebar from "./components/ui/mobile-sidebar";
import GuestRoute from "./helper/GuestRoute";
import AuthRoute from "./helper/AuthRoute";

// Lazy-loaded components
const CreateAccount = lazy(() => import("./pages/create-account"));
const VerifyOtp = lazy(() => import("./pages/verify-otp"));
const SettingsLayout = lazy(() => import("./layouts/settings-layout"));
const PreferencesPage = lazy(() => import("./pages/settingsPage/preferences"));
const WalletConnections = lazy(() => import("./pages/settingsPage/wallet-connections"));
const ManageWallet = lazy(() => import("./pages/settingsPage/manage-wallet"));
const SystemStatus = lazy(() => import("./pages/settingsPage/system-status"));
const PriceAlert = lazy(() => import("./pages/settingsPage/price-alert"));
const Notification = lazy(() => import("./pages/settingsPage/notification"));
const SecurityPrivacy = lazy(() => import("./pages/settingsPage/security-privacy"));
const Home = lazy(() => import("./pages/home"));
const Chat = lazy(() => import("./pages/chat"));
const GraphChat = lazy(() => import("./pages/graph-chat"));
const Login = lazy(() => import("./pages/login"));
const AboutToken = lazy(() => import("./pages/settingsPage/about-token"));
const TransferToken = lazy(() => import("./pages/settingsPage/transfer-token"));

function App() {
  return (
    <>
      <div className="light">
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="verify-otp" element={<VerifyOtp />} />
            </Route>

            <Route element={<AuthRoute />}>
              <Route path="/" replace />
              <Route path="chat" element={<Chat />} />
              <Route path="graph-chat" element={<GraphChat />} />

              <Route path="settings" element={<SettingsLayout />}>
                <Route path="management" element={<MobileSidebar />} />

                <Route path="preferences" element={<PreferencesPage />} />
                <Route path="manage-wallet" element={<ManageWallet />} />
                <Route
                  path="wallet-connections"
                  element={<WalletConnections />}
                />
                <Route path="about-token" element={<AboutToken />} />
                <Route path="transfer-token" element={<TransferToken />} />
                <Route path="security-privacy" element={<SecurityPrivacy />} />
                <Route path="system-status" element={<SystemStatus />} />
                <Route path="price-alert" element={<PriceAlert />} />
                <Route path="notification" element={<Notification />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
