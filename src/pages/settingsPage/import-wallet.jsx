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

const ImportWallet = () => {
  const [formData, setFormData] = useState({
    chain: "ETH",
    type: "privateKey",
    privateKey: "",
    phrase: "",
  });
  const [loading, setLoading] = useState(false);

  // Supported chains
  const CHAIN_OPTIONS = [
    { value: "ETH", label: "Ethereum" },
    { value: "SOL", label: "Solana" },
    { value: "MATIC", label: "Polygon" },
    { value: "BSC", label: "Binance Smart Chain" },
  ];

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the request data based on selected type
      const requestData = {
        type: formData.type,
        [formData.type]:
          formData.type === "privateKey"
            ? formData.privateKey
            : formData.phrase,
      };

      const response = await FireApi(
        `/import-wallet/${formData.chain}`,
        "POST",
        requestData
      );

      toast.success(response.message || "Wallet imported successfully!");
      localStorage.setItem("eth-address", response.address);

      setFormData({
        chain: "ETH",
        type: "privateKey",
        privateKey: "",
        phrase: "",
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
            {/* Chain Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Blockchain</label>
              <Select
                value={formData.chain}
                onValueChange={(value) =>
                  setFormData({ ...formData, chain: value })
                }
              >
                <SelectTrigger className="w-full dark:bg-none dark:text-white dark:border-gray-500">
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

            {/* Import Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Import Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className=" w-full dark:bg-none dark:text-white dark:border-gray-500">
                  <SelectValue placeholder="Select import type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#2A2B2E]">
                  <SelectItem value="privateKey">Private Key</SelectItem>
                  <SelectItem value="phrase">Recovery Phrase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Input Field */}
            {formData.type === "privateKey" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Private Key</label>
                <Input
                  type="text"
                  name="privateKey"
                  value={formData.privateKey}
                  onChange={handleChange}
                  placeholder="Enter your private key"
                  required
                  className="dark:bg-none dark:text-white dark:border-gray-500"
                />
                <p className="text-xs text-muted-foreground">
                  Never share your private key with anyone
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Recovery Phrase
                </label>
                <Input
                  as="textarea"
                  rows={3}
                  name="phrase"
                  value={formData.phrase}
                  onChange={handleChange}
                  placeholder="Enter your 12 or 24 word recovery phrase"
                  required
                  className="dark:bg-[#080808]"
                />
                <p className="text-xs text-muted-foreground">
                  Typically 12 or 24 words separated by spaces
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full dark:bg-[#232428] cursor-pointer dark:text-white"
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
