
export default function GetTokenInfo({ data, title }) {

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-xs md:text-sm text-muted-foreground">
        No token information found.
      </div>
    );
  }

  const tokenData = data;

  return (
    <>
      {/* Title */}
      <h3 className="text-xs md:text-sm font-normal mb-4 dark:text-white">
        {title || tokenData.title}
      </h3>
      
      <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white border border-[#A0AEC0] dark:border-gray-700 mx-auto assets-responsive">
        <div className="flex flex-col">
          <div className="border p-2 py-3 mb-2 rounded-lg border-[#A0AEC0] dark:border-gray-700 pb-1">
            {/* First Row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-white relative">
                  {tokenData.symbol}
                </span>
              </div>
              <div className="text-xs md:text-sm text-gray-900 dark:text-white">
                Supply: {tokenData.supply}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs md:text-sm text-gray-900 dark:text-white">
                Holders: {tokenData.holders}
              </span>
              <span className="text-gray-800 dark:text-white">
                Price: {tokenData.current_price || "N/A"}
              </span>
            </div>

            {/* Additional Rows for other data */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs md:text-sm text-gray-900 dark:text-white">
                Circulating Supply: {tokenData.circulating_supply || "N/A"}
              </span>
              <span className="text-gray-800 dark:text-white">
                Total Volume: {tokenData.total_volume || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}