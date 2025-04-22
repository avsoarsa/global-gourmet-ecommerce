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
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../context/NotificationContext';
import { generateRandomNotification } from '../../utils/notificationGenerator';
import AnalyticsDashboard from '../../components/admin/analytics/AnalyticsDashboard';

// Sample data (in a real app, this would come from an API)
const sampleData = {
  stats: {
    totalSales: 12580.75,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 42
  },
  recentOrders: [
    { id: 1234, customer: 'John Doe', date: '2023-11-20', total: 125.99, status: 'Delivered' },
    { id: 1233, customer: 'Jane Smith', date: '2023-11-19', total: 89.50, status: 'Processing' },
    { id: 1232, customer: 'Bob Johnson', date: '2023-11-19', total: 210.75, status: 'Shipped' },
    { id: 1231, customer: 'Alice Brown', date: '2023-11-18', total: 45.25, status: 'Delivered' },
    { id: 1230, customer: 'Charlie Wilson', date: '2023-11-18', total: 178.50, status: 'Pending' }
  ],
  lowStockProducts: [
    { id: 101, name: 'Organic Almonds', stock: 5, threshold: 10 },
    { id: 203, name: 'Premium Cashews', stock: 3, threshold: 10 },
    { id: 305, name: 'Saffron Threads', stock: 2, threshold: 5 }
  ],
  salesChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [1200, 1900, 2100, 1800, 2400, 2800, 2600, 3100, 3400, 3800, 4200, 4500]
  }
};

// Stat Card Component
const StatCard = ({ title, value, icon, change, changeType }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>

          {change && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                <FontAwesomeIcon
                  icon={changeType === 'increase' ? faArrowUp : faArrowDown}
                  className="mr-1"
                />
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-900">
                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
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
const LowStockAlert = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="px-6 py-4 flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    Current stock: <span className="font-medium text-red-600">{product.stock}</span> (Threshold: {product.threshold})
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

      {products.length === 0 && (
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
const SalesChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
      </div>

      <div className="p-6">
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Chart would be displayed here (using a library like Chart.js or Recharts)
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNewNotification } = useNotifications();

  // Generate a test notification
  const handleGenerateNotification = () => {
    const notification = generateRandomNotification();
    addNewNotification(notification);
  };

  // Fetch data (simulated)
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setData(sampleData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
          value={`$${data.stats.totalSales.toLocaleString()}`}
          icon={faMoneyBillWave}
          change="12.5%"
          changeType="increase"
        />
        <StatCard
          title="Total Orders"
          value={data.stats.totalOrders}
          icon={faShoppingCart}
          change="8.2%"
          changeType="increase"
        />
        <StatCard
          title="Total Customers"
          value={data.stats.totalCustomers}
          icon={faUsers}
          change="5.1%"
          changeType="increase"
        />
        <StatCard
          title="Total Products"
          value={data.stats.totalProducts}
          icon={faBox}
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

      {/* Recent Orders */}
      <div className="mt-6">
        <RecentOrdersTable orders={data.recentOrders} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
