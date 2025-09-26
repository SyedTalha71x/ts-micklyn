import React, { useState } from 'react'

const CryptoDisplay = ({ data, title }) => {
  const [showAll, setShowAll] = useState(false);

  const formatPrice = (price) => {
    if (typeof price === "string") {
      return price;
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatChange = (change) => {
    if (typeof change === "string") {
      return change;
    }
    const changeValue = parseFloat(change);
    return changeValue >= 0
      ? `+${changeValue.toFixed(2)}%`
      : `${changeValue.toFixed(2)}%`;
  };

  const displayedData = showAll ? data : data?.slice(0, 5);
  console.log(title, "ajsdbbdsa");
  return (
    <div className="bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white w-[21rem] md:min-w-sm mx-auto border border-[#A0AEC0] dark:border-gray-700">
      {/* Title */}
      <h3 className="text-xs md:text-sm font-normal mb-4 leading-relaxed">
        {title}
      </h3>

      {/* Crypto List */}
      <div className="space-y-2">
        {displayedData && Array.isArray(displayedData) ? (
          displayedData.map((crypto, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg border border-[#A0AEC0] dark:border-gray-700"
            >
              <div className="flex flex-col items-start gap-3">
                <div className="text-xs md:text-sm  font-medium text-black dark:text-gray-300">
                  {crypto.symbol || "N/A"}
                </div>
                <div className="text-xs md:text-sm  text-gray-600 dark:text-gray-400">
                  {crypto.name || "Unknown"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-xs md:text-sm  font-medium text-gray-800 dark:text-gray-300">
                  {formatPrice(crypto.price || "0")}
                </div>
                <div
                  className={`text-xs md:text-sm  font-medium ${
                    (crypto.change_24h || "").toString().startsWith("-")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {formatChange(crypto.change_24h || "0")}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs md:text-sm text-center text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Show More / Show Less Button */}
      {data?.length > 5 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-xs md:text-sm  font-medium border border-[#A0AEC0] hover:cursor-pointer rounded-lg text-gray-500 dark:text-gray-300 hover:underline"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoDisplay