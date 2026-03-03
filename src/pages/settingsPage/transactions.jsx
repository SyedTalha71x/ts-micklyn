import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiCopy, FiExternalLink, FiFilter, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { FireApi } from '@/hooks/fireApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Transactions = () => {
  const { t } = useTranslation('settings');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const location = useLocation();
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);        
      const response = await FireApi(`/transactions`, 'GET');
      
      if (response.success) {
        setTransactions(response.transactions);
      } else {
        setError(response.message || t('transactions.messages.fetchFailed'));
        toast.error(response.message || t('transactions.messages.fetchFailed'));
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || t('transactions.messages.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [location.search]);

  // Filter transactions based on search and filter
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && tx.status === 0) ||
      (filter === 'completed' && tx.status === 1);
    
    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(t('transactions.messages.copied'));
  };

  const getTransactionTypeIcon = (type) => {
    switch(type?.toUpperCase()) {
      case 'TRANSFER': return <FiArrowUp className="text-blue-500 dark:text-blue-400" />;
      case 'DEPOSIT': return <FiArrowDown className="text-green-500 dark:text-green-400" />;
      default: return <FiArrowUp className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch(type?.toUpperCase()) {
      case 'TRANSFER': return t('transactions.type.transfer');
      case 'DEPOSIT': return t('transactions.type.deposit');
      default: return type?.toLowerCase() || '';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 0: 
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
            {t('transactions.status.pending')}
          </span>
        );
      case 1: 
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
            {t('transactions.status.completed')}
          </span>
        );
      default: 
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
            {t('transactions.status.unknown')}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const shortenAddress = (address) => {
    if (!address) return 'N/A';
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
    <div className="bg-white rounded-lg shadow p-4 md:p-6 dark:bg-[#232428] dark:text-white">
      <div className="flex flex-wrap flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {t('transactions.title')}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={t('transactions.searchPlaceholder')}
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
              <option value="all">{t('transactions.filterAll')}</option>
              <option value="pending">{t('transactions.filterPending')}</option>
              <option value="completed">{t('transactions.filterCompleted')}</option>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.type')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.from')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.to')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.amount')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.token')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.chain')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.status')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t('transactions.table.date')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#232428] dark:divide-gray-700">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2b32]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getTransactionTypeIcon(tx.type)}
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {getTransactionTypeLabel(tx.type)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {shortenAddress(tx.address)}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(tx.address)}
                        className="ml-2 text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                        title={t('transactions.tooltips.copyAddress')}
                      >
                        <FiCopy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {shortenAddress(tx.receiver)}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(tx.receiver)}
                        className="ml-2 text-gray-400 hover:text-indigo-600 dark:hover:text-gray-300"
                        title={t('transactions.tooltips.copyAddress')}
                      >
                        <FiCopy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {parseFloat(tx.amount).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white uppercase">
                    {tx.token || t('transactions.token.native')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                    {tx.chain?.toLowerCase() || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(tx.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('transactions.messages.noTransactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination would go here */}
      {filteredTransactions.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('transactions.messages.showing', { 
              count: filteredTransactions.length, 
              total: transactions.length 
            })}
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-white" 
              disabled
            >
              {t('transactions.messages.previous')}
            </button>
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 dark:border-gray-600 dark:text-white" 
              disabled
            >
              {t('transactions.messages.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;