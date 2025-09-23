"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyAssets({ data }) {
  const [showAll, setShowAll] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="text-xs md:text-sm text-muted-foreground">No assets found.</div>
    );
  }

  // Agar showAll false hai to sirf 10 dikhao
  const displayedAssets = showAll ? data : data.slice(0, 10);

  return (
    <div className="w-full bg-white dark:bg-[#1b1c1e] rounded-xl p-4 dark:text-white min-w-[14rem] md:min-w-[25rem] border border-[#A0AEC0] dark:border-gray-700">
      {/* Title */}
      <h3 className="text-xs md:text-sm font-normal mb-4 dark:text-gray-300">
        Here are all of your assets
      </h3>

      <div className="flex flex-col">
        {displayedAssets.map((asset, index) => (
          <div
            key={index}
            className="border p-2 py-3 mb-2 rounded-lg border-[#A0AEC0] dark:border-gray-700 pb-1 last:border-b-0"
          >
            {/* First Row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-white relative">
                  {asset.symbol}{" "}
                  <span className="text-xs absolute ml-1 py-1 px-2 text-[8px] text-black bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-md">
                    {asset.chain}
                  </span>
                </span>
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {asset.balance} {asset.symbol}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs md:text-sm text-gray-800 dark:text-white">
                {asset.name}
              </span>
              <span className="text-gray-400">$0.0</span>
            </div>
          </div>
        ))}
      </div>

      {/* View More / Less */}
      {data.length > 10 && (
        <div className="mt-3 flex justify-center ">
          <button
            variant="outline"
            size="sm"
            className="text-xs border px-3 py-2 rounded-lg hover:bg-black/50"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}
