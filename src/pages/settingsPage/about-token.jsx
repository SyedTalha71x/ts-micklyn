import { FireApi } from "@/hooks/fireApi";
import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const AboutToken = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
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

  const networks = [
    { value: "ethereum", label: "Ethereum" },
    { value: "polygon", label: "Polygon" },
    { value: "solana", label: "Solana" },
  ];

  const tokens = {
    ethereum: [
      { value: "USDC", label: "USDC" },
      { value: "USDT", label: "USDT" },
    ],
    polygon: [
      { value: "USDC", label: "USDC" },
      { value: "USDT", label: "USDT" },
    ],
    solana: [
      { value: "USDC", label: "USDC" },
      { value: "USDT", label: "USDT" },
    ],
  };

  // Get the appropriate wallet address based on selected network
  const getWalletAddress = () => {
    switch (selectedNetwork) {
      case "ethereum":
        return import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS;
      case "polygon":
        return import.meta.env.VITE_POLYGON_WALLET_ADDRESS;
      case "solana":
        return import.meta.env.VITE_SOLANA_WALLET_ADDRESS;
      default:
        return import.meta.env.VITE_WALLET_ADDRESS; // fallback
    }
  };

  const TokenInfo = async () => {
    try {
      setTokenInfo((prev) => ({ ...prev, loading: true }));
      const tokenRes = await FireApi(
        `/${selectedNetwork}/get-token-info?token=${selectedToken}`,
        "GET"
      );

      setTokenInfo({
        symbol: tokenRes.symbol || "N/A",
        holders: tokenRes.holders ?? "N/A",
        supply: tokenRes.supply ?? "N/A",
        volume: tokenRes.volume ?? "N/A",
        circulating_supply: tokenRes.circulating_supply ?? "N/A",
        total_volume: tokenRes.total_volume ?? "N/A",
        loading: false,
      });
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
      setTokenInfo((prev) => ({ ...prev, loading: false }));
    }
  };

  const TokenBalance = async () => {
    try {
      setTokenBalance((prev) => ({ ...prev, loading: true }));
      const walletAddress = getWalletAddress();

      if (!walletAddress) {
        throw new Error(`Wallet address not configured for ${selectedNetwork}`);
      }

      const tokenRes = await FireApi(
        `/${selectedNetwork}/get-token-balance?address=${walletAddress}&token=${selectedToken}`,
        "GET"
      );

      setTokenBalance({
        balance: tokenRes.Balance ?? "N/A",
        ethBalance: tokenRes.balance ?? "N/A",
        symbol: tokenRes.symbol || selectedToken,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
      setTokenBalance((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    TokenInfo();
    TokenBalance();
  }, [selectedToken, selectedNetwork]);

  // Format numbers for display
  const formatValue = (value) => {
    if (value === "N/A") return value;
    if (typeof value === "number") return value.toLocaleString();
    return value;
  };

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
                : "dark:bg-[#2A2B2E] dark:text-white bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-[#2A2B2E] p-4 rounded-md">
        <div className="flex gap-4 mb-4">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold"
          >
            {networks.map((network) => (
              <option key={network.value} value={network.value}>
                {network.label}
              </option>
            ))}
          </select>

          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold"
          >
            {tokens[selectedNetwork].map((token) => (
              <option key={token.value} value={token.value}>
                {token.label}
              </option>
            ))}
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
                <li>
                  Network:{" "}
                  {selectedNetwork.charAt(0).toUpperCase() +
                    selectedNetwork.slice(1)}
                </li>
                <li>Symbol: {tokenInfo.symbol || selectedToken}</li>
                <li>Holders: {formatValue(tokenInfo.holders)}</li>
                <li>Supply: {formatValue(tokenInfo.supply)}</li>
                <li>Volume: {formatValue(tokenInfo.total_volume)}</li>
                <li>
                  Circulating Supply:{" "}
                  {formatValue(tokenInfo.circulating_supply)}
                </li>
              </ul>
            )}
            {activeTab === 1 && (
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Network:{" "}
                  {selectedNetwork.charAt(0).toUpperCase() +
                    selectedNetwork.slice(1)}
                </li>
                <li>
                  {selectedNetwork.charAt(0).toUpperCase() +
                    selectedNetwork.slice(1)}{" "}
                  Balance: {formatValue(tokenBalance.balance)}
                </li>{" "}
                <li>
                  Token Balance: {formatValue(tokenBalance.ethBalance)}{" "}
                  { selectedToken}
                </li>
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
