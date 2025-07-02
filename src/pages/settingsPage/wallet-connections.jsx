import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { FireApi } from "@/hooks/fireApi";
import { Loader } from "lucide-react";

const WalletConnections = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    chain: "ETH",
  });
  const [createdWallet, setCreatedWallet] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user-visited-dashboard");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken, "decoded token");
      if (decodedToken && decodedToken.id) {
        setFormData((prev) => ({
          ...prev,
          user_id: decodedToken.id,
        }));
      }
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await FireApi(`/create-wallet/${formData.chain}`, "POST");

      setCreatedWallet(response);
      localStorage.setItem(`${formData?.chain.toLowerCase()}-address`, response?.address);
      setFormData((prev) => ({
        ...prev,
        // user_id: "",
        chain: "",
      }));
      toast.success("Wallet created successfully!");
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error(error?.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Wallet</h1>

      <div className="bg-white dark:bg-[#101010] rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label
              htmlFor="user_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              User ID
            </label>
            <input
              type="number"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#232428] dark:border-gray-700' rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  dark:text-white"
              required
              min="1"
              disabled={true}
            />
          </div> */}

          <div>
            <label
              htmlFor="chain"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Blockchain Network
            </label>
            <select
              id="chain"
              name="chain"
              value={formData.chain}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#232428] dark:border-gray-700' rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  dark:text-white"
            >
              <option value="ETH">Ethereum</option>
              <option value="BSC">Binance Smart Chain</option>
              <option value="POLYGON">Polygon</option>
              <option value="SOLANA">Solana</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#232428] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-[#202229] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" />
              </>
            ) : (
              "Create Wallet"
            )}
          </button>
        </form>

        {/* if the wallet is created successfully, display the wallet address */}
        {createdWallet && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-[#232428] rounded-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Wallet Created Successfully
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                <span className="font-medium">Address:</span>{" "}
                {createdWallet.address}
              </p>
            </div>

            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(createdWallet.address)
                  .then(() => {
                    toast.success("Wallet Address copied to clipboard!");
                  })
                  .catch((error) => {
                    toast.error("Failed to copy address:", error);
                  })
              }
              className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Copy Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnections;
