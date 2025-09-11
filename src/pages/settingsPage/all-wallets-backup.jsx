import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Copy } from "lucide-react";

export default function BackupAllWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState([]);

  const handleBackupWallet = async () => {
    setIsLoading(true);
    try {
      const response = await FireApi(`/backup-wallets`, "GET");
      setWalletData(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
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
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="dark:bg-[#2A2B2E]">
        <CardHeader className="border-b dark:border-gray-700 pb-3">
          <h1 className="text-base font-semibold">All Wallets Backup</h1>
        </CardHeader>

        <CardContent className="mt-4 space-y-6">
          <p className="text-base font-regular text-sm ">
            Are you willing to backup all your wallets to create backup below.
          </p>

          <Button
            onClick={handleBackupWallet}
            className="bg-black text-white hover:bg-gray-800 h-10 text-sm cursor-pointer w-full"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin mr-2" size={16} /> : null}
            Backup Wallet
          </Button>

          {walletData.length > 0 && (
            <div className="space-y-4">
              {walletData.map((wallet, idx) => (
                <div
                  key={idx}
                  className="space-y-2 p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Chain
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(wallet.chain)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm">{wallet.chain}</p>

                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Address
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(wallet.address)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm break-all">{wallet.address}</p>

                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Private Key
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(wallet.privateKey)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm break-all">{wallet.privateKey}</p>

                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Phrase
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(wallet.phrase)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm break-all">{wallet.phrase}</p>
                </div>
              ))}

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full dark:bg-[#232428] h-10 text-sm cursor-pointer mt-4"
              >
                Download All Wallets
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
