import React, { useEffect, useState } from "react";
import { Loader, Copy } from "lucide-react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TransferToken = () => {
  const [formData, setFormData] = useState({
    address: "",
    receiverAddress: "",
    amount: "",
    token: "",
  });

  const [walletDetails, setWalletDetails] = useState([]);
  const [importedTokens, setImportedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tokensLoading, setTokensLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (value) => {
    const selectedWallet = walletDetails.find(wallet => wallet.address === value);
    
    setFormData({ 
      ...formData, 
      address: value,
      token: "" // Reset token when wallet changes
    });
    
    // Get imported tokens for the selected wallet's chain
    if (selectedWallet) {
      getImportedTokens(selectedWallet.chain);
    }
  };

  const getWalletAddresses = async () => {
    try {
      const res = await FireApi("/wallets");
      const validWallets = res?.data?.filter(wallet => wallet !== null) || [];
      setWalletDetails(validWallets);
      
      // Set the first valid wallet as default if available
      if (validWallets.length > 0 && !formData.address) {
        const firstWallet = validWallets[0];
        setFormData(prev => ({
          ...prev,
          address: firstWallet.address
        }));
        
        // Also fetch tokens for the first wallet
        getImportedTokens(firstWallet.chain);
      }
      
      return res;
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message || "Failed to fetch wallet addresses");
    }
  };

  useEffect(() => {
    getWalletAddresses();
  }, []);

  const getImportedTokens = async (chain) => {
    if (!chain) return;
    
    setTokensLoading(true);
    try {
      const res = await FireApi(`/get-imported-tokens?chain=${chain}`);
      console.log(res, 'imported tokens api');
      
      if (res?.success && res.importedTokens) {
        setImportedTokens(res.importedTokens);
        
        // Set the first token as default if available
        if (res.importedTokens.length > 0 && !formData.token) {
          const firstToken = res.importedTokens[0];
          setFormData(prev => ({
            ...prev,
            token: firstToken.symbol || firstToken.name
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching imported tokens:", error);
      toast.error(error.message || "Failed to fetch imported tokens");
    } finally {
      setTokensLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await FireApi("/ethereum/transfer-token", "POST", {
        address: formData.address,
        receiver: formData.receiverAddress,
        amount: formData.amount,
        token: formData.token,
      });

      toast.success("Token transfer successful!");
      setFormData({
        ...formData,
        receiverAddress: "",
        amount: "",
      });
      setMessage(response.transactionHash);
    } catch (error) {
      console.error("Error transferring token:", error);
      toast.error(error.message || "Failed to transfer token");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (message) {
      navigator.clipboard.writeText(message).then(() => {
        toast.success("Transaction hash copied to clipboard!");
      });
    }
  };

  return (
    <div className="container mx-auto md:p-4 max-w-md">
      <Card className="dark:bg-[#2A2B2E] bg-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Transfer Token
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Wallet Address Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Wallet</label>
              <Select value={formData.address} onValueChange={handleAddressChange}>
                <SelectTrigger className="text-xs md:text-sm w-full dark:bg-none dark:text-white dark:border-gray-500">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#2A2B2E]">
                  {walletDetails.length === 0 ? (
                    <SelectItem value="no-wallets" disabled>
                      No wallets available
                    </SelectItem>
                  ) : (
                    walletDetails.map((wallet) => (
                      <SelectItem key={wallet.address} value={wallet.address}>
                        {wallet.chain}: {wallet.address}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {formData.address && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="dark:bg-[#232428]">
                    {walletDetails.find(w => w.address === formData.address)?.chain || 'Selected'}
                  </Badge>
                </div>
              )}
            </div>

            {/* Receiver Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Receiver Address</label>
              <Input
                name="receiverAddress"
                value={formData.receiverAddress}
                onChange={(e) => handleChange("receiverAddress", e.target.value)}
                placeholder="Enter receiver address"
                required
                className="text-xs md:text-sm dark:bg-none dark:outline-none dark:border-gray-500"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount</label>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.00000001"
                required
                className="text-xs md:text-sm dark:bg-none dark:outline-none dark:border-gray-500"
              />
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Token</label>
              {tokensLoading ? (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Loading tokens...
                </div>
              ) : (
                <Select value={formData.token} onValueChange={(value) => handleChange("token", value)}>
                  <SelectTrigger className="text-xs md:text-sm w-full dark:bg-none dark:text-white dark:border-gray-500">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#2A2B2E]">
                    {importedTokens.length === 0 ? (
                      <SelectItem value="no-tokens" disabled>
                        No tokens available
                      </SelectItem>
                    ) : (
                      importedTokens.map((token) => (
                        <SelectItem 
                          key={token.id} 
                          value={token.symbol || token.name}
                        >
                          {token.symbol || token.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              
              {formData.token && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="dark:bg-[#232428]">
                    {formData.token}
                  </Badge>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50"
              disabled={loading || walletDetails.length === 0 || !formData.token}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Transferring...
                </>
              ) : (
                "Transfer Token"
              )}
            </Button>
          </form>

          {/* Transaction Hash Display */}
          {message && (
            <div className="mt-4 p-3 bg-muted rounded-md dark:bg-[#232428]">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm break-all mr-2 text-xs">{message}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="dark:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferToken;