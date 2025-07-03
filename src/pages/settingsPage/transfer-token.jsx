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

  // Handle input changes
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
      setWalletDetails(res?.data);
      return res;
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message || "Failed to fetch wallet addresses");
    }
  };

  useEffect(() => {
    getWalletAddresses();
  }, []);

  // Handle form submission
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

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    if (message) {
      navigator.clipboard.writeText(message).then(() => {
        toast.success("Transaction hash copied to clipboard!");
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 dark:bg-[#2A2B2E] rounded-md shadow-md overflow-hidden">
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
          >
            {/* <option value="USDC">USDC</option> */}
            {walletDetails?.map((wallet) => (
              <option key={wallet._id} value={wallet.address} className="text-sm cursor-pointer overflow-auto">
                {wallet?.blockchain}: {wallet.address}
              </option>
            ))}
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
            className="w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md"
            disabled={loading}
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
        <p
          className="mt-4 text-center text-sm font-medium text-gray-700 cursor-pointer flex flex-wrap"
          onClick={copyToClipboard}
        >
          {message} (Click to copy)
        </p>
      )}
    </div>
  );
};

export default TransferToken;
