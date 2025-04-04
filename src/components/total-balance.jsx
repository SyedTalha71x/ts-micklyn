import { Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

export default function TotalBalance() {
  const [showBalance, setShowBalance] = useState(false);
  const [usdt, setUsdt] = useState(0);
  const [usdc, setUsdc] = useState(0);
  const [blockchain, setBlockchain] = useState("ETH");

  const handleSettingsRedirect = () => {
    window.location.href = "/settings/manage-wallet";
  };

  const GetUserBalance = async () => {
    try {
      const response = await FireApi(`/get-user-balance?address=${import.meta.env.VITE_WALLET_ADDRESS}`, "GET");
      console.log(response?.balance, "response");
      setUsdt(response?.balance?.usdt);
      setUsdc(response?.balance?.usdc);
      setBlockchain(response?.balance?.blockchain);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    GetUserBalance();
  }, []);

  return (
    <div className="flex justify-between">
      <div className="border border-[#A0AEC0] dark:border-gray-600 p-3 rounded-xl dark:bg-[#101010]">
        <div className="flex items-center gap-2">
          <h2 className="text-md  inter-font dark:text-white">Total balance</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 dark:hover:bg-gray-700"
            onClick={() => setShowBalance(!showBalance)}
          >
            {!showBalance ? (
              <EyeOff className="h-3 w-3 dark:text-gray-300" />
            ) : (
              <Eye className="h-3 w-3 dark:text-gray-300" />
            )}
          </Button>
        </div>
        <p className="text-[12px] flex flex-col inter-font-400 text-gray-400 dark:text-gray-400">
          BlockChain: {showBalance ? blockchain : "••••••••"}
        </p>
        <p className="text-[12px] flex flex-col inter-font-400 text-gray-400 dark:text-gray-400">
          USDT: {showBalance ? usdt : "••••••••"}
        </p>
        <p className="text-[12px] flex flex-col inter-font-400 text-gray-400 dark:text-gray-400">
          USDC: {showBalance ? usdc : "••••••••"}
        </p>
      </div>
      <div onClick={handleSettingsRedirect}>
        <button
          size="sm"
          className="rounded-lg cursor-pointer text-white bg-primary p-3 border dark:border-gray-600 dark:bg-[#101010] dark:hover:bg-gray-600"
        >
          <Settings size={20} className="dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
}
