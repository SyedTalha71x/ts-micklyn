import { FireApi } from "@/hooks/fireApi";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutToken = () => {
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [selectedToken, setSelectedToken] = useState("");
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
    usdt: "",
    usdc: "",
    loading: false,
  });

  const [address, setAddress] = useState({
    ethAddress: "",
    bscAddress: "",
    solanaAddress: "",
    polygonAddress: ""
  });

  const [availableTokens, setAvailableTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const tabs = [
    { label: t('token.tabs.tokenInfo'), key: "tokenInfo" },
    { label: t('token.tabs.tokenBalance'), key: "tokenBalance" }
  ];

  const networks = [
    { value: "ethereum", label: t('token.ethereum') },
    { value: "polygon", label: t('token.polygon') },
    { value: "solana", label: t('token.solana') },
    { value: "bsc", label: t('token.binanceSmartChain') },
  ];

  const chainMap = {
    ethereum: "ETH",
    polygon: "POLYGON",
    solana: "SOLANA",
    bsc: "BSC",
  };

  const fetchAvailableTokens = async () => {
    try {
      setLoadingTokens(true);

      const chainCode = chainMap[selectedNetwork] || selectedNetwork.toUpperCase();

      const response = await FireApi(
        `/get-imported-tokens?chain=${chainCode}`,
        "GET"
      );
      
      if (response.success && response.importedTokens) {
        const tokenOptions = response.importedTokens.map(token => ({
          value: token.symbol,
          label: token.symbol,
          contractAddress: token.contract_address
        }));
        
        setAvailableTokens(tokenOptions);
        
        if (tokenOptions.length > 0 && !selectedToken) {
          setSelectedToken(tokenOptions[0].value);
        }
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setAvailableTokens([]);
    } finally {
      setLoadingTokens(false);
    }
  };

  // Get the appropriate wallet address based on selected network
  const getWalletAddress = () => {
    let address = "";
    switch (selectedNetwork) {
      case "ethereum":
        address = localStorage.getItem('eth-address') || "";
        setAddress(prev => ({ ...prev, ethAddress: address }));
        break;
      case "polygon":
        address = localStorage.getItem('polygon-address') || "";
        setAddress(prev => ({ ...prev, polygonAddress: address }));
        break;
      case "solana":
        address = localStorage.getItem('solana-address') || "";
        setAddress(prev => ({ ...prev, solanaAddress: address }));
        break;
      case "bsc":
        address = localStorage.getItem('bsc-address') || "";
        setAddress(prev => ({ ...prev, bscAddress: address }));
        break;
      default:
        address = localStorage.getItem('eth-address') || "";
    }
    return address;
  };

  const TokenInfo = async () => {
    try {
      setTokenInfo((prev) => ({ ...prev, loading: true }));
      
      // Find the contract address for the selected token
      const tokenObj = availableTokens.find(t => t.value === selectedToken);
      const contractAddress = tokenObj ? tokenObj.contractAddress : "";
      
      const tokenRes = await FireApi(
        `/${selectedNetwork}/get-token-info?token=${selectedToken}&contractAddress=${contractAddress}`,
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
      setTokenInfo((prev) => ({ ...prev, loading: false }));
    }
  };

  const TokenBalance = async () => {
    try {
      setTokenBalance((prev) => ({ ...prev, loading: true }));
      const walletAddress = getWalletAddress();

      if (!walletAddress) {
        throw new Error(t('token.walletAddressNotConfigured', { network: selectedNetwork }));
      }

      // Find the contract address for the selected token
      const tokenObj = availableTokens.find(t => t.value === selectedToken);
      const contractAddress = tokenObj ? tokenObj.contractAddress : "";

      const tokenRes = await FireApi(
        `/${selectedNetwork}/get-token-balance?address=${walletAddress}&token=${selectedToken}&contractAddress=${contractAddress}`,
        "GET"
      );

      setTokenBalance({
        balance: tokenRes.Balance ?? "N/A",
        ethBalance: tokenRes.balance ?? "N/A",
        symbol: tokenRes.symbol || selectedToken,
        usdt: tokenRes.USDT || 0,
        usdc: tokenRes.USDC || 0,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      setTokenBalance((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchAvailableTokens();
  }, [selectedNetwork]);

  useEffect(() => {
    if (selectedToken && availableTokens.length > 0) {
      TokenInfo();
      TokenBalance();
    }
  }, [selectedToken, selectedNetwork, availableTokens]);

  // Format numbers for display
  const formatValue = (value) => {
    if (value === "N/A" || value === "N/A") return value;
    if (typeof value === "number") return value.toLocaleString();
    return value;
  };

  // Capitalize first letter helper
  const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="w-full md:px-4">
      <div className="flex flex-wrap gap-4 mb-4">
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
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold"
            aria-label={t('token.selectNetwork')}
          >
            {networks.map((network) => (
              <option key={network.value} value={network.value}>
                {network.label}
              </option>
            ))}
          </select>

          {loadingTokens ? (
            <div className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold flex items-center">
              <Loader className="animate-spin inline mr-2" size={16} />
              {t('token.loadingTokens')}
            </div>
          ) : (
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold"
              disabled={availableTokens.length === 0}
              aria-label={t('token.selectToken')}
            >
              {availableTokens.length === 0 ? (
                <option value="">{t('token.noTokensAvailable')}</option>
              ) : (
                availableTokens.map((token) => (
                  <option key={token.value} value={token.value}>
                    {token.label}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {tokenInfo.loading || tokenBalance.loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="animate-spin h-8 w-8 text-gray-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {activeTab === 0 ? t('token.fetchingTokenInfo') : t('token.fetchingBalance')}
            </span>
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-semibold">{t('token.network')}:</span>{" "}
                  {capitalizeFirst(selectedNetwork)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.symbol')}:</span>{" "}
                  {tokenInfo.symbol || selectedToken}
                </li>
                <li>
                  <span className="font-semibold">{t('token.holders')}:</span>{" "}
                  {formatValue(tokenInfo.holders)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.supply')}:</span>{" "}
                  {formatValue(tokenInfo.supply)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.volume')}:</span>{" "}
                  {formatValue(tokenInfo.total_volume)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.circulatingSupply')}:</span>{" "}
                  {formatValue(tokenInfo.circulating_supply)}
                </li>
              </ul>
            )}
            {activeTab === 1 && (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-semibold">{t('token.network')}:</span>{" "}
                  {capitalizeFirst(selectedNetwork)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.balance')} ({capitalizeFirst(selectedNetwork)}):</span>{" "}
                  {formatValue(tokenBalance.balance)}
                </li>
                <li>
                  <span className="font-semibold">{t('token.tokenBalance')}:</span>{" "}
                  {selectedToken === 'USDC' ? tokenBalance?.usdc : 
                   selectedToken === 'USDT' ? tokenBalance?.usdt :
                   tokenBalance.balance}
                </li>
                <li>
                  <span className="font-semibold">{t('token.symbol')}:</span>{" "}
                  {selectedToken}
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AboutToken;