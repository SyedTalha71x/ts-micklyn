import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Star } from "react-feather";
import TotalBalance from "./total-balance";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

export default function CryptoTable({ onClose }) {
  const [activeTab, setActiveTab] = useState("watchlist");
  const [watchListData, setWatchListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const tabIndicatorRef = useRef(null);

  const getWatchlistData = async () => {
    try {
      setLoading(true);
      const res = await FireApi("/assets");
      console.log(res, "watchlist data");
      setWatchListData(res?.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to load the assets.");
      setWatchListData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    getWatchlistData();
  }, []);

  // Listen for watchlist refresh events
  useEffect(() => {
    // Method 1: Custom event listener (most reliable)
    const handleWatchlistRefresh = () => {
      console.log('🔄 Custom event detected - refreshing watchlist');
      getWatchlistData();
    };

    // Method 2: Storage event listener for cross-tab changes
    const handleStorageChange = (event) => {
      if (event.key === 'watchlist_needs_refresh' && event.newValue === 'true') {
        console.log('🔄 Storage event detected - refreshing watchlist');
        getWatchlistData();
        localStorage.setItem('watchlist_needs_refresh', 'false');
      }
    };

    // Method 3: Polling for same-window changes
    const intervalId = setInterval(() => {
      const needsRefresh = localStorage.getItem('watchlist_needs_refresh');
      if (needsRefresh === 'true') {
        console.log('🔄 Polling detected - refreshing watchlist');
        getWatchlistData();
        localStorage.setItem('watchlist_needs_refresh', 'false');
      }
    }, 1000); // Check every second

    window.addEventListener('watchlist-refresh', handleWatchlistRefresh);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('watchlist-refresh', handleWatchlistRefresh);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const toggleFavorite = async (symbol, chain, currentFavorite) => {
    try {
      await FireApi("/watchlist/add", "POST", {
        token: symbol,
        chain,
      });

      getWatchlistData();
      toast.success(
        `${symbol} ${currentFavorite ? "removed from" : "added to"} favorites`
      );
    } catch (error) {
      toast.error(error || "Failed to update favorite");
    }
  };

  const removeWatchlist = async (symbol, chain) => {
    try {
      await FireApi("/watchlist/remove", "POST", {
        token: symbol,
        chain,
      });
      getWatchlistData();
      toast.success(`${symbol} removed from watchlist`);
    } catch (error) {
      toast.error(error || "Failed to remove asset");
    }
  };

  const formatBalance = (balance) => {
    if (balance === "0" || balance === "0.0" || parseFloat(balance) === 0) {
      return "0.00";
    }
    return parseFloat(balance).toFixed(2);
  };

  // Filter favorites if needed
  const favoriteItems = watchListData.filter((item) => item.favorite === 1);

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
      {/* Tab Switcher */}
      <div className="relative flex flex-wrap cursor-pointer gap-2 p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md mb-4">
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
              : "text-gray-700 dark:text-gray-400"
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Loading assets...
                </p>
              </div>
            ) : watchListData.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                No assets found in your watchlist
              </div>
            ) : (
              <>
                {/* Favorites First */}
                {favoriteItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Favorites
                    </h3>
                    {favoriteItems.map((crypto) => (
                      <WatchlistItem
                        key={`${crypto.symbol}-${crypto.chain}`}
                        crypto={crypto}
                        onToggleFavorite={toggleFavorite}
                        onRemoveWatchlist={removeWatchlist}
                        formatBalance={formatBalance}
                      />
                    ))}
                  </div>
                )}

                {/* All Assets */}
                <div>
                  {favoriteItems.length > 0 && (
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      All Assets
                    </h3>
                  )}
                  {watchListData.map((crypto) => (
                    <WatchlistItem
                      key={`${crypto.symbol}-${crypto.chain}`}
                      crypto={crypto}
                      onToggleFavorite={toggleFavorite}
                      onRemoveWatchlist={removeWatchlist}
                      formatBalance={formatBalance}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "history" && <TotalBalance />}
      </div>
    </div>
  );
}

// Separate component for watchlist item - CORRECTED
const WatchlistItem = ({
  crypto,
  onToggleFavorite,
  onRemoveWatchlist,
  formatBalance,
}) => (
  <div className="flex justify-between items-center py-3 dark:border-b dark:border-[#505050]">
    <div className="flex items-center space-x-3">
      {/* Favorite Star */}
      <button
        onClick={() =>
          onToggleFavorite(crypto.symbol, crypto.chain, crypto.favorite)
        }
        className="p-1 hover:scale-110 transition-transform"
      >
        <Star
          size={16}
          className={
            crypto.favorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400"
          }
        />
      </button>

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
      <span
        onClick={() => onRemoveWatchlist(crypto.symbol, crypto.chain)}
        className="text-xs hover:text-red-500 cursor-pointer"
      >
        remove
      </span>
    </div>
  </div>
);