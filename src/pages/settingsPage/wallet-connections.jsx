import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { FireApi } from "@/hooks/fireApi";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const WalletConnections = () => {
  const { t } = useTranslation('settings');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    chain: "ETH",
  });
  const [createdWallet, setCreatedWallet] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user-visited-dashboard");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken, "decoded token");
      if (decodedToken && decodedToken.id) {
        setFormData((prev) => ({
          ...prev,
          user_id: decodedToken.id,
        }));
      }
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await FireApi(`/create-wallet/${formData.chain}`, "POST");

      setCreatedWallet(response);
      localStorage.setItem(`${formData?.chain.toLowerCase()}-address`, response?.address);
      setFormData((prev) => ({
        ...prev,
        // user_id: "",
        chain: "",
      }));
      toast.success(t('wallet.walletCreated'));
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error(error?.message || t('wallet.walletFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(createdWallet.address)
      .then(() => {
        toast.success(t('wallet.addressCopied'));
      })
      .catch((error) => {
        console.error("Copy error:", error);
        toast.error(t('wallet.copyFailed'));
      });
  };

  // Get blockchain options with translations
  const blockchainOptions = [
    { value: "ETH", label: t('wallet.ethereum') },
    { value: "BSC", label: t('wallet.binanceSmartChain') },
    { value: "POLYGON", label: t('wallet.polygon') },
    { value: "SOLANA", label: t('wallet.solana') },
  ];

  return (
    <div className="dark:text-white md:p-6 p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('wallet.createNewWallet')}</h1>

      <div className="bg-white dark:bg-[#101010] rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="chain"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t('wallet.blockchainNetwork')}
            </label>
            <select
              id="chain"
              name="chain"
              value={formData.chain}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#232428] dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              {blockchainOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                {t('wallet.creating')}
              </span>
            ) : (
              t('wallet.createWallet')
            )}
          </button>
        </form>

        {/* if the wallet is created successfully, display the wallet address */}
        {createdWallet && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-[#232428] rounded-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('wallet.walletCreatedSuccess')}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                <span className="font-medium">{t('wallet.address')}:</span>{" "}
                {createdWallet.address}
              </p>
            </div>

            <button
              onClick={handleCopyAddress}
              className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              {t('wallet.copyAddress')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnections;