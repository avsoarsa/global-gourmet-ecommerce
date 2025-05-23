import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { products } from '../../data/products';
import { formatDistanceToNow } from 'date-fns';

// Sample data for notifications
const generateRandomNotification = () => {
  const notificationTypes = [
    'purchase',
    'review',
    'signup',
  ];

  const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  const timeAgo = Math.floor(Math.random() * 30) + 1; // 1-30 minutes ago

  const locations = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
    'Toronto', 'Sydney', 'Tokyo', 'Singapore', 'Dubai'
  ];

  const location = locations[Math.floor(Math.random() * locations.length)];
  const timestamp = new Date(Date.now() - timeAgo * 60 * 1000);

  switch (type) {
    case 'purchase':
      return {
        id: Date.now(),
        type,
        message: `Someone from ${location} just purchased ${product.name}`,
        icon: faShoppingCart,
        iconColor: 'text-green-500',
        timestamp
      };
    case 'review':
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      return {
        id: Date.now(),
        type,
        message: `New ${rating}-star review for ${product.name}`,
        icon: faStar,
        iconColor: 'text-yellow-500',
        timestamp
      };
    case 'signup':
      return {
        id: Date.now(),
        type,
        message: `New customer just signed up from ${location}`,
        icon: faUser,
        iconColor: 'text-blue-500',
        timestamp
      };
    default:
      return null;
  }
};

const ActivityNotification = ({
  interval = 30000, // Default: show a notification every 30 seconds
  duration = 5000,  // Default: each notification stays for 5 seconds
  position = 'bottom-right',
  className = ''
}) => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const notificationRef = useRef(null);

  // Touch handling for swipe to dismiss
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Generate a new notification at the specified interval
  useEffect(() => {
    const timer = setInterval(() => {
      const newNotification = generateRandomNotification();
      if (newNotification) {
        setNotifications(prev => [...prev, newNotification]);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  // Show notifications one at a time
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      // Take the first notification from the queue
      const notification = notifications[0];
      setCurrentNotification(notification);
      setNotifications(prev => prev.slice(1));
      setIsVisible(true); // Reset visibility when showing a new notification
    }
  }, [notifications, currentNotification]);

  // Handle notification timeout
  useEffect(() => {
    let timer;
    let fadeTimer;

    if (currentNotification) {
      // Start fade-out animation 500ms before removing the notification
      fadeTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration - 500);

      // Remove the notification after the specified duration
      timer = setTimeout(() => {
        setCurrentNotification(null);
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [currentNotification, duration]);

  // Handle swipe to dismiss
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setTouchEnd(e.touches[0].clientX);

    // Apply real-time transform during swipe
    const distance = touchStart - e.touches[0].clientX;
    const swipeThreshold = 50;

    if (position.includes('right') && distance > 0) {
      // Left swipe for right-positioned notifications
      const translateX = Math.min(distance, 100);
      if (notificationRef.current) {
        notificationRef.current.style.transform = `translateX(-${translateX}px)`;
        notificationRef.current.style.opacity = `${1 - (translateX / 100)}`;
      }
    } else if (position.includes('left') && distance < 0) {
      // Right swipe for left-positioned notifications
      const translateX = Math.min(Math.abs(distance), 100);
      if (notificationRef.current) {
        notificationRef.current.style.transform = `translateX(${translateX}px)`;
        notificationRef.current.style.opacity = `${1 - (translateX / 100)}`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // For right-positioned notifications, dismiss on left swipe
    if (position.includes('right') && isLeftSwipe) {
      dismissNotification();
    }
    // For left-positioned notifications, dismiss on right swipe
    else if (position.includes('left') && isRightSwipe) {
      dismissNotification();
    } else {
      // Reset transform if swipe wasn't enough to dismiss
      if (notificationRef.current) {
        notificationRef.current.style.transform = '';
        notificationRef.current.style.opacity = '1';
      }
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  const dismissNotification = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 500);
  };

  // Don't render if no current notification
  if (!currentNotification) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-xs w-full ${className}`}>
      <div
        ref={notificationRef}
        className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500
          ${isVisible ? 'opacity-100' : 'opacity-0'} animate-slide-in`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${currentNotification.iconColor}`}>
              <FontAwesomeIcon icon={currentNotification.icon} className="h-6 w-6" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {currentNotification.message}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDistanceToNow(currentNotification.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none p-1"
                onClick={dismissNotification}
                aria-label="Close notification"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 pb-2 text-xs text-gray-500 text-center">
          Swipe to dismiss
        </div>
      </div>
    </div>
  );
};

export default ActivityNotification;
