import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { FireApi } from '@/hooks/fireApi';
import toast from 'react-hot-toast';

const TransferToken = () => {
  const [formData, setFormData] = useState({
    senderAddress: import.meta.env.VITE_WALLET_ADDRESS,
    senderSecretKey: import.meta.env.VITE_SECRET_KEY,
    receiverAddress: '',
    amount: '',
    token: 'USDC',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await FireApi('/transfer-token', 'POST', {
        sender: {
          address: formData.senderAddress,
          secretKey: formData.senderSecretKey,
        },
        receiver: formData.receiverAddress,
        amount: formData.amount,
        token: formData.token,
      });

      toast.success('Token transfer successful!');
      setFormData({
        receiverAddress: '',
        amount: '',
      });
      setMessage(response.transactionHash);
    } catch (error) {
      console.error('Error transferring token:', error);
      toast.error(error.message || 'Failed to transfer token');
    } finally {
      setLoading(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    if (message) {
      navigator.clipboard.writeText(message).then(() => {
        toast.success('Transaction hash copied to clipboard!');
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 dark:bg-[#2A2B2E] rounded-md shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold text-center mb-4">Transfer Token</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Receiver Address</label>
          <input
            type="text"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter receiver address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Token</label>
          <select
            name="token"
            value={formData.token}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin w-6 h-6 mx-auto" /> : 'Transfer Token'}
          </button>
        </div>
      </form>

      {message && (
        <p
          className="mt-4 text-center text-sm font-medium text-gray-700 cursor-pointer flex flex-wrap"
          onClick={copyToClipboard}
        >
          {message} (Click to copy)
        </p>
      )}
    </div>
  );
};

export default TransferToken;
