import React, { useState } from 'react';
import { FiUser, FiActivity, FiAward, FiShare2, FiDollarSign } from 'react-icons/fi';

const UserActivity = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  const activities = [
    { 
      id: 1, 
      user: 'Alex Johnson', 
      type: 'transaction', 
      details: 'Completed transaction #TX-7890', 
      reward: '10 tokens', 
      timestamp: '2023-05-15 14:30' 
    },
    { 
      id: 2, 
      user: 'Maria Garcia', 
      type: 'referral', 
      details: 'Referred James Smith', 
      reward: '50 tokens', 
      timestamp: '2023-05-15 12:45' 
    },
    { 
      id: 3, 
      user: 'James Smith', 
      type: 'social', 
      details: 'Shared on Twitter', 
      reward: '20 tokens', 
      timestamp: '2023-05-15 10:20' 
    },
    { 
      id: 4, 
      user: 'Sarah Williams', 
      type: 'task', 
      details: 'Completed "Daily Login" task', 
      reward: '10 tokens', 
      timestamp: '2023-05-14 18:15' 
    },
    { 
      id: 5, 
      user: 'David Lee', 
      type: 'transaction', 
      details: 'Completed transaction #TX-7889', 
      reward: '10 tokens', 
      timestamp: '2023-05-14 16:30' 
    },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'transaction': return <FiDollarSign className="text-blue-500" />;
      case 'referral': return <FiUser className="text-green-500" />;
      case 'social': return <FiShare2 className="text-purple-500" />;
      case 'task': return <FiAward className="text-amber-500" />;
      default: return <FiActivity className="text-gray-500" />;
    }
  };

  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Activity Tracking</h2>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Activities
        </button>
        <button
          onClick={() => setActiveTab('transaction')}
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'transaction' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'referral' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Referrals
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'social' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Social Media
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'task' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tasks
        </button>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-gray-500">{activity.details}</p>
              {activity.reward && (
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  {activity.reward}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredActivities.length} of {activities.length} activities
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

export default UserActivity;