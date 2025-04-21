// Sample notifications data
export const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #1234 has been placed for $156.78',
    isRead: false,
    createdAt: '2023-07-15T10:30:00Z',
    link: '/admin/orders/1234',
    icon: 'shopping-cart'
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Organic Almonds (500g) is running low on stock (3 remaining)',
    isRead: false,
    createdAt: '2023-07-14T15:45:00Z',
    link: '/admin/inventory',
    icon: 'exclamation-triangle'
  },
  {
    id: 3,
    type: 'customer',
    title: 'New Customer Registration',
    message: 'John Doe has created a new account',
    isRead: true,
    createdAt: '2023-07-13T09:20:00Z',
    link: '/admin/customers/45',
    icon: 'user'
  },
  {
    id: 4,
    type: 'review',
    title: 'New Product Review',
    message: 'New 4-star review for Organic Cashews (250g)',
    isRead: true,
    createdAt: '2023-07-12T14:10:00Z',
    link: '/admin/products/12',
    icon: 'star'
  },
  {
    id: 5,
    type: 'system',
    title: 'System Update',
    message: 'The system will undergo maintenance on July 20th at 2:00 AM',
    isRead: true,
    createdAt: '2023-07-10T11:00:00Z',
    link: '/admin/settings',
    icon: 'cog'
  }
];

// Get all notifications
export const getAllNotifications = () => {
  return [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
};

// Get unread notifications
export const getUnreadNotifications = () => {
  return notifications.filter(notification => !notification.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get notification by ID
export const getNotificationById = (id) => {
  return notifications.find(notification => notification.id === id);
};

// Mark notification as read
export const markNotificationAsRead = (id) => {
  const notification = getNotificationById(id);
  if (notification) {
    notification.isRead = true;
    return notification;
  }
  return null;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => {
  notifications.forEach(notification => {
    notification.isRead = true;
  });
  return getAllNotifications();
};

// Delete notification
export const deleteNotification = (id) => {
  const index = notifications.findIndex(notification => notification.id === id);
  if (index !== -1) {
    const deletedNotification = notifications[index];
    notifications.splice(index, 1);
    return deletedNotification;
  }
  return null;
};

// Clear all notifications
export const clearAllNotifications = () => {
  notifications.length = 0;
  return [];
};

// Add new notification
export const addNotification = (notification) => {
  const newNotification = {
    ...notification,
    id: Math.max(...notifications.map(n => n.id), 0) + 1,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.unshift(newNotification);
  return newNotification;
};

// Generate order notification
export const generateOrderNotification = (order) => {
  return addNotification({
    type: 'order',
    title: 'New Order Received',
    message: `Order #${order.id} has been placed for $${order.total.toFixed(2)}`,
    link: `/admin/orders/${order.id}`,
    icon: 'shopping-cart'
  });
};

// Generate low stock notification
export const generateLowStockNotification = (product) => {
  return addNotification({
    type: 'inventory',
    title: 'Low Stock Alert',
    message: `${product.name} is running low on stock (${product.stock} remaining)`,
    link: '/admin/inventory',
    icon: 'exclamation-triangle'
  });
};

// Generate customer notification
export const generateCustomerNotification = (customer) => {
  return addNotification({
    type: 'customer',
    title: 'New Customer Registration',
    message: `${customer.firstName} ${customer.lastName} has created a new account`,
    link: `/admin/customers/${customer.id}`,
    icon: 'user'
  });
};

// Generate review notification
export const generateReviewNotification = (review, product) => {
  return addNotification({
    type: 'review',
    title: 'New Product Review',
    message: `New ${review.rating}-star review for ${product.name}`,
    link: `/admin/products/${product.id}`,
    icon: 'star'
  });
};

// Generate system notification
export const generateSystemNotification = (title, message) => {
  return addNotification({
    type: 'system',
    title,
    message,
    link: '/admin/settings',
    icon: 'cog'
  });
};

export default {
  getAllNotifications,
  getUnreadNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  addNotification,
  generateOrderNotification,
  generateLowStockNotification,
  generateCustomerNotification,
  generateReviewNotification,
  generateSystemNotification
};
