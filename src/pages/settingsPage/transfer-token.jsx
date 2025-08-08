import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

const TransferToken = () => {
  const [formData, setFormData] = useState({
    address: "",
    receiverAddress: "",
    amount: "",
    token: "USDC",
  });

  const [walletDetails, setWalletDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, address: value });
  };

  const getWalletAddresses = async () => {
    try {
      const res = await FireApi("/portfolio");
      // Filter out null values from the response
      const validWallets = res?.data?.filter(wallet => wallet !== null) || [];
      setWalletDetails(validWallets);
      
      // Set the first valid wallet as default if available
      if (validWallets.length > 0 && !formData.address) {
        setFormData(prev => ({
          ...prev,
          address: validWallets[0].address
        }));
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
    <div className="border border-[#A0AEC0] dark:border-[#505050] w-full max-w-md mx-auto p-4 bg-gray-100 dark:bg-[#2A2B2E] rounded-md shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold text-center mb-4">Transfer Token</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Select Your Wallet Address:
          </label>
          <select
            name="address"
            value={formData.address}
            onChange={handleAddressChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md cursor-pointer"
            required
          >
            {walletDetails.length === 0 ? (
              <option value="">No wallets available</option>
            ) : (
              walletDetails.map((wallet) => (
                <option 
                  key={wallet.address} 
                  value={wallet.address}
                  className="text-sm cursor-pointer overflow-auto"
                >
                  {wallet.blockchain}: {wallet.address}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Receiver Address
          </label>
          <input
            type="text"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter receiver address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter amount"
            min="0"
            step="0.00000001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Token
          </label>
          <select
            name="token"
            value={formData.token}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50"
            disabled={loading || walletDetails.length === 0}
          >
            {loading ? (
              <Loader className="animate-spin w-6 h-6 mx-auto" />
            ) : (
              "Transfer Token"
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Transaction Hash:
          </p>
          <p 
            className="text-sm break-all cursor-pointer hover:text-blue-500 dark:hover:text-blue-300"
            onClick={copyToClipboard}
          >
            {message} (Click to copy)
          </p>
        </div>
      )}
    </div>
  );
};

export default TransferToken;