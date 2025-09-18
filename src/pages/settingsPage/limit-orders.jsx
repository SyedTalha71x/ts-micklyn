import React, { useState, useEffect } from "react";
import {
  FiCopy,
  FiExternalLink,
  FiFilter,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

const LimitOrders = () => {
  const [limitOrders, setLimitOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchLimitOrders = async () => {
    try {
      setLoading(true);
      const response = await FireApi("/list-limit-orders", "GET");

      if (response.success) {
        setLimitOrders(response.limit_orders);
      } else {
        setError(response.message || "Failed to fetch limit orders");
        toast.error(response.message || "Failed to fetch limit orders");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimitOrders();
  }, []);

  // Filter limit orders based on search and filter
  const filteredLimitOrders = limitOrders.filter((order) => {
    const matchesSearch =
      order.token_symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.chain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "buy" && order.order_type === "buy") ||
      (filter === "sell" && order.order_type === "sell") ||
      (filter === "pending" && order.status === "PENDING") ||
      (filter === "filled" && order.status === "FILLED") ||
      (filter === "cancelled" && order.status === "CANCELLED");

    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (status, error) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </span>
        );
      case "FILLED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">
            Filled
          </span>
        );
      case "CANCELLED":
        return (
          <div className="flex flex-col">
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900 dark:text-red-200">
              Cancelled
            </span>
            {error && (
              <span className="text-xs text-red-500 dark:text-red-400 mt-1">
                {error}
              </span>
            )}
          </div>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>
        );
    }
  };

  const getOrderTypeBadge = (type) => {
    return type === "buy" ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center dark:bg-blue-900 dark:text-blue-200">
        <FiArrowDown className="mr-1" size={12} /> Buy
      </span>
    ) : (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center dark:bg-purple-900 dark:text-purple-200">
        <FiArrowUp className="mr-1" size={12} /> Sell
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
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-[#232428] dark:text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Limit Orders
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search by token or chain..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="buy">Buy Orders</option>
              <option value="sell">Sell Orders</option>
              <option value="pending">Pending</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiFilter className="text-gray-400 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Token
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Chain
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Limit Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Executed
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Wallet
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#232428] dark:divide-gray-700">
            {filteredLimitOrders.length > 0 ? (
              filteredLimitOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getOrderTypeBadge(order.order_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase dark:text-white">
                    {order.token_symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize dark:text-gray-200">
                    {order.chain.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    ${parseFloat(order.limit_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {parseFloat(order.token_amount).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status, order.error)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(order.executed_at) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 font-mono dark:text-gray-200">
                        {shortenAddress(order.wallet_address)}
                      </div>
                      <button
                        onClick={() => copyToClipboard(order.wallet_address)}
                        className="ml-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Copy address"
                      >
                        <FiCopy size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No limit orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination would go here */}
      {filteredLimitOrders.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredLimitOrders.length} of {limitOrders.length} orders
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
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

export default LimitOrders;