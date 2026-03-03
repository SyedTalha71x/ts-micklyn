import { useState } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Copy, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WalletBackup() {
  const { t } = useTranslation('settings');
  const [selectedChain, setSelectedChain] = useState("ETH");
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const CHAIN_OPTIONS = [
    { value: "ETH", label: t('backup.singleWallet.chains.ethereum') },
    { value: "BSC", label: t('backup.singleWallet.chains.bsc') },
    { value: "POLYGON", label: t('backup.singleWallet.chains.polygon') },
    { value: "SOLANA", label: t('backup.singleWallet.chains.solana') },
  ];

  const handleBackupWallet = async () => {
    if (!selectedChain) {
      toast.error(t('backup.singleWallet.noChainSelected'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await FireApi(`/backup-wallet/${selectedChain}`, "GET");
      setWalletData(response.data);
      toast.success(response.message || t('backup.singleWallet.success'));
    } catch (error) {
      toast.error(error.message || t('backup.singleWallet.failed'));
      setWalletData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!walletData) return;

    const dataStr = JSON.stringify(walletData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", `wallet-backup-${walletData.chain}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(t('backup.singleWallet.copied')))
      .catch(() => toast.error(t('backup.singleWallet.copyFailed')));
  };

  const selectedChainLabel = CHAIN_OPTIONS.find(c => c.value === selectedChain)?.label || selectedChain;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="dark:bg-[#2A2B2E] bg-white rounded-lg shadow">
        <div className="border-b dark:border-gray-700 pb-3 p-6">
          <h1 className="text-base font-semibold dark:text-white">{t('backup.singleWallet.title')}</h1>
        </div>

        <div className="mt-4 space-y-6 p-6">
          {/* Custom Select - Like WalletConnections */}
          <div className="space-y-2">
            <label className="block text-xs font-medium mb-1 dark:text-gray-300">
              {t('backup.singleWallet.selectBlockchain')}
            </label>
            <div className="relative">
              <div 
                className="w-full px-3 py-2 border border-gray-300 dark:bg-[#232428] dark:border-gray-700 rounded-md shadow-sm cursor-pointer flex items-center justify-between dark:text-white"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>{selectedChainLabel}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isSelectOpen ? 'transform rotate-180' : ''}`} />
              </div>
              
              {isSelectOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#232428] border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {CHAIN_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white ${
                        selectedChain === option.value ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => {
                        setSelectedChain(option.value);
                        setIsSelectOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom Button - Like WalletConnections */}
          <button
            onClick={handleBackupWallet}
            disabled={isLoading}
            className={`w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                {t('backup.singleWallet.buttonLoading')}
              </span>
            ) : (
              t('backup.singleWallet.button')
            )}
          </button>

          {walletData && (
            <div className="space-y-2 p-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#232428]">
              {/* Chain Field */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('backup.singleWallet.fields.chain')}
                </h3>
                <button
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(walletData.chain)}
                  title={t('backup.singleWallet.copyAddress')}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-sm dark:text-white">{walletData.chain}</p>

              {/* Address Field */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('backup.singleWallet.fields.address')}
                </h3>
                <button
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(walletData.address)}
                  title={t('backup.singleWallet.copyAddress')}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-sm break-all dark:text-white">{walletData.address}</p>

              {/* Private Key Field */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('backup.singleWallet.fields.privateKey')}
                </h3>
                <button
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(walletData.privateKey)}
                  title={t('backup.singleWallet.copyAddress')}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-sm break-all dark:text-white">{walletData.privateKey}</p>

              {/* Custom Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-2 px-4 mt-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-[#232428] hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {t('backup.singleWallet.downloadButton')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}