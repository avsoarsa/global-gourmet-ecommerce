import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheck,
  faTimes,
  faEllipsisH,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);
  const actionsRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        (!actionsRef.current || !actionsRef.current.contains(event.target))
      ) {
        setIsOpen(false);
        setShowActions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setShowActions(false);
  };
  
  // Toggle actions menu
  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    markAllAsRead();
    setShowActions(false);
  };
  
  // Handle clear all notifications
  const handleClearAll = (e) => {
    e.stopPropagation();
    clearAll();
    setShowActions(false);
  };
  
  return (
    <div className="relative">
      {/* Bell icon button */}
      <button
        className="relative p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">View notifications</span>
        <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
        
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        >
          <div className="py-1">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              <div className="flex items-center">
                {/* Actions button */}
                <button
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={toggleActions}
                >
                  <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
                </button>
                
                {/* Actions dropdown */}
                {showActions && (
                  <div
                    ref={actionsRef}
                    className="absolute right-0 top-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={handleMarkAllAsRead}
                      >
                        <FontAwesomeIcon icon={faCheckDouble} className="mr-2 text-green-500" />
                        Mark all as read
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={handleClearAll}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-2 text-red-500" />
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-2">
                <Link
                  to="/admin/notifications"
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
