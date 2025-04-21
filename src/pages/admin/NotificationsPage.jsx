import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheckDouble,
  faTimes,
  faFilter,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from '../../components/admin/NotificationItem';

const NotificationsPage = () => {
  const { notifications, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(notification => notification.type === filter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(term) || 
        notification.message.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  // Get notification type counts
  const getTypeCounts = () => {
    const counts = { all: notifications.length };
    
    notifications.forEach(notification => {
      if (!counts[notification.type]) {
        counts[notification.type] = 0;
      }
      counts[notification.type]++;
    });
    
    return counts;
  };
  
  const typeCounts = getTypeCounts();
  
  // Get notification type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'order': return 'Orders';
      case 'inventory': return 'Inventory';
      case 'customer': return 'Customers';
      case 'review': return 'Reviews';
      case 'system': return 'System';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your notifications
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="mr-2 text-green-500" />
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2 text-red-500" />
            Clear all
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
                Filter:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === 'all' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All ({typeCounts.all || 0})
                </button>
                
                {Object.keys(typeCounts).filter(type => type !== 'all').map(type => (
                  <button
                    key={type}
                    className={`px-3 py-1 text-xs rounded-full ${
                      filter === type 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter(type)}
                  >
                    {getTypeLabel(type)} ({typeCounts[type]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications list */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <FontAwesomeIcon icon={faBell} className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'No notifications match your filters' 
                  : 'You don\'t have any notifications yet'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
