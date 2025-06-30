import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateAccount from "./pages/create-account";
import VerifyOtp from "./pages/verify-otp";

import SettingsLayout from "./layouts/settings-layout";
import PreferencesPage from "./pages/settingsPage/preferences";
import WalletConnections from "./pages/settingsPage/wallet-connections";
import ManageWallet from "./pages/settingsPage/manage-wallet";
import Activity from "./pages/settingsPage/activity";
import SystemStatus from "./pages/settingsPage/system-status";
import PriceAlert from "./pages/settingsPage/price-alert";
import Notification from "./pages/settingsPage/notification";
import SecurityPrivacy from "./pages/settingsPage/security-privacy";

import MobileSidebar from "./components/ui/mobile-sidebar";
import Home from "./pages/home";
import Chat from "./pages/chat";
import GraphChat from "./pages/graph-chat";
import Login from "./pages/login";
import GuestRoute from "./helper/GuestRoute";
import AuthRoute from "./helper/AuthRoute";
import AboutToken from "../src/pages/settingsPage/about-token";
import TransferToken from "./pages/settingsPage/transfer-token";

function App() {
  return (
    <>
      <div className="light">
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="verify-otp" element={<VerifyOtp />} />
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<AuthRoute />}>
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
