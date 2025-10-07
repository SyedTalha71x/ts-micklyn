import React from "react";
import toast from "react-hot-toast";
// import ethLogo from "../assets/eth.png"; // adjust path to your eth.png

// QR Component
const SimpleQRCode = ({ value, size = 180 }) => {
  if (!value) return null;
  return (
    <div className="p-2 bg-white rounded">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
          value
        )}`}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded"
      />
    </div>
  );
};

const UserBalance = ({ data }) => {
  const walletData = Array.isArray(data) ? data[0] : data;

  if (!walletData) {
    return (
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-6 text-black mx-auto border border-gray-300 assets-responsive">
        <div className="text-center text-gray-500">No wallet data available</div>
      </div>
    );
  }

  const getNetworkName = (blockchain) => {
    switch (blockchain?.toLowerCase()) {
      case "ethereum":
        return "ERC20";
      case "polygon":
        return "Polygon";
      case "solana":
        return "Solana";
      case "bsc":
        return "BSC";
      default:
        return "ERC20";
    }
  };

  const copyToClipboard = () => {
    if (walletData.address) {
      navigator.clipboard
        .writeText(walletData.address)
        .then(() => toast.success("Address copied to clipboard"))
        .catch(() => toast.error("Failed to copy address"));
    }
  };

  // Only show token balances (exclude metadata fields)
  const tokenEntries = Object.entries(walletData).filter(
    ([key]) =>
      !["address", "balance", "blockchain", "title", "response_type"].includes(
        key
      )
  );

  return (
    <>
      {/* Title */}
      <h3 className="text-xs md:text-sm  font-semibold mb-4 text-black dark:text-gray-200">
        {walletData.title || `Your ${walletData.blockchain} Wallet`}
      </h3>
      <div className="bg-white dark:bg-[#1b1c1e] text-black dark:text-gray-200 rounded-xl p-6 max-w-sm md:max-w-full mx-auto border border-[#A0AEC0] dark:border-gray-700 assets-responsive">
        {/* Token Balances */}
        <div className="border border-[#A0AEC0]  dark:border-gray-700 rounded-lg p-3 mb-2">
          {tokenEntries.length > 0 ? (
            tokenEntries.map(([symbol, amount]) => (
              <div
                key={symbol}
                className="flex items-center justify-between text-xs md:text-sm  mb-2 last:mb-0"
              >
                <div className="flex items-center gap-2 ">
                  <span className="font-medium">{symbol}</span>
                </div>
                <span className="text-black dark:text-gray-200">{amount}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No tokens found</div>
          )}
        </div>

        {/* Wallet Address */}
        <div className="border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm  font-medium text-black dark:text-gray-200">
              Wallet Address
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1 rounded hover:bg-gray-100"
              title="Copy address"
            >
              <svg
                width="16"
                height="16"
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
          <div className="text-xs font-mono break-all p-2 rounded">
            {walletData.address || "No address available"}
          </div>

          {/* QR Code */}
          <div className="flex justify-center mt-2 ">
            {walletData.address ? (
              <SimpleQRCode value={walletData.address} size={140} />
            ) : (
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                <span className="text-xs text-gray-500">No address</span>
              </div>
            )}
          </div>
        </div>

        {/* Network Info */}
        <div className="text-xs md:text-sm  border border-[#A0AEC0] dark:border-gray-700 p-3 rounded-lg">
          <div className="mb-1 font-medium text-black dark:text-gray-200">
            Network: {getNetworkName(walletData.blockchain)}
          </div>
          <div className="text-xs text-black dark:text-gray-200">
            Make sure that the address and network is correct
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBalance;
