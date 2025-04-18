import { Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

export default function TotalBalance() {
  const [showBalance, setShowBalance] = useState(false);
  const [balances, setBalances] = useState({
    ETH: { usdt: 0, usdc: 0, loading: true, address: "" },
    POL: { usdt: 0, usdc: 0, loading: true, address: "" },
    SOL: { usdt: 0, usdc: 0, loading: true, address: "" }
  });

  const handleSettingsRedirect = () => {
    window.location.href = "/settings/manage-wallet";
  };

  const GetEthBalance = async () => {
    try {
      setBalances(prev => ({...prev, ETH: {...prev.ETH, loading: true}}));
      const response = await FireApi(
        `/ethereum/get-user-balance?address=${import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS}`,
        "GET"
      );
      setBalances(prev => ({
        ...prev,
        ETH: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false
        }
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setBalances(prev => ({...prev, ETH: {...prev.ETH, loading: false}}));
    }
  };

  const GetPolygonBalance = async () => {
    try {
      setBalances(prev => ({...prev, POL: {...prev.POL, loading: true}}));
      const response = await FireApi(
        `/polygon/get-user-balance?address=${import.meta.env.VITE_POLYGON_WALLET_ADDRESS}`,
        "GET"
      );
      setBalances(prev => ({
        ...prev,
        POL: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false
        }
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setBalances(prev => ({...prev, POL: {...prev.POL, loading: false}}));
    }
  };

  const GetSolanaBalance = async () => {
    try {
      setBalances(prev => ({...prev, SOL: {...prev.SOL, loading: true}}));
      const response = await FireApi(
        `/solana/get-user-balance?address=${import.meta.env.VITE_SOLANA_WALLET_ADDRESS}`,
        "GET"
      );
      setBalances(prev => ({
        ...prev,
        SOL: {
          usdt: response?.data?.usdt ? parseFloat(response.data.usdt) : 0,
          usdc: response?.data?.usdc ? parseFloat(response.data.usdc) : 0,
          address: response?.data?.address || "",
          loading: false
        }
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setBalances(prev => ({...prev, SOL: {...prev.SOL, loading: false}}));
    }
  };

  useEffect(() => {
    GetEthBalance();
    GetPolygonBalance();
    GetSolanaBalance();
  }, []);

  const formatBalance = (value) => {
    if (!showBalance) return "••••••••";
    if (typeof value !== "number") return "0.00";
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatAddress = (address) => {
    if (!showBalance || !address) return "••••••••••••••••";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const blockchainNames = {
    ETH: "Ethereum",
    POL: "Polygon",
    SOL: "Solana"
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-white">Wallet Balances</h2>
        <div className="flex gap-2">
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
          <Button
            size="icon"
            className="h-8 w-8 rounded-lg cursor-pointer text-white bg-primary dark:border-gray-600 dark:bg-[#101010] dark:hover:bg-gray-600"
            onClick={handleSettingsRedirect}
          >
            <Settings size={16} className="dark:text-gray-200" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ethereum Card */}
        <div className="border border-[#A0AEC0] dark:border-gray-600 p-4 rounded-xl dark:bg-[#101010]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium dark:text-white">{blockchainNames.ETH}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#627EEA]"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">ETH Network</span>
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
              USDT: {balances.ETH.loading ? "Loading..." : formatBalance(balances.ETH.usdt)}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              USDC: {balances.ETH.loading ? "Loading..." : formatBalance(balances.ETH.usdc)}
            </p>
          </div>
        </div>

        {/* Polygon Card */}
        <div className="border border-[#A0AEC0] dark:border-gray-600 p-4 rounded-xl dark:bg-[#101010]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium dark:text-white">{blockchainNames.POL}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#8247E5]"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">MATIC Network</span>
              </div>
            </div>
            {balances.POL.loading ? (
              <div className="animate-pulse h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatAddress(balances.POL.address)}
              </span>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              USDT: {balances.POL.loading ? "Loading..." : formatBalance(balances.POL.usdt)}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              USDC: {balances.POL.loading ? "Loading..." : formatBalance(balances.POL.usdc)}
            </p>
          </div>
        </div>

        {/* Solana Card */}
        <div className="border border-[#A0AEC0] dark:border-gray-600 p-4 rounded-xl dark:bg-[#101010]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium dark:text-white">{blockchainNames.SOL}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3]"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">SOL Network</span>
              </div>
            </div>
            {balances.SOL.loading ? (
              <div className="animate-pulse h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatAddress(balances.SOL.address)}
              </span>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              USDT: {balances.SOL.loading ? "Loading..." : formatBalance(balances.SOL.usdt)}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              USDC: {balances.SOL.loading ? "Loading..." : formatBalance(balances.SOL.usdc)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}