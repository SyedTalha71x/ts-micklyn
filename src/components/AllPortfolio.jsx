import React from "react";
import toast from "react-hot-toast";

// QR Component
const SimpleQRCode = ({ value, size = 150 }) => {
  if (!value) return null;
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
        value
      )}`}
      alt="QR Code"
      width={size}
      height={size}
      className="rounded"
    />
  );
};

const AllPortfolio = ({ data, title }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 text-black text-xs md:text-sm mx-auto border border-[#A0AEC0] dark:border-gray-700 assets-responsive">
        <div className="text-center text-gray-400">
          No wallet data available
        </div>
      </div>
    );
  }

  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => toast.success("Address copied to clipboard"))
        .catch(() => toast.error("Failed to copy address"));
    }
  };

  // Function to extract token balances from wallet object
  const getTokenBalances = (wallet) => {
    const excludedKeys = ['address', 'balance', 'blockchain'];
    const tokens = [];
    
    for (const [key, value] of Object.entries(wallet)) {
      if (!excludedKeys.includes(key) && typeof value === 'string') {
        // Check if it's a token balance (numeric value)
        if (!isNaN(parseFloat(value)) && key !== key.toLowerCase()) {
          tokens.push({
            symbol: key,
            balance: parseFloat(value)
          });
        }
      }
    }
    
    return tokens.sort((a, b) => b.balance - a.balance);
  };

  if (data.length === 1) {
    const wallet = data[0];
    const tokenBalances = getTokenBalances(wallet);
    
    return (
      <div className="bg-white dark:bg-[#1b1c1e] dark:text-gray-200 rounded-xl p-4 text-black border border-[#A0AEC0] dark:border-gray-700 assets-responsive">
        <h3 className="text-xs md:text-sm font-medium mb-4">{title}</h3>

        {/* Native Balance */}
        <div className="border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-3 mb-3 flex justify-between">
          <span className="font-medium">{wallet.blockchain.toUpperCase()}</span>
          <span>{`${wallet.balance}`}</span>
        </div>

        {/* Token Balances */}
        {tokenBalances.length > 0 && (
          <div className="border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-3 mb-3">
            <div className="text-xs md:text-sm font-medium mb-2">Token Balances</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tokenBalances.map((token, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{token.symbol}</span>
                  <span>{token.balance > 0 ? token.balance.toFixed(6) : '0.0'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address + QR */}
        <div className="border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm font-medium">Wallet Address</span>
            <button
              onClick={() => copyToClipboard(wallet.address)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
          <div className="text-xs font-mono break-all p-2 rounded bg-gray-50 dark:bg-gray-800">
            {wallet.address || "No address available"}
          </div>
          <div className="flex justify-center mt-3">
            {wallet.address ? (
              <SimpleQRCode value={wallet.address} size={140} />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                <span className="text-xs text-black dark:text-gray-200">No address</span>
              </div>
            )}
          </div>
        </div>

        {/* Network Info */}
        <div className="text-xs md:text-sm border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-2">
          <div className="mb-1">Network: {wallet.blockchain || "Unknown"}</div>
          <div className="text-xs text-black dark:text-gray-200">
            Make sure that the address and network is correct
          </div>
        </div>
      </div>
    );
  }

  // Multiple wallets view
  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-xs md:text-sm font-medium mb-2">{title}</h3>

      {/* Wallets Loop */}
      {data.map((wallet, index) => {
        const tokenBalances = getTokenBalances(wallet);
        
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#1b1c1e] rounded-xl p-4 text-black dark:text-gray-200 border border-[#A0AEC0] dark:border-gray-700 assets-responsive"
          >
            {/* Chain + Native Balance */}
            <div className="text-xs md:text-sm flex justify-between mb-3 border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-2">
              <span className="font-medium">{wallet.blockchain.toUpperCase()}</span>
              <span>{`${wallet.balance}`}</span>
            </div>

            {/* Token Balances */}
            {tokenBalances.length > 0 && (
              <div className="border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-3 mb-3">
                <div className="text-xs md:text-sm font-medium mb-2">Token Balances</div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {tokenBalances.map((token, tokenIndex) => (
                    <div key={tokenIndex} className="flex justify-between text-xs">
                      <span className="truncate">{token.symbol}</span>
                      <span className="ml-2">
                        {token.balance > 0 ? token.balance.toFixed(6) : '0.0'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Address + Copy + QR */}
            <div className="p-3 mb-3 border border-[#A0AEC0] dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-medium">Wallet Address</span>
                <button
                  onClick={() => copyToClipboard(wallet.address)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
                {wallet.address || "No address available"}
              </div>

              {/* QR Code */}
              <div className="flex justify-center mt-4">
                {wallet.address ? (
                  <SimpleQRCode value={wallet.address} size={120} />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-xs text-gray-400 border rounded bg-gray-50 dark:bg-gray-800">
                    No QR
                  </div>
                )}
              </div>
            </div>

            {/* Network Info */}
            <div className="text-xs md:text-sm border border-[#A0AEC0] dark:border-gray-700 rounded-lg p-2">
              <div className="mb-1">Network: {wallet.blockchain.toUpperCase() || "Unknown"}</div>
              <div className="text-xs text-black dark:text-gray-300">
                Make sure that the address and network is correct
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllPortfolio;