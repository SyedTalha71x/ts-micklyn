import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SimpleQRCode = ({ value, size = 120 }) => {
  if (!value) return null;

  return (
    <div className="bg-white p-2 rounded">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
        alt="QR Code"
        width={size}
        height={size}
      />
    </div>
  );
};

const TokenBalance = ({ data, title }) => {
  console.log(data, 'Token balance data');

  // Handle case where data might be null or undefined
  if (!data) {
    return (
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-6 text-white max-w-sm mx-auto border border-gray-400 dark:border-gray-700">
        <div className="text-center text-gray-400">No token data available</div>
      </div>
    );
  }

  const copyToClipboard = () => {
    if (data.address) {
      navigator.clipboard
        .writeText(data.address)
        .then(() => toast.success("Address copied to clipboard"))
        .catch(() => toast.error("Failed to copy address"));
    }
  };

  // Extract token entries (excluding address, balance, symbol, title)
  const tokenEntries = Object.entries(data).filter(
    ([key]) => !["address", "balance", "symbol", "title"].includes(key)
  );

  return (
    <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-6 text-white max-w-sm mx-auto border border-gray-400 dark:border-gray-700">
      {/* Title */}
      <h3 className="text-sm font-normal mb-6 text-gray-700 dark:text-white">
        {title}
      </h3>

      {/* Native Balance */}
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {data.chain}
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            {data.balance || "0"} ETH
          </span>
        </div>
      </div>

      

      {/* Token Balances */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token Balances</h4>
        
        {tokenEntries.length > 0 ? (
          tokenEntries.map(([symbol, amount]) => (
            <div
              key={symbol}
              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {symbol}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {amount}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm py-3">No tokens found</div>
        )}
      </div>

      {/* Wallet Address */}
      <div className="mb-4 border p-3 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-800 dark:text-white">
            Wallet Address
          </span>
          <button
            onClick={copyToClipboard}
            className="w-6 h-6 border border-gray-500 rounded flex items-center justify-center cursor-pointer dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            title="Copy to clipboard"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                ry="2"
              ></rect>
              <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"></path>
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 font-mono break-all dark:bg-gray-800 p-2 rounded">
          {data.address || "No address available"}
        </div>

      {/* QR Code */}
      <div className="flex justify-center mt-2">
        {data.address ? (
          <SimpleQRCode value={data.address} size={120} />
        ) : (
          <div className="w-32 h-32 dark:bg-gray-700 flex items-center justify-center rounded">
            <span className="text-gray-800 dark:text-white text-xs">
              No address
            </span>
          </div>
        )}
      </div>
            </div>


      {/* Network Info */}
      <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
        <div className="text-sm text-gray-800 dark:text-white mb-2">
          Network: Ethereum
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Make sure that the address and network is correct
        </div>
      </div>
    </div>
  );
};

export default TokenBalance;