import { products as productData } from '../data/products';
import { seedUsers as userData } from '../data/users';

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'uncategorized';

const buildProduct = (product) => {
  const createdAt = product.createdAt || new Date(Date.now() - randomInRange(1, 365) * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price) || 0,
    salePrice: Number(product.originalPrice) || null,
    stockQuantity: product.stockQuantity ?? randomInRange(20, 250),
    categories: [
      {
        id: slugify(product.category),
        name: product.category || 'Uncategorized'
      }
    ],
    primaryImage: product.image,
    isFeatured: Boolean(product.featured ?? product.featured === undefined ? product.rating > 4.7 : product.featured),
    isActive: true,
    createdAt,
    sku: product.sku || `SKU-${product.id}`,
    averageRating: product.rating || 0,
    totalReviews: product.reviews || 0
  };
};

const adminProducts = productData.map(buildProduct);

const adminUsers = userData.map((user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone || 'N/A',
  role: user.role || 'customer',
  totalOrders: user.orders?.length || 0,
  totalSpent: user.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
  loyaltyTier: user.loyalty?.tier || 'bronze',
  status: 'active',
  createdAt: user.createdAt || new Date(Date.now() - randomInRange(200, 600) * 24 * 60 * 60 * 1000).toISOString(),
  addresses: user.addresses || [],
  orders: user.orders || []
}));

const adminOrders = [];
adminUsers.forEach((user) => {
  user.orders.forEach((order) => {
    const items = order.items?.map((item) => {
      const product = adminProducts.find((p) => p.id === item.productId) || {};
      return {
        productId: item.productId,
        name: product.name || `Product ${item.productId}`,
        quantity: item.quantity,
        price: Number(item.price) || Number(product.price) || 0
      };
    }) || [];

    adminOrders.push({
      id: order.id,
      orderNumber: order.orderNumber || `ORD-${order.id}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      status: (order.status || 'processing').toLowerCase(),
      totalAmount: Number(order.total) || items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod: order.paymentMethod || 'Credit Card',
      shippingMethod: order.shippingMethod || 'Standard',
      createdAt: order.date || new Date().toISOString(),
      items
    });
  });
});

if (adminOrders.length === 0) {
  const fallbackOrder = {
    id: 1001,
    orderNumber: 'ORD-1001',
    userId: adminUsers[0]?.id || 1,
    userName: adminUsers[0] ? `${adminUsers[0].firstName} ${adminUsers[0].lastName}` : 'Demo User',
    userEmail: adminUsers[0]?.email || 'demo@example.com',
    status: 'processing',
    totalAmount: 120.5,
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express',
    createdAt: new Date().toISOString(),
    items: adminProducts.slice(0, 2).map((product) => ({
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price
    }))
  };
  adminOrders.push(fallbackOrder);
}

const paginate = (items, page = 1, pageSize = 20) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    total,
    totalPages,
    page: currentPage,
    pageSize
  };
};

const success = (data) => ({ success: true, data });
const failure = (error) => ({ success: false, error });

export const getDashboardStats = async () => {
  const totalRevenue = adminOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const completedOrders = adminOrders.filter((order) => order.status === 'delivered').length;
  const pendingOrders = adminOrders.filter((order) => order.status === 'pending').length;

  return success({
    userCount: adminUsers.length,
    orderCount: adminOrders.length,
    productCount: adminProducts.length,
    totalRevenue,
    completedOrders,
    pendingOrders,
    recentOrders: adminOrders
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        userName: order.userName,
        amount: order.totalAmount,
        status: order.status,
        date: order.createdAt
      })),
    topSellingProducts: adminProducts
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        totalQuantity: randomInRange(50, 250),
        totalRevenue: product.price * randomInRange(40, 120)
      }))
  });
};

export const getAdminProducts = async ({
  page = 1,
  pageSize = 20,
  sortBy = 'name',
  sortDesc = false,
  search = '',
  category = ''
} = {}) => {
  try {
    let items = [...adminProducts];

    if (search) {
      const query = search.toLowerCase();
      items = items.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    if (category) {
      const normalized = category.toLowerCase();
      items = items.filter((product) =>
        product.categories.some((cat) => cat.id === normalized || cat.name.toLowerCase() === normalized)
      );
    }

    items.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock_quantity':
          comparison = a.stockQuantity - b.stockQuantity;
          break;
        case 'created_at':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortDesc ? -comparison : comparison;
    });

    const { items: paginated, total, totalPages } = paginate(items, page, pageSize);

    return success({
      products: paginated,
      total,
      totalPages,
      page,
      pageSize
    });
  } catch (error) {
    return failure(error.message || 'Failed to load products');
  }
};

export const getAdminProduct = async (id) => {
  const product = adminProducts.find((item) => item.id === Number(id));
  if (!product) {
    return failure('Product not found');
  }
  return success(product);
};

export const updateProduct = async (id, updates = {}) => {
  const index = adminProducts.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return failure('Product not found');
  }

  adminProducts[index] = {
    ...adminProducts[index],
    ...updates,
    categories: updates.categories || adminProducts[index].categories
  };

  return success(adminProducts[index]);
};

export const deleteProduct = async (id) => {
  const index = adminProducts.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return failure('Product not found');
  }

  adminProducts.splice(index, 1);
  return success(true);
};

export const getAdminOrders = async ({
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortDesc = true,
  status = '',
  search = ''
} = {}) => {
  try {
    let items = [...adminOrders];

    if (status) {
      items = items.filter((order) => order.status === status);
    }

    if (search) {
      const query = search.toLowerCase();
      items = items.filter((order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query) ||
        order.userEmail.toLowerCase().includes(query)
      );
    }

    items.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'order_number':
          comparison = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case 'user_profiles.first_name':
          comparison = a.userName.localeCompare(b.userName);
          break;
        case 'total_amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortDesc ? -comparison : comparison;
    });

    const { items: paginated, total, totalPages } = paginate(items, page, pageSize);

    return success({
      orders: paginated,
      total,
      totalPages,
      page,
      pageSize
    });
  } catch (error) {
    return failure(error.message || 'Failed to load orders');
  }
};

export const getAdminOrderDetails = async (id) => {
  const order = adminOrders.find((item) => item.id === Number(id));
  if (!order) {
    return failure('Order not found');
  }
  return success(order);
};

export const updateOrderStatus = async (id, status) => {
  const index = adminOrders.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return failure('Order not found');
  }
  adminOrders[index] = { ...adminOrders[index], status };
  return success(adminOrders[index]);
};

export const getAdminUsers = async () => {
  return success({ users: adminUsers });
};

export const getUserDetails = async (id) => {
  const user = adminUsers.find((item) => item.id === Number(id));
  if (!user) {
    return failure('User not found');
  }
  return success(user);
};

export const updateUserProfile = async (id, updates = {}) => {
  const index = adminUsers.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return failure('User not found');
  }

  adminUsers[index] = {
    ...adminUsers[index],
    ...updates,
    addresses: updates.addresses || adminUsers[index].addresses,
    orders: updates.orders || adminUsers[index].orders
  };

  return success(adminUsers[index]);
};

const adminService = {
  getDashboardStats,
  getAdminProducts,
  getAdminProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  getAdminOrderDetails,
  updateOrderStatus,
  getAdminUsers,
  getUserDetails,
  updateUserProfile
};

export default adminService;
