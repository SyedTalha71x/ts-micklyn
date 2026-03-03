import { useState } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackupAllWallet() {
  const { t } = useTranslation('settings');
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState([]);

  const handleBackupWallet = async () => {
    setIsLoading(true);
    try {
      const response = await FireApi(`/backup-wallets`, "GET");
      setWalletData(response.data);
      toast.success(response.message || t('backup.allWallets.success'));
    } catch (error) {
      toast.error(error.message || t('backup.allWallets.failed'));
      setWalletData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!walletData.length) return;

    const dataStr = JSON.stringify(walletData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", `wallet-backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(t('backup.allWallets.copied')))
      .catch(() => toast.error(t('backup.allWallets.copyFailed')));
  };

  return (
    <div className="container mx-auto md:p-4 max-w-2xl">
      <div className="dark:bg-[#2A2B2E] bg-white rounded-lg shadow">
        <div className="border-b dark:border-gray-700 pb-3 p-6">
          <h1 className="text-base font-semibold dark:text-white">{t('backup.allWallets.title')}</h1>
        </div>

        <div className="mt-4 space-y-6 p-6">
          <p className="text-base font-regular text-sm dark:text-gray-300">
            {t('backup.allWallets.description')}
          </p>

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
                {t('backup.allWallets.buttonLoading')}
              </span>
            ) : (
              t('backup.allWallets.button')
            )}
          </button>

          {walletData.length > 0 && (
            <div className="space-y-4">
              {walletData.map((wallet, idx) => (
                <div
                  key={idx}
                  className="space-y-2 p-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#232428]"
                >
                  {/* Chain Field */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('backup.allWallets.fields.chain')}
                    </h3>
                    <button
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(wallet.chain)}
                      title={t('backup.allWallets.copyAddress')}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm dark:text-white">{wallet.chain}</p>

                  {/* Address Field */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('backup.allWallets.fields.address')}
                    </h3>
                    <button
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(wallet.address)}
                      title={t('backup.allWallets.copyAddress')}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm break-all dark:text-white">{wallet.address}</p>

                  {/* Private Key Field */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('backup.allWallets.fields.privateKey')}
                    </h3>
                    <button
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(wallet.privateKey)}
                      title={t('backup.allWallets.copyAddress')}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm break-all dark:text-white">{wallet.privateKey}</p>

                  {/* Phrase Field */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('backup.allWallets.fields.phrase')}
                    </h3>
                    <button
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(wallet.phrase)}
                      title={t('backup.allWallets.copyAddress')}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm break-all dark:text-white">{wallet.phrase}</p>
                </div>
              ))}

              {/* Custom Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-[#232428] hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer mt-4"
              >
                {t('backup.allWallets.downloadButton')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}