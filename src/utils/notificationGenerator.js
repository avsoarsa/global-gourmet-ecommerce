import {
  generateOrderNotification,
  generateLowStockNotification,
  generateCustomerNotification,
  generateReviewNotification,
  generateSystemNotification
} from '../data/notifications';

/**
 * Generate a random notification for testing purposes
 * @returns {Object} A notification object
 */
export const generateRandomNotification = () => {
  const types = ['order', 'inventory', 'customer', 'review', 'system'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  switch (randomType) {
    case 'order':
      return generateOrderNotification({
        id: Math.floor(Math.random() * 10000),
        total: Math.random() * 200 + 50
      });
    
    case 'inventory':
      return generateLowStockNotification({
        name: getRandomProductName(),
        stock: Math.floor(Math.random() * 5) + 1
      });
    
    case 'customer':
      return generateCustomerNotification({
        id: Math.floor(Math.random() * 1000),
        firstName: getRandomFirstName(),
        lastName: getRandomLastName()
      });
    
    case 'review':
      return generateReviewNotification(
        {
          rating: Math.floor(Math.random() * 5) + 1
        },
        {
          id: Math.floor(Math.random() * 100),
          name: getRandomProductName()
        }
      );
    
    case 'system':
      return generateSystemNotification(
        getRandomSystemTitle(),
        getRandomSystemMessage()
      );
    
    default:
      return generateSystemNotification(
        'System Notification',
        'This is a test notification'
      );
  }
};

// Helper functions for generating random data
const getRandomProductName = () => {
  const products = [
    'Organic Almonds (500g)',
    'Premium Cashews (250g)',
    'Dried Apricots (300g)',
    'Medjool Dates (400g)',
    'Organic Walnuts (500g)',
    'Dried Cranberries (200g)',
    'Pistachios (300g)',
    'Mixed Nuts (450g)',
    'Dried Mango (250g)',
    'Organic Raisins (400g)'
  ];
  
  return products[Math.floor(Math.random() * products.length)];
};

const getRandomFirstName = () => {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Emily', 'David',
    'Sarah', 'Robert', 'Lisa', 'William', 'Emma'
  ];
  
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

const getRandomLastName = () => {
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
    'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'
  ];
  
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

const getRandomSystemTitle = () => {
  const titles = [
    'System Update',
    'Maintenance Scheduled',
    'Security Alert',
    'New Feature Available',
    'Performance Improvement'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

const getRandomSystemMessage = () => {
  const messages = [
    'The system will undergo maintenance on the upcoming weekend',
    'A new security update has been installed',
    'New features have been added to the admin dashboard',
    'Performance improvements have been made to the system',
    'Please update your password for security reasons'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export default {
  generateRandomNotification
};
