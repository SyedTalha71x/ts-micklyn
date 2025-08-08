import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHAIN_OPTIONS = [
  { value: "ETH", label: "Ethereum" },
  { value: "BSC", label: "Binance Smart Chain" },
  { value: "POLYGON", label: "Polygon" },
  { value: "SOLANA", label: "Solana" },
];

export default function WalletBackup() {
  const [selectedChain, setSelectedChain] = useState("ETH");
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const handleBackupWallet = async () => {
    if (!selectedChain) {
      toast.error("Please select a blockchain");
      return;
    }

    setIsLoading(true);
    try {
      const response = await FireApi(`/backup-wallet/${selectedChain}`, "GET");
      setWalletData(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
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
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="dark:bg-[#2A2B2E]">
        <CardHeader className="border-b dark:border-gray-700 pb-3">
          <h1 className="text-base font-semibold">Wallet Backup</h1>
        </CardHeader>

        <CardContent className="mt-4 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-medium mb-1">
              Select Blockchain
            </label>
            <Select
              value={selectedChain}
              onValueChange={(value) => setSelectedChain(value)}
            >
              <SelectTrigger className="w-full dark:bg-[#080808] text-sm h-10">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#2A2B2E]">
                {CHAIN_OPTIONS.map((chain) => (
                  <SelectItem key={chain.value} value={chain.value}>
                    {chain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleBackupWallet}
            className="bg-black text-white hover:bg-gray-800 h-10 text-sm cursor-pointer w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mr-2" size={16} />
            ) : null}
            Backup Wallet
          </Button>

          {walletData && (
            <div className="space-y-2 p-4 border rounded-lg dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Chain
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(walletData.chain)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="mt-1 text-sm">{walletData.chain}</p>

              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Address
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(walletData.address)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="mt-1 text-sm break-all">{walletData.address}</p>

              <div className="flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Private Key
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(walletData.privateKey)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="mt-1 text-sm break-all">{walletData.privateKey}</p>

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full dark:bg-[#232428] h-10 text-sm cursor-pointer mt-4"
              >
                Download Wallet Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}