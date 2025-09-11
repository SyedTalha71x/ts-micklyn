import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MobileSidebar from "./components/ui/mobile-sidebar";
import GuestRoute from "./helper/GuestRoute";
import AuthRoute from "./helper/AuthRoute";
import DashboardLayout from "./layouts/dashboardLayout";
import Rewards from "./pages/adminDashboard/Rewards";
import TaskManagement from "./pages/adminDashboard/TaskManagement";
import Leaderboard from "./pages/adminDashboard/Leaderboard";
import UserActivity from "./pages/adminDashboard/UserActivity";
import DashboardHome from "./pages/adminDashboard/DashboardHome";
import Notifications from "./pages/adminDashboard/Notifications";
import ProfileManagement from "./pages/adminDashboard/ProfileManagement";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import ChangePassword from "./pages/change-password";
import UserProfile from "./pages/settingsPage/user-profile";
import WalletBackup from "./pages/settingsPage/wallet-backup";
import ImportWallet from "./pages/settingsPage/import-wallet";
import TransactionPassword from "./pages/settingsPage/transaction-password";
import Portfolio from "./pages/settingsPage/portfolio";
import Transactions from "./pages/settingsPage/transactions";
import CopyTrades from "./pages/settingsPage/copy-trades";
import LimitOrders from "./pages/settingsPage/limit-orders";
import ImportTokens from "./pages/settingsPage/import-tokens";
import BackupAllWallet from "./pages/settingsPage/all-wallets-backup";

// Lazy-loaded components
const CreateAccount = lazy(() => import("./pages/create-account"));
const VerifyOtp = lazy(() => import("./pages/verify-otp"));
const SettingsLayout = lazy(() => import("./layouts/settings-layout"));
const PreferencesPage = lazy(() => import("./pages/settingsPage/preferences"));
const WalletConnections = lazy(() =>
  import("./pages/settingsPage/wallet-connections")
);
const ManageWallet = lazy(() => import("./pages/settingsPage/manage-wallet"));
const SystemStatus = lazy(() => import("./pages/settingsPage/system-status"));
const PriceAlert = lazy(() => import("./pages/settingsPage/price-alert"));
const Notification = lazy(() => import("./pages/settingsPage/notification"));
const SecurityPrivacy = lazy(() =>
  import("./pages/settingsPage/security-privacy")
);
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
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword/>}/>
            </Route>

            <Route path="admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="task-management" element={<TaskManagement />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="user-activity" element={<UserActivity />} />
              <Route path="notifications" element={<Notifications />} />
              <Route
                path="profile-management"
                element={<ProfileManagement />}
              />
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
                <Route path="change-password" element={<ChangePassword/>}/>
                <Route path="user-profile" element={<UserProfile/>}/>
                <Route path="wallet-backup" element={<WalletBackup/>}/>
                <Route path="backup-all-wallet" element={<BackupAllWallet/>}/>
                <Route path="import-wallet" element={<ImportWallet />} />
                <Route path="import-tokens" element={<ImportTokens/>}/>
                <Route path="transaction-password" element={<TransactionPassword />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="copy-trades" element={<CopyTrades/>}/>
                <Route path="limit-orders" element={<LimitOrders/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
