import { FireApi } from '@/hooks/fireApi';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiSave,
  FiX
} from 'react-icons/fi';

const TokenManagement = () => {
  const [tokenData, setTokenData] = useState({
    chain: '',
    symbol: '',
    contract_address: '',
    coingecko_id: '',
    binance_symbol: '',
    dex_chain_id: '',
    dex_pair_address: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTokenData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setTokenData({
      chain: '',
      symbol: '',
      contract_address: '',
      coingecko_id: '',
      binance_symbol: '',
      dex_chain_id: '',
      dex_pair_address: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!tokenData.chain || !tokenData.symbol || !tokenData.contract_address) {
      setErrorMessage('Chain, Symbol, and Contract Address are required fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // API payload structure
      const payload = {
        chain: tokenData.chain,
        symbol: tokenData.symbol,
        contract_address: tokenData.contract_address,
        coingecko_id: tokenData.coingecko_id || null,
        binance_symbol: tokenData.binance_symbol || null,
        dex_chain_id: tokenData.dex_chain_id || null,
        dex_pair_address: tokenData.dex_pair_address || null
      };

      const res = await FireApi('/add-token', 'POST', payload);
      setSuccessMessage(res.message || 'Token added successfully!');
      toast.success(res.message || 'Token added successfully!');
      
      // Reset form and close modal
      resetForm();
      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
        toast.error(error.message || 'Failed to add token. Please try again.');
      setErrorMessage(error.message || 'Failed to add token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Token Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <FiPlus className="mr-2" /> Add Token
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Token Management</h3>
        <p className="text-blue-700 text-sm">
          Add new tokens to the system. Only the Chain, Symbol, and Contract Address fields are required. 
          Other fields are optional and can be added for enhanced functionality.
        </p>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FiPlus className="text-gray-400 text-2xl" />
        </div>
        <p className="text-gray-500 mb-6">Start by adding your token to the system.</p>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center mx-auto"
        >
          <FiPlus className="mr-2" /> Add Your Token
        </button>
      </div>

      {/* Add Token Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium">Add New Token</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Fields */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chain *
                  </label>
                  <input
                    type="text"
                    name="chain"
                    value={tokenData.chain}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., ETH, BSC, POLYGON"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Blockchain network</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    value={tokenData.symbol}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., USDT, BUSD"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Token symbol</p>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Address *
                  </label>
                  <input
                    type="text"
                    name="contract_address"
                    value={tokenData.contract_address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0x..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Token contract address on the blockchain</p>
                </div>

                {/* Optional Fields */}
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CoinGecko ID
                  </label>
                  <input
                    type="text"
                    name="coingecko_id"
                    value={tokenData.coingecko_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., tether"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: CoinGecko API identifier</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Binance Symbol
                  </label>
                  <input
                    type="text"
                    name="binance_symbol"
                    value={tokenData.binance_symbol}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., USDTUSDT"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: Binance trading pair symbol</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DEX Chain ID
                  </label>
                  <input
                    type="text"
                    name="dex_chain_id"
                    value={tokenData.dex_chain_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 1 for ETH, 56 for BSC"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: Chain ID for DEX operations</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DEX Pair Address
                  </label>
                  <input
                    type="text"
                    name="dex_pair_address"
                    value={tokenData.dex_pair_address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0x..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: Liquidity pool pair address</p>
                </div> */}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Token...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> 
                      Add Token
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;