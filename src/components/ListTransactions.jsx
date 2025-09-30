import React from "react";

const ListTransactions = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No transactions found.</div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white border border-[#A0AEC0] dark:border-gray-700 assets-responsive">
      {/* Title */}
      <h3 className="text-sm font-normal mb-4 dark:text-gray-300">
        {title}
      </h3>

      <div className="flex flex-col gap-3">
        {data.map((tx) => (
          <div
            key={tx.id}
            className="border p-3 rounded-lg border-[#A0AEC0] dark:border-gray-700"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">{tx.type} ({tx.chain})</span>
              <span className="text-gray-600 dark:text-gray-400">
                {parseFloat(tx.amount).toFixed(4)}
              </span>
            </div>

            <div className="text-xs mt-1 break-all">
              From: {tx.address}
            </div>
            <div className="text-xs break-all">
              To: {tx.receiver}
            </div>

            <div className="flex justify-between text-[10px] text-gray-700 dark:text-white mt-2">
              <span>{tx.chain?.toUpperCase()}</span>
              <span>{new Date(tx.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListTransactions;
