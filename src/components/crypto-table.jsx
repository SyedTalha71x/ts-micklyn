import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Star } from "react-feather";
import TotalBalance from "./total-balance";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { useProfile } from "@/Context/ProfileContext";

export default function CryptoTable({ onClose }) {
  const [activeTab, setActiveTab] = useState("watchlist");
  const contentRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const { watchListData, loading, getWatchlistData } = useProfile();
  const [openRow, setOpenRow] = useState(null);

  // Initial data load
  useEffect(() => {
    getWatchlistData();
  }, []);

  const removeWatchlist = async (symbol, chain) => {
    try {
      await FireApi("/watchlist/remove", "POST", {
        token: symbol,
        chain,
      });
      getWatchlistData();
      toast.success(`${symbol} removed from watchlist`);
      setOpenRow(null);
    } catch (error) {
      toast.error(error || "Failed to remove asset");
    }
  };

  const formatBalance = (balance) => {
    if (balance === "0" || balance === "0.0" || parseFloat(balance) === 0) {
      return "$ 0.00";
    }
    return parseFloat(balance).toFixed(2);
  };
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".watchlist-row")) {
        setOpenRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowClick = (cryptoId) => {
    setOpenRow(openRow === cryptoId ? null : cryptoId);
  };

  return (
    <div className="h-[94.5vh] 2xl:h-[96.5vh] border border-[#A0AEC0] dark:border-gray-600 p-2 rounded-xl bg-white dark:bg-[#101010] dark:text-white overflow-hidden flex flex-col">
      {/* Tab Switcher */}
      <div className="relative flex flex-wrap cursor-pointer gap-2 p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md mb-4 flex-shrink-0">
        <div
          ref={tabIndicatorRef}
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-300 dark:bg-[#232428] border-5 border-white dark:border-[#101010] rounded-lg"
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
              : "text-gray-700 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Animated Content */}
      <div className="px-4 flex-1 overflow-hidden" ref={contentRef}>
        {activeTab === "watchlist" && (
          <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
            {/* Hide scrollbar for Webkit browsers */}
            <style jsx>{`
              .space-y-4::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Loading assets...
                </p>
              </div>
            ) : watchListData.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                No favorite assets found in your watchlist
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {/* Only Favorites */}
                {watchListData.map((crypto) => (
                  <WatchlistItem
                    key={`${crypto.symbol}-${crypto.chain}`}
                    crypto={crypto}
                    onRemoveWatchlist={removeWatchlist}
                    formatBalance={formatBalance}
                    isOpen={openRow === crypto.symbol + crypto.chain}
                    onToggle={() => handleRowClick(crypto.symbol + crypto.chain)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
            {/* Hide scrollbar for Webkit browsers */}
            <style jsx>{`
              .md\\:max-h-\\[85vh\\]::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <TotalBalance />
          </div>
        )}
      </div>
    </div>
  );
}

const WatchlistItem = ({ crypto, onRemoveWatchlist, formatBalance, isOpen, onToggle }) => (
  <div 
    className="relative watchlist-row flex justify-between items-center py-3 dark:border-b dark:border-[#505050] cursor-pointer"
    onClick={onToggle}
  >
    <div className="flex items-center space-x-3">
      <div className="flex flex-col">
        <span className="inter-font-400 text-sm font-medium">
          {crypto.symbol}
        </span>
        <span className="text-xs inter-font-400 text-gray-500 dark:text-gray-400 capitalize">
          {crypto.chain.toLowerCase()}
        </span>
      </div>
    </div>

    <div className="flex flex-col items-end">
      <span className="inter-font-400 text-sm font-medium">
        {formatBalance(crypto.balance)}
      </span>
      <span className="text-xs text-gray-400">-23%</span>
    </div>

    {/* Dropdown Menu */}
    {isOpen && (
      <div className="absolute right-0 top-10 mt-0 w-44 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-md z-20">
        <ul className="py-1 text-sm">
          <li
            className="px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveWatchlist(crypto.symbol, crypto.chain);
            }}
          >
            Remove from Watchlist
          </li>
        </ul>
      </div>
    )}
  </div>
);