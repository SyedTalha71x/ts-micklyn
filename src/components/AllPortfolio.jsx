import React from "react";

const AllPortfolio = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No assets found.</div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white md:min-w-[25rem] border border-[#A0AEC0] dark:border-gray-700">
      {/* Title */}
      <h3 className="text-sm font-normal mb-4 dark:text-gray-300">
        Here are all of your assets
      </h3>

      <div className="flex flex-col gap-3">
        {data.map((portfolio, index) => {
          // Case 1: Blockchain wallet object
          if (portfolio.blockchain) {
            return (
              <div
                key={index}
                className="border p-3 rounded-lg border-[#A0AEC0] dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {portfolio.blockchain.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {portfolio.balance}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 break-all mt-1">
                  {portfolio.address}
                </div>
              </div>
            );
          }

          // Case 2: Token balances object
          return (
            <div
              key={index}
              className="border p-3 rounded-lg border-[#A0AEC0] dark:border-gray-700"
            >
              <h4 className="text-xs font-semibold mb-2">Tokens</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(portfolio).map(([symbol, balance]) => (
                  <div
                    key={symbol}
                    className="flex justify-between border-b border-dashed pb-1"
                  >
                    <span className="font-medium">{symbol}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {balance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllPortfolio;
