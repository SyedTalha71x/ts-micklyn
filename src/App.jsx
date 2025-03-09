import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateAccount from "./pages/create-account";
import VerifyOtp from "./pages/verify-otp";

import SettingsLayout from "./layouts/settings-layout";
import PreferencesPage from "./pages/settingsPage/preferences";
import WalletConnections from "./pages/settingsPage/wallet-connections";
import ManageWallet from "./pages/settingsPage/manage-wallet";
import AddressBook from "./pages/settingsPage/address-book";
import Activity from "./pages/settingsPage/activity";
import SystemStatus from "./pages/settingsPage/system-status";
import PriceAlert from "./pages/settingsPage/price-alert";
import Notification from "./pages/settingsPage/notification";
import SecurityPrivacy from "./pages/settingsPage/security-privacy";

import MobileSidebar from "./components/ui/mobile-sidebar";
import Home from "./pages/home";
import Chat from "./pages/chat";



function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />

            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="chat" element={<Chat />} />


            <Route path="settings" element={<SettingsLayout />}>
            <Route path="management" element={<MobileSidebar />} />

              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="manage-wallet" element={<ManageWallet />} />  
              <Route path="wallet-connections" element={<WalletConnections />} />
              <Route path="address-book" element={<AddressBook />} />
              <Route path="activity" element={<Activity />} />
              <Route path="security-privacy" element={<SecurityPrivacy />} />
              <Route path="system-status" element={<SystemStatus />} />
              <Route path="price-alert" element={<PriceAlert />} />
              <Route path="notification" element={<Notification />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
