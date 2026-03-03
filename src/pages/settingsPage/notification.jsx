import { useState, useEffect } from 'react';
import { Card4, CardContent } from '@/components/ui/card';
import { useTheme } from '@/Context/ThemeContext';
import { FireApi } from '@/hooks/fireApi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('settings'); 
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FireApi("/notifications/read", "GET");
      
      if (response && response.success) {
        setNotifications(response.notifications || []);
        // Calculate unread count
        const unread = response.notifications.filter(n => n.is_seen === 0).length;
        setUnreadCount(unread);
      } else {
        throw new Error(response?.message || t('errors.fetchFailed'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || t('errors.fetchFailed'));
      toast.error(err.message || t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as seen
  const markAsSeen = async (id = null) => {
    try {
      setLoading(true);
      setError(null);
      await FireApi('/notifications/seen', 'PATCH', id ? { id } : {});
      
      // Success message
      if (id) {
        toast.success(t('success.markedOne'));
      } else {
        toast.success(t('success.markedAll'));
      }
      
      // Refresh to confirm
      await fetchNotifications();
    } catch (err) {
      console.error('Mark as seen error:', err);
      setError(err.message || t('errors.markFailed'));
      toast.error(err.message || t('errors.markFailed'));
      // Revert optimistic update on error
      fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  // Delete notifications
  const deleteNotification = async (id = null) => {
    try {
      setLoading(true);
      setError(null);
      await FireApi('/notifications/delete', 'DELETE', id ? { id } : {});
      
      // Success message
      if (id) {
        toast.success(t('success.deletedOne'));
      } else {
        toast.success(t('success.deletedAll'));
      }
      
      // Refresh to confirm
      await fetchNotifications();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || t('errors.deleteFailed'));
      toast.error(err.message || t('errors.deleteFailed'));
      // Revert optimistic update on error
      fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card4 className="w-full max-w-2xl">
      <CardContent className="md:py-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold dark:text-white">{t('notifications.title')}</h2>
              {unreadCount > 0 && (
                <span className="bg-black dark:bg-[#1e1f22] text-white text-xs px-2 py-1 rounded-full">
                  {t('notifications.unread', { count: unreadCount })}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => markAsSeen()}
                className="px-3 py-1 text-sm bg-black dark:bg-[#1e1f22] text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                disabled={loading || unreadCount === 0}
              >
                {t('notifications.markAllAsRead')}
              </button>
              <button
                onClick={() => deleteNotification()}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                disabled={loading || notifications.length === 0}
              >
                {t('notifications.clearAll')}
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{t('notifications.loading')}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={fetchNotifications}
                className="ml-2 text-sm underline hover:no-underline"
              >
                {t('notifications.retry')}
              </button>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('notifications.noNotifications')}
            </div>
          )}

          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.is_seen === 1
                    ? 'bg-gray-50 dark:bg-[#232428] border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-[#1e1f22] border-gray-200 dark:border-gray-800 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium dark:text-white">{notification.title}</h3>
                      {notification.is_seen === 0 && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.body}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {notification.topic}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {notification.is_seen === 0 && (
                      <button
                        onClick={() => markAsSeen(notification.id)}
                        className="text-xs text-white dark:bg-[#1e1f22] bg-black py-1 px-2 rounded-sm hover:opacity-80 disabled:opacity-50 transition"
                        disabled={loading}
                      >
                        {t('notifications.markAsRead')}
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-white bg-red-500 py-1 px-2 rounded-sm hover:bg-red-600 disabled:opacity-50 transition"
                      disabled={loading}
                    >
                      {t('notifications.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card4>
  );
};

export default NotificationsPage;