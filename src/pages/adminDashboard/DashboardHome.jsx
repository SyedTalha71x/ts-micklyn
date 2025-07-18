import React from 'react';
import { FiAward, FiList, FiUsers, FiActivity, FiBell } from 'react-icons/fi';

const stats = [
  { name: 'Total Rewards Distributed', value: '12,450', icon: FiAward, change: '+12%', changeType: 'positive' },
  { name: 'Active Tasks', value: '24', icon: FiList, change: '+3', changeType: 'positive' },
  { name: 'Active Users', value: '1,234', icon: FiUsers, change: '-2%', changeType: 'negative' },
  { name: 'Daily Activities', value: '342', icon: FiActivity, change: '+24%', changeType: 'positive' },
  { name: 'Unread Notifications', value: '15', icon: FiBell, change: '+5', changeType: 'positive' },
];

const DashboardHome = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <stat.icon className="text-indigo-600" />
              </div>
            </div>
            <div className={`mt-2 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} {stat.changeType === 'positive' ? '↑' : '↓'}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-4">Recent Rewards</h3>
          {/* Placeholder for rewards chart */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Rewards Distribution Chart
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-4">User Activity</h3>
          {/* Placeholder for activity chart */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Activity Over Time Chart
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;