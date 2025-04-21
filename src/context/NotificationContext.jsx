import { createContext, useState, useContext, useEffect } from 'react';
import {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  addNotification
} from '../data/notifications';

// Create notification context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Load all notifications
  const loadNotifications = () => {
    const allNotifications = getAllNotifications();
    setNotifications(allNotifications);
    updateUnreadCount();
  };
  
  // Update unread count
  const updateUnreadCount = () => {
    const unreadNotifications = getUnreadNotifications();
    setUnreadCount(unreadNotifications.length);
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    markNotificationAsRead(id);
    loadNotifications();
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };
  
  // Delete a notification
  const removeNotification = (id) => {
    deleteNotification(id);
    loadNotifications();
  };
  
  // Clear all notifications
  const clearAll = () => {
    clearAllNotifications();
    loadNotifications();
  };
  
  // Add a new notification
  const addNewNotification = (notification) => {
    addNotification(notification);
    loadNotifications();
  };
  
  // Context value
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    addNewNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

export default NotificationContext;
