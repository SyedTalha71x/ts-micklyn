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
import { useTranslation } from "react-i18next";

const ImportTokens = () => {
  const { t } = useTranslation('settings');
  const [formData, setFormData] = useState({
    chain: "ETH", // Changed to single selection
    contract_address: "", 
  });
  const [loading, setLoading] = useState(false);

  const CHAIN_OPTIONS = [
    { value: "ETH", label: t('import.chains.ethereum') },
    { value: "BSC", label: t('import.chains.bsc') },
    { value: "POLYGON", label: t('import.chains.polygon') },
    { value: "SOLANA", label: t('import.chains.solana') },
  ];

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChainChange = (value) => {
    setFormData({ ...formData, chain: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contract_address) {
      toast.error(t('import.token.addressRequired'));
      return;
    }
    
    setLoading(true);

    try {
      const requestData = {
        contract_address: formData.contract_address, 
      };

      // Use the new API endpoint structure
      const response = await FireApi(
        `/import-token/${formData.chain}`,
        "POST",
        requestData
      );

      if (response.success) {
        toast.success(response.message || t('import.token.success'));
        
        // Clear form after successful import
        setFormData({
          chain: "ETH",
          contract_address: "",
        });
      } else {
        toast.error(response.message || t('import.token.failed'));
      }
    } catch (error) {
      console.error("Error importing token:", error);
      toast.error(error.message || t('import.token.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto md:p-4 max-w-md">
      <Card className="dark:bg-[#2A2B2E] bg-gray-100">
        <CardHeader>
          <h2 className="text-xl font-semibold text-center">
            {t('import.token.title')}
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chain Selection - Single select */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium">
                {t('import.token.blockchain')}
              </label>
              <Select
                value={formData.chain}
                onValueChange={handleChainChange}
              >
                <SelectTrigger className="text-xs md:text-sm w-full dark:bg-none dark:text-white dark:border-gray-500">
                  <SelectValue placeholder={t('import.token.selectChain')} />
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
                <Badge variant="outline" className="dark:bg-[#232428]">
                  {CHAIN_OPTIONS.find(c => c.value === formData.chain)?.label || formData.chain}
                </Badge>
              </div>
            </div>

            {/* Contract Address Field */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm block font-medium">
                {t('import.token.contractAddress')}
              </label>
              <Input
                name="contract_address"
                value={formData.contract_address}
                onChange={handleChange}
                placeholder={t('import.token.contractPlaceholder')}
                required
                className="text-xs md:text-sm dark:bg-none dark:outline-none dark:border-gray-500"
              />
              <p className="text-xs md:text-sm text-muted-foreground">
                {t('import.token.contractHelp')}
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
              {loading ? t('import.token.importing') : t('import.token.importButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportTokens;