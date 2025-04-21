import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faExclamationTriangle,
  faUser,
  faStar,
  faCog,
  faCheck,
  faTimes,
  faBell,
  faEnvelope,
  faTag,
  faBoxOpen,
  faMoneyBill,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';

const NotificationItem = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotifications();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get icon based on notification type
  const getIcon = (type, iconName) => {
    if (iconName) {
      switch (iconName) {
        case 'shopping-cart': return faShoppingCart;
        case 'exclamation-triangle': return faExclamationTriangle;
        case 'user': return faUser;
        case 'star': return faStar;
        case 'cog': return faCog;
        case 'bell': return faBell;
        case 'envelope': return faEnvelope;
        case 'tag': return faTag;
        case 'box-open': return faBoxOpen;
        case 'money-bill': return faMoneyBill;
        case 'chart-line': return faChartLine;
        default: return faBell;
      }
    }
    
    // Default icons by type
    switch (type) {
      case 'order': return faShoppingCart;
      case 'inventory': return faExclamationTriangle;
      case 'customer': return faUser;
      case 'review': return faStar;
      case 'system': return faCog;
      default: return faBell;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-50';
      case 'inventory': return 'bg-yellow-50';
      case 'customer': return 'bg-green-50';
      case 'review': return 'bg-purple-50';
      case 'system': return 'bg-gray-50';
      default: return 'bg-gray-50';
    }
  };
  
  // Get icon color based on notification type
  const getIconColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-500';
      case 'inventory': return 'text-yellow-500';
      case 'customer': return 'text-green-500';
      case 'review': return 'text-purple-500';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  // Handle click on notification
  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };
  
  // Handle remove notification
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeNotification(notification.id);
  };
  
  return (
    <Link
      to={notification.link || '#'}
      className={`block ${notification.isRead ? '' : 'font-medium'} ${getBackgroundColor(notification.type)} hover:bg-gray-100 transition-colors duration-150`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start p-3 relative">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getBackgroundColor(notification.type)}`}>
          <FontAwesomeIcon 
            icon={getIcon(notification.type, notification.icon)} 
            className={`h-5 w-5 ${getIconColor(notification.type)}`} 
          />
        </div>
        <div className="ml-3 flex-1 pr-8">
          <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>
        
        {isHovered && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleRemove}
            title="Remove notification"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        )}
        
        {!notification.isRead && (
          <div className="absolute top-3 right-3 h-2 w-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </Link>
  );
};

export default NotificationItem;
