import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faUsers,
  faBox,
  faMoneyBillWave,
  faArrowUp,
  faArrowDown,
  faExclamationTriangle,
  faEye,
  faBell,
  faChartLine,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../context/NotificationContext';
import { generateRandomNotification } from '../../utils/notificationGenerator';
import AnalyticsDashboard from '../../components/admin/analytics/AnalyticsDashboard';
import adminService from '../../services/adminService';
import analyticsService from '../../services/analyticsService';
import { formatDate, formatCurrency, formatNumber } from '../../utils/formatters';

// Stat Card Component
const StatCard = ({ title, value, icon, change, changeType }) => {
  // Get icon and color based on change type
  const getChangeIcon = (type) => {
    switch (type) {
      case 'increase':
        return faArrowUp;
      case 'decrease':
        return faArrowDown;
      case 'warning':
        return faExclamationTriangle;
      default:
        return null;
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'neutral':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const changeIcon = getChangeIcon(changeType);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>

          {change && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                {changeIcon && (
                  <FontAwesomeIcon
                    icon={changeIcon}
                    className="mr-1"
                  />
                )}
                {change}
              </span>
              {changeType === 'increase' || changeType === 'decrease' ? (
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              ) : null}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-full ${
          title.includes('Sales') ? 'bg-green-100 text-green-600' :
          title.includes('Orders') ? 'bg-blue-100 text-blue-600' :
          title.includes('Customers') ? 'bg-purple-100 text-purple-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Recent Orders Table
const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-900">
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <Link to="/admin/orders" className="text-sm font-medium text-green-600 hover:text-green-500">
          View all orders
        </Link>
      </div>
    </div>
  );
};

// Low Stock Alert
const LowStockAlert = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="px-6 py-4 flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-full ${
                product.stock === 0 ? 'bg-red-100' : 'bg-orange-100'
              } flex items-center justify-center`}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className={`h-5 w-5 ${
                    product.stock === 0 ? 'text-red-600' : 'text-orange-600'
                  }`}
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    Current stock: <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-600' : 'text-orange-600'
                    }`}>{product.stock}</span> (Threshold: {product.threshold})
                  </p>
                </div>
                <Link to={`/admin/products/${product.id}`} className="text-sm font-medium text-green-600 hover:text-green-500">
                  Update
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="px-6 py-4 text-center text-gray-500">
          No low stock products
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200">
        <Link to="/admin/inventory" className="text-sm font-medium text-green-600 hover:text-green-500">
          View inventory
        </Link>
      </div>
    </div>
  );
};

// Sales Chart (placeholder - in a real app, use a charting library)
const SalesChart = ({ data = { labels: [], data: [] } }) => {
  // Check if we have data to display
  const hasData = data.labels && data.labels.length > 0 && data.data && data.data.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
      </div>

      <div className="p-6">
        {hasData ? (
          <div className="h-64 bg-gray-50 rounded-lg">
            {/* Simple chart visualization (in a real app, use a proper chart library) */}
            <div className="h-full flex items-end justify-around p-4">
              {data.data.map((value, index) => {
                // Calculate height percentage (max 90%)
                const maxValue = Math.max(...data.data);
                const heightPercent = maxValue > 0 ? (value / maxValue) * 90 : 0;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-green-500 rounded-t"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">
                      {data.labels[index]}
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {formatCurrency(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              No sales data available for the selected period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNewNotification } = useNotifications();

  // Generate a test notification
  const handleGenerateNotification = () => {
    const notification = generateRandomNotification();
    addNewNotification(notification);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get dashboard stats
        const { success, data: dashboardData, error: dashboardError } = await adminService.getDashboardStats();

        if (!success) {
          throw new Error(dashboardError || 'Failed to fetch dashboard data');
        }

        // Get analytics data
        const { success: analyticsSuccess, data: analyticsData, error: analyticsError } =
          await analyticsService.getAnalyticsData('monthly');

        if (!analyticsSuccess) {
          console.warn('Failed to fetch analytics data:', analyticsError);
          // Continue without analytics data
        }

        // Format the data
        setData({
          stats: {
            totalSales: dashboardData.totalRevenue,
            totalOrders: dashboardData.orderCount,
            totalCustomers: dashboardData.userCount,
            totalProducts: dashboardData.productCount,
            completedOrders: dashboardData.completedOrders,
            pendingOrders: dashboardData.pendingOrders
          },
          recentOrders: dashboardData.recentOrders || [],
          topSellingProducts: dashboardData.topSellingProducts || [],
          lowStockProducts: [], // We'll fetch this separately
          salesChart: analyticsSuccess ? {
            labels: analyticsData.salesByDay.map(day => day.date),
            data: analyticsData.salesByDay.map(day => day.value)
          } : {
            labels: [],
            data: []
          }
        });

        // Get low stock products
        fetchLowStockProducts();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        // Get products with low stock
        const { success, data: productsData, error: productsError } =
          await adminService.getAdminProducts({
            page: 1,
            pageSize: 10,
            sortBy: 'stock_quantity',
            sortDesc: false
          });

        if (!success) {
          console.warn('Failed to fetch low stock products:', productsError);
          return;
        }

        // Filter products with low stock
        const lowStockProducts = productsData.products
          .filter(product => product.stockQuantity < 10)
          .map(product => ({
            id: product.id,
            name: product.name,
            stock: product.stockQuantity,
            threshold: 10 // This would ideally come from product settings
          }))
          .slice(0, 5); // Limit to 5 products

        // Update data with low stock products
        setData(prevData => ({
          ...prevData,
          lowStockProducts
        }));
      } catch (error) {
        console.warn('Error fetching low stock products:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-green-500 text-4xl mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to="/admin/analytics"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Full Analytics
          </Link>
          <button
            onClick={handleGenerateNotification}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            Generate Test Notification
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(data.stats.totalSales)}
          icon={faMoneyBillWave}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(data.stats.totalOrders)}
          icon={faShoppingCart}
          change={`${data.stats.pendingOrders} pending`}
          changeType="neutral"
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(data.stats.totalCustomers)}
          icon={faUsers}
        />
        <StatCard
          title="Total Products"
          value={formatNumber(data.stats.totalProducts)}
          icon={faBox}
          change={data.lowStockProducts?.length > 0 ? `${data.lowStockProducts.length} low stock` : null}
          changeType="warning"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={data.salesChart} />
        </div>
        <div>
          <LowStockAlert products={data.lowStockProducts} />
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={data.recentOrders} />
        </div>
        <div>
          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {data.topSellingProducts && data.topSellingProducts.length > 0 ? (
                data.topSellingProducts.map((product, index) => (
                  <div key={product.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {formatNumber(product.totalQuantity)} sold | {formatCurrency(product.totalRevenue)}
                            </p>
                          </div>
                          <Link to={`/admin/products/${product.id}`} className="text-sm font-medium text-green-600 hover:text-green-500">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">
                  No sales data available
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Link to="/admin/analytics" className="text-sm font-medium text-green-600 hover:text-green-500">
                View all analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
