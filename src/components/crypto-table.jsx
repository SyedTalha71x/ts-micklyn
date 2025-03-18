import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { X } from "react-feather"

export default function CryptoTable({ onClose }) {
  const [activeTab, setActiveTab] = useState("watchlist");
  const contentRef = useRef(null);
  const tabIndicatorRef = useRef(null);

  const cryptoData = [
    { name: "BTC", fullName: "Bitcoin", value: "$69,915.4", change: "-2%" },
    { name: "LTC", fullName: "Litecoin", value: "$69,915.4", change: "+2%" },
    { name: "ETH", fullName: "Ethereum", value: "$2,932.76", change: "-2%" },
    { name: "XMR", fullName: "Monero", value: "$435.87", change: "-2%" },
    { name: "DOT", fullName: "Polkadot", value: "$31.45", change: "-3%" },
  ];

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  useEffect(() => {
    if (tabIndicatorRef.current) {
      gsap.to(tabIndicatorRef.current, {
        x: activeTab === "watchlist" ? 0 : "100%",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

  return (
    <div className="relative border border-[#A0AEC0] dark:border-gray-600 p-2 rounded-xl h-full overflow-auto bg-white dark:bg-[#101010] dark:text-white">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <X size={18} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Tab Switcher */}
      <div className="relative flex cursor-pointer gap-2 p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md">
        <div
          ref={tabIndicatorRef}
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-300 dark:bg-[#232428] rounded-md shadow-md"
        />
        <button
          className={`relative flex-1 py-2 inter-font px-4 rounded-md text-sm font-medium z-10 ${
            activeTab === "watchlist"
              ? "text-black dark:text-white"
              : "text-gray-700 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist
        </button>
        <button
          className={`relative flex-1 py-2 inter-font px-4 rounded-md text-sm font-medium z-10 ${
            activeTab === "history"
              ? "text-black dark:text-white"
              : "text-gray-700  dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Animated Content */}
      <div className="p-4" ref={contentRef}>
        {activeTab === "watchlist" && (
          <div className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.name} className="flex justify-between items-center dark:border-b  dark:border-[#505050]">
                <div className="flex flex-col">
                  <span className="inter-font-400 text-sm">{crypto.name}</span>
                  <span className="text-xs inter-font-400 mb-2 text-gray-500 dark:text-gray-400">
                    {crypto.fullName}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="inter-font-400 text-sm">{crypto.value}</span>
                  <span
                    className={`text-xs ${
                      crypto.change.startsWith("+") ? "text-black dark:text-[#9F9FA0]" : "text-red-500 dark:text-white"
                    }`}
                  >
                    {crypto.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            History information would be displayed here
          </div>
        )}
      </div>
    </div>
  )
}