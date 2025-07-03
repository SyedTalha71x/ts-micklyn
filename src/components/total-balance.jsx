// TotalBalance.jsx
import { Eye, EyeOff, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { chatHistoryUrl, FireApi } from "@/hooks/fireApi";
import ChatHistoryTab from "./ChatHistoryTab";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "@/Context/HistoryContext";
import { useNavigate } from "react-router-dom";

export const handleCreateSession = async ({
  userId,
  userEmail,
  setUserInfo,
  handleGetHistory,
}) => {
  try {
    const res = await FireApi(
      "/chat-sessions",
      "POST",
      {
        user_id: userId,
        email_address: userEmail,
      },
      chatHistoryUrl
    );
    toast.success("Chat session created successfully");
    localStorage.setItem("chat_session", res?.data?.session_id);
    setUserInfo({
      sessionId: res?.data?.session_id,
    });
    handleGetHistory(userId);
  } catch (error) {
    console.log(error);
    // toast.error(error.message);
  }
};

export default function TotalBalance() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [balances, setBalances] = useState({
    ETH: { usdt: 0, usdc: 0, loading: true, address: "" },
    POL: { usdt: 0, usdc: 0, loading: true, address: "" },
    SOL: { usdt: 0, usdc: 0, loading: true, address: "" },
  });

  const [addresses, setAddresses] = useState({
    ETH: "",
    POL: "",
    SOL: "",
    BSC: "",
  });

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sessionCreated, setSessionCreated] = useState(false);
  const { setUserInfo, handleGetHistory } = useHistory();

  useEffect(() => {
    const ethAddress = localStorage.getItem("eth-address");
    const polygonAddress = localStorage.getItem("polygon-address");
    const solanaAddress = localStorage.getItem("solana-address");
    const bscAddress = localStorage.getItem("bsc-address");

    setAddresses({
      ETH: ethAddress || "",
      POL: polygonAddress || "",
      SOL: solanaAddress || "",
      BSC: bscAddress || "",
    });
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem("user-visited-dashboard");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        setUserId(decodedToken.id);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.log(error, "error on decode token");
      }
    }
  }, []);

  const GetEthBalance = async () => {
    try {
      setBalances((prev) => ({ ...prev, ETH: { ...prev.ETH, loading: true } }));
      const response = await FireApi(
        `/ethereum/get-user-balance?address=${addresses.ETH}`,
        "GET"
      );
      setBalances((prev) => ({
        ...prev,
        ETH: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false,
        },
      }));
    } catch (error) {
      console.log(error);
      setBalances((prev) => ({
        ...prev,
        ETH: { ...prev.ETH, loading: false },
      }));
    }
  };

  const GetPolygonBalance = async () => {
    try {
      setBalances((prev) => ({ ...prev, POL: { ...prev.POL, loading: true } }));
      const response = await FireApi(
        `/polygon/get-user-balance?address=${addresses.POL}`,
        "GET"
      );
      setBalances((prev) => ({
        ...prev,
        POL: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false,
        },
      }));
    } catch (error) {
      console.log(error);
      setBalances((prev) => ({
        ...prev,
        POL: { ...prev.POL, loading: false },
      }));
    }
  };

  const GetSolanaBalance = async () => {
    try {
      setBalances((prev) => ({ ...prev, SOL: { ...prev.SOL, loading: true } }));
      const response = await FireApi(
        `/solana/get-user-balance?address=${addresses.SOL}`,
        "GET"
      );
      setBalances((prev) => ({
        ...prev,
        SOL: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false,
        },
      }));
    } catch (error) {
      console.log(error);
      setBalances((prev) => ({
        ...prev,
        SOL: { ...prev.SOL, loading: false },
      }));
    }
  };

  useEffect(() => {
    if (addresses.ETH) GetEthBalance();
    if (addresses.POL) GetPolygonBalance();
    if (addresses.SOL) GetSolanaBalance();
  }, [addresses]);

  const formatBalance = (value) => {
    if (!showBalance) return "••••••••";
    if (typeof value !== "number") return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAddress = (address) => {
    if (!showBalance || !address) return "••••••••••••••••";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const blockchainNames = {
    ETH: "Ethereum",
    POL: "Polygon",
    SOL: "Solana",
  };

  useEffect(() => {
    if (userId && userEmail && !sessionCreated) {
      handleCreateSession({ userId, userEmail, setUserInfo, handleGetHistory });
      setSessionCreated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userEmail, sessionCreated]);
  return (
    <div className="flex flex-col gap-4">
      {/* create new chat */}
      <button
        onClick={() =>
          handleCreateSession({
            userId,
            userEmail,
            setUserInfo,
            handleGetHistory,
          })
        }
        className="rounded-md cursor-pointer shadow-md gap-2 text-sm font-semibold text-white bg-primary text-center py-2 w-20"
      >
        New Chat
      </button>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 justify-between cursor-pointer shadow-md bg-background px-4 py-2 w-full rounded-sm">
          <h2
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex rounded-lg items-center gap-2 text-sm font-semibold dark:text-white"
          >
            Wallet Balances
            {openDropdown ? (
              <ChevronUp size={18} className="dark:text-gray-300" />
            ) : (
              <ChevronDown size={18} className="dark:text-gray-300" />
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 dark:hover:bg-gray-700"
            onClick={() => setShowBalance(!showBalance)}
          >
            {!showBalance ? (
              <EyeOff className="h-4 w-4 dark:text-gray-300" />
            ) : (
              <Eye className="h-4 w-4 dark:text-gray-300" />
            )}
          </Button>
        </div>
      </div>

      {openDropdown && (
        <div className="translate transition-transform duration-500 ease-all gap-6 hidden md:block">
          {/* Ethereum Card */}
          <div className="border border-[#A0AEC0] dark:border-gray-600 p-4 rounded-xl mb-2 dark:bg-[#101010]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium dark:text-white">
                  {blockchainNames.ETH}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#627EEA]"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ETH Network
                  </span>
                </div>
              </div>
              {balances.ETH.loading ? (
                <div className="animate-pulse h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatAddress(balances.ETH.address)}
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400 dark:text-gray-400">
                USDT:{" "}
                {balances.ETH.loading
                  ? "Loading..."
                  : formatBalance(balances.ETH.usdt)}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-400">
                USDC:{" "}
                {balances.ETH.loading
                  ? "Loading..."
                  : formatBalance(balances.ETH.usdc)}
              </p>
            </div>
          </div>

          {/* Polygon and Solana Cards follow similarly... */}
        </div>
      )}

      <button
        onClick={() => navigate("/settings/wallet-connections")}
        className="absolute top-4 right-4 bg-black p-1.5 z-10 cursor-pointer rounded-full text-white"
      >
        <Settings size={19} />
      </button>

      <ChatHistoryTab />
    </div>
  );
}
