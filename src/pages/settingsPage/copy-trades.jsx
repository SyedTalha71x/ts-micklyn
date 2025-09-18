import React, { useState, useEffect } from "react";
import {
  FiCopy,
  FiExternalLink,
  FiFilter,
  FiSearch,
  FiPlay,
  FiStopCircle,
  FiDollarSign,
} from "react-icons/fi";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

const CopyTrades = () => {
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchCopyTrades = async () => {
    try {
      setLoading(true);
      const response = await FireApi("/list-copy-trades", "GET");

      if (response.success) {
        setCopyTrades(response.copy_trades);
      } else {
        setError(response.message || "Failed to fetch copy trades");
        toast.error(response.message || "Failed to fetch copy trades");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCopyTrades();
  }, []);

  // Filter copy trades based on search and filter
  const filteredCopyTrades = copyTrades.filter((trade) => {
    const matchesSearch =
      trade.traderAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.chain?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && trade.isActive === 1) ||
      (filter === "inactive" && trade.isActive === 0);

    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (isActive) => {
    return isActive === 1 ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full flex items-center">
        <FiPlay className="mr-1" size={12} /> Active
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full flex items-center">
        <FiStopCircle className="mr-1" size={12} /> Inactive
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const shortenAddress = (address) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-[#232428]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-[#232428] dark:text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Copy Trading History
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search traders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-[#2a2b32] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-[#2a2b32] dark:border-gray-600 dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Trades</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiFilter className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-[#2a2b32]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Trader Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Chain
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Amount (USD)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Started
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Stopped
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#232428] dark:divide-gray-700">
            {filteredCopyTrades.length > 0 ? (
              filteredCopyTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2b32]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {shortenAddress(trade.traderAddress)}
                      </div>
                      <button
                        onClick={() => copyToClipboard(trade.traderAddress)}
                        className="ml-2 text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                        title="Copy address"
                      >
                        <FiCopy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                    {trade.chain.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-500 dark:text-green-400 mr-1" size={14} />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {parseFloat(trade.copyAmountUSD).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trade.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(trade.start_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(trade.stop_time) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Stop
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No copy trades found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination would go here */}
      {filteredCopyTrades.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredCopyTrades.length} of {copyTrades.length} copy trades
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-white"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-white"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTrades;