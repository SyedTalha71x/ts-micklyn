import React from "react";
import toast from "react-hot-toast";

const WalletAddresses = ({ data, title }) => {
  console.log(data, "wallet data");

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white mx-auto border border-gray-400 dark:border-gray-700">
        <div className="text-center text-gray-400">
          No wallet data available
        </div>
      </div>
    );
  }

  const getNetworkName = (blockchain) => {
    switch (blockchain?.toLowerCase()) {
      case "ethereum":
        return "Ethereum (ERC20)";
      case "polygon":
        return "Polygon";
      case "solana":
        return "Solana";
      case "bsc":
        return "Binance Smart Chain";
      default:
        return blockchain || "Unknown Network";
    }
  };

  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          toast.success("Address copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const formatAddress = (address) => {
    if (!address) return "No address available";
    return `${address}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white md:min-w-[25rem] border border-[#A0AEC0] dark:border-gray-700">
      {/* Title */}
      <h3 className="text-sm font-normal mb-4 dark:text-gray-300">
        {title}
      </h3>

      {/* Wallet List */}
      <div className="space-y-2">
        {data.map((wallet, index) => (
          <div
            key={index}
            className="border p-2 rounded-lg border-[#A0AEC0] dark:border-gray-700 pb-1 last:border-b-0"
          >
            {/* Network Header */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {getNetworkName(wallet.chain)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {wallet.balance}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                {formatAddress(wallet.address)}
              </div>
              <button
                onClick={() => copyToClipboard(wallet.address)}
                className="flex-shrink-0 w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                title="Copy address"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletAddresses;
