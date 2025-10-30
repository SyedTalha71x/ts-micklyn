// import { useState } from "react";

// export default function AllTokenBalance({ data, title }) {
//   const [showAll, setShowAll] = useState(false);

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-xs md:text-sm text-muted-foreground">
//         No token balance found.
//       </div>
//     );
//   }

//   const displayedAssets = showAll ? data : data.slice(0, 10);

//   return (
//     <>
//       {/* Title */}
//       <h3 className="text-xs md:text-sm font-normal mb-4 dark:text-white">
//         {title}
//       </h3>
//       <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white border border-[#A0AEC0] dark:border-gray-700 mx-auto assets-responsive">
//         <div className="flex flex-col">
//           {displayedAssets.map((asset, index) => (
//             <div
//               key={index}
//               className="border p-2 py-3 mb-2 rounded-lg border-[#A0AEC0] dark:border-gray-700 pb-1 last:border-b-0"
//             >
//               {/* First Row */}
//               <div className="flex items-center justify-between">
//                 <div className="flex gap-2">
//                   <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-white relative">
//                     {asset.symbol}{" "}
//                     <span className="text-xs absolute -top-1 md:top-0 ml-1 py-1 px-2 text-[8px] text-black bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-md">
//                       {asset.chain}
//                     </span>
//                   </span>
//                 </div>
//                 <div className="text-xs md:text-sm text-gray-900 dark:text-white">
//                   {asset.balance} {asset.symbol}
//                 </div>
//               </div>

//               {/* Second Row */}
//               <div className="flex items-center justify-between mt-1">
//                 <span className="text-xs md:text-sm text-gray-900 dark:text-white">
//                   {asset.name}
//                 </span>
//                 <span className="text-gray-800 dark:text-white">$0.0</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* View More / Less */}
//         {data.length > 10 && (
//           <div className="mt-3 flex justify-center">
//             <button
//               className="text-xs border border-[#A0AEC0] dark:border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//               onClick={() => setShowAll(!showAll)}
//             >
//               {showAll ? "View Less" : "View More"}
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";

const AllTokenBalance = ({ data, title }) => {
  const [showToken, setShowTokens] = useState(false);

  if (!data) {
    return (
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-6 text-white max-w-sm mx-auto border border-gray-400 dark:border-gray-700">
        <div className="text-center text-gray-400">
          No token balances data available
        </div>
      </div>
    );
  }

  const tokenEntries = Object.entries(data).filter(
    ([key]) => !["address", "balance", "symbol", "title"].includes(key)
  );

  const displayedAssets = showToken ? tokenEntries : tokenEntries.slice(0, 8);


  return (
    <>
      {/* Title */}
      <h3 className="text-sm font-normal mb-4 text-gray-700 dark:text-white">
        {title}
      </h3>
      <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-3 text-white assets-responsive border border-gray-400 dark:border-gray-700">
        {/* Token Balances */}
        <div className="space-y-3 mb-6">
          {displayedAssets.length > 0 ? (
            displayedAssets.map(([symbol, amount]) => (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 border border-[#A0AEC0] dark:border-gray-700 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {symbol}
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  ${amount}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-3">
              No tokens found
            </div>
          )}
        </div>
        {/* View More / Less */}
        {tokenEntries.length > 8 && (
          <div className="mt-3 flex justify-center">
            <button
              className="text-xs cursor-pointer border border-[#A0AEC0] dark:border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setShowTokens(!showToken)}
            >
              {showToken ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AllTokenBalance;
