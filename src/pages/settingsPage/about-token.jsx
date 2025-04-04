import { FireApi } from "@/hooks/fireApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const AboutToken = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [tokenInfo, setTokenInfo] = useState({
    symbol: "",
    holders: "",
    supply: "",
    volume: "",
    circulating_supply: "",
    total_volume: "",
    loading: true,
  });

  const [tokenBalance, setTokenBalance] = useState({
    balance: "",
    ethBalance: "",
    symbol: "",
    loading: false,
  });

  const tabs = [{ label: "Token Info" }, { label: "Token Balance" }];

  const TokenInfo = async () => {
    try {
      setTokenInfo({ ...tokenInfo, loading: true });
      const tokenRes = await FireApi(
        `/get-token-info?token=${selectedToken}`,
        "GET"
      );
      console.log(tokenRes, "tokenRes");
      setTokenInfo({
        symbol: tokenRes.symbol,
        holders: tokenRes.holders,
        supply: tokenRes.supply,
        volume: tokenRes.volume,
        circulating_supply: tokenRes.circulating_supply,
        total_volume: tokenRes.total_volume,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setTokenInfo({ ...tokenInfo, loading: false });
    }
  };

  const TokenBalance = async () => {
    try {
      setTokenBalance({ ...tokenBalance, loading: true });
      const tokenRes = await FireApi(
        `/get-token-balance?address=${import.meta.env.VITE_WALLET_ADDRESS}&token=${selectedToken}`,
        "GET"
      );
      console.log(tokenRes, "tokenBalance");
      setTokenBalance({
        balance: tokenRes.balance,
        ethBalance: tokenRes.ethBalance,
        symbol: tokenRes.symbol,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setTokenBalance({ ...tokenBalance, loading: false });
    }
  };

  useEffect(() => {
    TokenInfo();
    TokenBalance();
  }, [selectedToken]); // Make sure this dependency is properly set to update when `selectedToken` changes

  return (
    <div className="w-full px-4">
      <div className="flex gap-4 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
              activeTab === index
                ? "bg-[#2A2B2E] dark:bg-gray-200 text-white dark:text-[#2A2B2E]"
                : "dark:bg-[#2A2B2E]  dark:text-white bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-[#2A2B2E]  p-4 rounded-md">
        <div className="mb-4">
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-200  text-gray-800 font-semibold"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>
        {tokenInfo.loading || tokenBalance.loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <ul className="list-disc pl-6 space-y-1">
                <li>Symbol: {selectedToken}</li>
                <li>Holders: {tokenInfo.holders}</li>
                <li>Supply: {tokenInfo.supply}</li>
                <li>Volume: {tokenInfo.total_volume}</li>
                <li>Circulating Supply: {tokenInfo.circulating_supply}</li>
              </ul>
            )}
            {activeTab === 1 && (
              <ul className="list-disc pl-6 space-y-1">
                <li>Balance: {tokenBalance.balance}</li>
                <li>ETH Balance: {tokenBalance.ethBalance}</li>
                <li>Symbol: {selectedToken}</li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AboutToken;
