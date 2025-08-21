import React from 'react';

const WalletAddresses = ({ data }) => {
  console.log(data, 'wallet data');

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white mx-auto border border-gray-400 dark:border-gray-700">
        <div className="text-center text-gray-400">No wallet data available</div>
      </div>
    );
  }

  const getNetworkName = (blockchain) => {
    switch (blockchain?.toLowerCase()) {
      case 'ethereum':
        return 'Ethereum (ERC20)';
      case 'polygon':
        return 'Polygon';
      case 'solana':
        return 'Solana';
      case 'bsc':
        return 'Binance Smart Chain';
      default:
        return blockchain || 'Unknown Network';
    }
  };

  const getNetworkIcon = (blockchain) => {
    switch (blockchain?.toLowerCase()) {
      case 'ethereum':
        return '';
      case 'polygon':
        return '';
      case 'solana':
        return '';
      case 'bsc':
        return '';
      default:
        return '';
    }
  };

  const formatBalance = (balance) => {
    return parseFloat(balance || 0).toFixed(4);
  };

  const formatUSDValue = (usdc, usdt) => {
    const usdcValue = parseFloat(usdc || 0);
    const usdtValue = parseFloat(usdt || 0);
    const totalUSD = usdcValue + usdtValue;
    return `$${totalUSD.toFixed(2)}`;
  };

  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => {
          console.log('Address copied to clipboard');
          // You can add a toast notification here if needed
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'No address available';
    return `${address}`;
  };

  return (
    <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white md:min-w-[25rem] mx-auto border border-gray-400 dark:border-gray-700">
      {/* Title */}
      <h3 className="text-sm font-normal mb-4 text-gray-700 dark:text-gray-300">
        Here is the list of your wallet addresses
      </h3>

      {/* Wallet List */}
      <div className="space-y-4">
        {data.map((wallet, index) => (
          <div key={index} className="border-b border-gray-300 dark:border-gray-700 pb-4 last:border-b-0">
            {/* Network Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                {/* <span className="text-lg">{getNetworkIcon(wallet.blockchain)}</span> */}
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {getNetworkName(wallet.blockchain)}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total: {formatUSDValue(wallet.usdc, wallet.usdt)}
              </div>
            </div>

            {/* Balance Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">Native Balance:</div>
              <div className="text-xs text-right font-medium text-gray-800 dark:text-white">
                {formatBalance(wallet.balance)} {wallet.blockchain?.toLowerCase() === 'solana' ? 'SOL' : 'ETH'}
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400">USDT:</div>
              <div className="text-xs text-right font-medium text-gray-800 dark:text-white">
                {formatBalance(wallet.usdt)} USDT
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400">USDC:</div>
              <div className="text-xs text-right font-medium text-gray-800 dark:text-white">
                {formatBalance(wallet.usdc)} USDC
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total across all wallets:</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {formatUSDValue(
              data.reduce((sum, wallet) => sum + parseFloat(wallet.usdc || 0), 0),
              data.reduce((sum, wallet) => sum + parseFloat(wallet.usdt || 0), 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletAddresses;