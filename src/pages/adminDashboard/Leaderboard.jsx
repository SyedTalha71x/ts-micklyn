import React, { useState } from 'react';
import { FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';

const Leaderboard = () => {
  const users = [
    { id: 1, name: 'Alex Johnson', points: 1250, rank: 1, transactions: 42, referrals: 8 },
    { id: 2, name: 'Maria Garcia', points: 1120, rank: 2, transactions: 38, referrals: 7 },
    { id: 3, name: 'James Smith', points: 980, rank: 3, transactions: 35, referrals: 5 },
    { id: 4, name: 'Sarah Williams', points: 875, rank: 4, transactions: 32, referrals: 4 },
    { id: 5, name: 'David Lee', points: 820, rank: 5, transactions: 30, referrals: 3 },
    { id: 6, name: 'Emma Davis', points: 790, rank: 6, transactions: 28, referrals: 3 },
    { id: 7, name: 'Michael Brown', points: 745, rank: 7, transactions: 27, referrals: 2 },
    { id: 8, name: 'Olivia Wilson', points: 710, rank: 8, transactions: 25, referrals: 2 },
    { id: 9, name: 'Daniel Martinez', points: 680, rank: 9, transactions: 24, referrals: 1 },
    { id: 10, name: 'Sophia Anderson', points: 650, rank: 10, transactions: 23, referrals: 1 },
  ];

  const timePeriods = ['Today', 'This Week', 'This Month', 'All Time'];
  const [activePeriod, setActivePeriod] = useState('This Week');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        <div className="flex space-x-2">
          {timePeriods.map(period => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1 text-sm rounded-md ${activePeriod === period ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rank <= 3 ? (
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                        ${user.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                          user.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                          'bg-amber-100 text-amber-600'}`}
                      >
                        <FiAward className="text-lg" />
                      </div>
                    ) : (
                      <div className="text-gray-500 font-medium">{user.rank}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiTrendingUp className="text-green-500 mr-1" />
                    <span className="font-medium">{user.points}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.transactions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.referrals}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to 10 of 42 users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;