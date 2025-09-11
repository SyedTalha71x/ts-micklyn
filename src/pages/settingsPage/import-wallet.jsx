import React, { useState } from "react";
import { Loader } from "lucide-react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ImportWallet = () => {
  const [formData, setFormData] = useState({
    chain: ["ETH"],
    key: "", // Combined field for both private key and phrase
  });
  const [loading, setLoading] = useState(false);

  // Supported chains - make sure these match exactly what your backend expects
  const CHAIN_OPTIONS = [
    { value: "ETH", label: "Ethereum" },
    { value: "BSC", label: "Binance Smart Chain" },
    { value: "POLYGON", label: "Polygon" },
    { value: "SOLANA", label: "Solana" },
  ];

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle chain selection (multi-select)
  const handleChainChange = (value) => {
    const currentChains = [...formData.chain];
    if (currentChains.includes(value)) {
      // Remove if already selected
      const index = currentChains.indexOf(value);
      currentChains.splice(index, 1);
    } else {
      // Add if not selected
      currentChains.push(value);
    }
    setFormData({ ...formData, chain: currentChains });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the request data - removed type field
      const requestData = {
        privateKey: formData.key, // Always use privateKey field regardless of input type
        chain: formData.chain.length === 1 ? formData.chain[0] : formData.chain
      };

      const response = await FireApi(
        `/import-wallets`,
        "POST",
        requestData
      );

      toast.success(response.message || "Wallet imported successfully!");
      // Store addresses if returned (modify according to your API response)
      if (response.addresses) {
        Object.entries(response.addresses).forEach(([chain, address]) => {
          localStorage.setItem(`${chain.toLowerCase()}-address`, address);
        });
      }

      setFormData({
        chain: ["ETH"],
        key: "",
      });
    } catch (error) {
      console.error("Error importing wallet:", error);
      toast.error(error.message || "Failed to import wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="dark:bg-[#2A2B2E] bg-gray-100">
        <CardHeader>
          <h2 className="text-xl font-semibold text-center">Import Wallet</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chain Selection - Multi-select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Blockchain</label>
              <Select
                onValueChange={handleChainChange}
              >
                <SelectTrigger className="w-full dark:bg-none dark:text-white dark:border-gray-500">
                  <SelectValue placeholder="Select chains" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#2A2B2E]">
                  {CHAIN_OPTIONS.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {formData.chain.map((chain) => (
                  <Badge key={chain} variant="outline" className="dark:bg-[#232428]">
                    {CHAIN_OPTIONS.find(c => c.value === chain)?.label || chain}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Private Key
              </label>
              <Input
                as="textarea"
                rows={3}
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="Enter your private key"
                required
                className="dark:bg-none dark:outline-none dark:border-gray-500"
              />
              <p className="text-xs text-muted-foreground">
                Enter either your private key or 12/24 word recovery phrase
              </p>
            </div>

            <Button
              type="submit"
            className="w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin mr-2" size={16} />
              ) : null}
              Import Wallet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportWallet;