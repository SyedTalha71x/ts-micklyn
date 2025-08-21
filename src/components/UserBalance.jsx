import React from 'react';
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

const UserBalance = ({ data }) => {
  console.log(data, 'a user balance');

  // Handle both single object and array data
  const walletData = Array.isArray(data) ? data[0] : data;
  
  if (!walletData) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 text-white max-w-sm mx-auto">
        <div className="text-center text-gray-400">No wallet data available</div>
      </div>
    );
  }

  const calculateETHBalance = () => {
    const usdcValue = parseFloat(walletData.usdc || 0);
    const usdtValue = parseFloat(walletData.usdt || 0);
    const totalUSD = usdcValue + usdtValue;
    
    const ethPrice = 2000;
    const ethBalance = totalUSD / ethPrice;
    
    return ethBalance.toFixed(4);
  };

  const formatUSDValue = () => {
    const usdcValue = parseFloat(walletData.usdc || 0);
    const usdtValue = parseFloat(walletData.usdt || 0);
    const totalUSD = usdcValue + usdtValue;
    return `$${totalUSD.toFixed(2)} USD`;
  };

  const getNetworkName = (blockchain) => {
    switch (blockchain?.toLowerCase()) {
      case 'ethereum':
        return 'ERC20';
      case 'polygon':
        return 'Polygon';
      case 'solana':
        return 'Solana';
      case 'bsc':
        return 'BSC';
      default:
        return 'ERC20';
    }
  };

  const copyToClipboard = () => {
    if (walletData.address) {
      navigator.clipboard.writeText(walletData.address)
        .then(() => {
          console.log('Address copied to clipboard');
          toast.success('Address copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast.error('Failed to copy address to clipboard');
        });
    }
  };

  return (
    <div className="bg-white dark:bg-[#1b1c1e]  rounded-xl p-6 text-white max-w-sm mx-auto border border-gray-400 dark:border-gray-700">
      {/* Title */}
      <h3 className="text-sm font-normal mb-6 text-gray-700 dark:text-white">
        Here is your {walletData.blockchain?.charAt(0).toUpperCase() + walletData.blockchain?.slice(1) || 'Ethereum'} wallet
      </h3>

      {/* Balance Information */}
      <div className="space-y-4 mb-6">
        {/* ETH Balance */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            <div className="text-base font-medium text-gray-800 dark:text-white">
              ETH
            </div>
            <div className="text-sm text-gray-800 dark:text-white">
              Ethereum
            </div>
            <div className="text-sm text-gray-800 dark:text-white">
              USDT
            </div>
            <div className="text-sm text-gray-800 dark:text-white">
              USDC
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-base font-medium text-gray-700 dark:text-white">
              {calculateETHBalance()} ETH
            </div>
            <div className="text-sm text-gray-800 dark:text-white mt-2">
              {formatUSDValue()}
            </div>
            <div className="text-sm text-gray-800 dark:text-white mt-2">
              {walletData.usdt || '0'} USDT
            </div>
            <div className="text-sm text-gray-800 dark:text-white mt-2">
              {walletData.usdc || '0'} USDC
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-800 dark:text-white">Wallet Address</span>
          <button 
            onClick={copyToClipboard}
            className="w-6 h-6 border border-gray-500 rounded flex items-center justify-center cursor-pointer dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            title="Copy to clipboard"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"></path>
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-800 dark:text-white border border-gray-700 dark:border-white font-mono break-all dark:bg-gray-800 p-2 rounded">
          {walletData.address || 'No address available'}
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        {walletData.address ? (
          <SimpleQRCode value={walletData.address} size={120} />
        ) : (
          <div className="w-32 h-32 dark:bg-gray-700 flex items-center justify-center rounded">
            <span className="text-gray-800 dark:text-white text-xs">No address</span>
          </div>
        )}
      </div>

      {/* Network Information */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm text-gray-800 dark:text-white mb-2">
          Network: {getNetworkName(walletData.blockchain)}
        </div>
        <div className="text-xs text-gray-600 dark:text-white">
          Make sure that the address and network is correct
        </div>
      </div>
    </div>
  );
};

export default UserBalance;