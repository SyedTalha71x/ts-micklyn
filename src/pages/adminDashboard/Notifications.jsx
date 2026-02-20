import React, { useState } from 'react';
import { FiBell, FiCheck, FiTrash2, FiSettings, FiAlertCircle, FiUser, FiDollarSign, FiShare2 } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'New User Registration', 
      message: 'Alex Johnson has just registered an account', 
      type: 'user', 
      time: '2 minutes ago', 
      read: false 
    },
    { 
      id: 2, 
      title: 'Transaction Completed', 
      message: 'Transaction #TX-7890 has been completed successfully', 
      type: 'transaction', 
      time: '1 hour ago', 
      read: false 
    },
    { 
      id: 3, 
      title: 'Referral Reward Claimed', 
      message: 'Maria Garcia has claimed her referral reward', 
      type: 'referral', 
      time: '3 hours ago', 
      read: true 
    },
    { 
      id: 4, 
      title: 'Social Media Share', 
      message: 'James Smith has shared on Twitter', 
      type: 'social', 
      time: '5 hours ago', 
      read: true 
    },
    { 
      id: 5, 
      title: 'System Alert', 
      message: 'Scheduled maintenance tomorrow at 2:00 AM UTC', 
      type: 'system', 
      time: '1 day ago', 
      read: true 
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    sound: true,
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const handleSettingChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'user': return <FiUser className="text-blue-500" />;
      case 'transaction': return <FiDollarSign className="text-green-500" />;
      case 'referral': return <FiUser className="text-purple-500" />;
      case 'social': return <FiShare2 className="text-amber-500" />;
      case 'system': return <FiAlertCircle className="text-red-500" />;
      default: return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Notifications & Alerts</h2>
        <div className="flex flex-wrap space-x-3">
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
          <button
            onClick={deleteAll}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg ${notification.read ? 'bg-white border-gray-200' : 'bg-indigo-50 border-indigo-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-indigo-800'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <FiCheck size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No notifications available
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <FiSettings className="text-indigo-600 mr-2" />
              <h3 className="font-medium">Notification Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Email Notifications</label>
                <button
                  onClick={() => handleSettingChange('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notificationSettings.email ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Push Notifications</label>
                <button
                  onClick={() => handleSettingChange('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notificationSettings.push ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">SMS Alerts</label>
                <button
                  onClick={() => handleSettingChange('sms')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notificationSettings.sms ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.sms ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Sound Alerts</label>
                <button
                  onClick={() => handleSettingChange('sound')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notificationSettings.sound ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Alert Types</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 cursor-pointer" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Transaction Alerts</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 cursor-pointer" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Referral Alerts</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 cursor-pointer" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Social Media Alerts</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 cursor-pointer" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">System Alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;