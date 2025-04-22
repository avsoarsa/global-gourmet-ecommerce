import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faShoppingCart,
  faChartPie,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import AnalyticsDashboard from '../../components/admin/analytics/AnalyticsDashboard';
import UserBehaviorAnalytics from '../../components/admin/analytics/UserBehaviorAnalytics';
import SalesAnalytics from '../../components/admin/analytics/SalesAnalytics';

// Sample analytics data (in a real app, this would come from an API)
const sampleData = {
  salesOverview: {
    daily: 1250.75,
    weekly: 8750.50,
    monthly: 35250.25,
    yearly: 425000.00,
    dailyChange: 12.5,
    weeklyChange: 8.2,
    monthlyChange: 15.3,
    yearlyChange: 22.1
  },
  salesByCategory: [
    { category: 'Nuts', sales: 12500, percentage: 35 },
    { category: 'Dried Fruits', sales: 9800, percentage: 27 },
    { category: 'Spices', sales: 7200, percentage: 20 },
    { category: 'Seeds', sales: 3600, percentage: 10 },
    { category: 'Superfoods', sales: 1800, percentage: 5 },
    { category: 'Gift Boxes', sales: 1100, percentage: 3 }
  ],
  topProducts: [
    { id: 1, name: 'Organic Almonds', sales: 5200, units: 520 },
    { id: 2, name: 'Premium Cashews', sales: 4800, units: 480 },
    { id: 3, name: 'Dried Cranberries', sales: 3600, units: 720 },
    { id: 4, name: 'Organic Walnuts', sales: 3200, units: 320 },
    { id: 5, name: 'Saffron Threads', sales: 3000, units: 60 }
  ],
  customerStats: {
    total: 1250,
    new: 125,
    returning: 875,
    churnRate: 5.2
  },
  monthlySales: [
    { month: 'Jan', sales: 28000 },
    { month: 'Feb', sales: 32000 },
    { month: 'Mar', sales: 35000 },
    { month: 'Apr', sales: 30000 },
    { month: 'May', sales: 28000 },
    { month: 'Jun', sales: 32000 },
    { month: 'Jul', sales: 38000 },
    { month: 'Aug', sales: 42000 },
    { month: 'Sep', sales: 45000 },
    { month: 'Oct', sales: 50000 },
    { month: 'Nov', sales: 55000 },
    { month: 'Dec', sales: 60000 }
  ]
};

// Stat Card Component
const StatCard = ({ title, value, icon, change, changeType, period }) => {
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
              <span className="text-sm text-gray-500 ml-2">vs last {period}</span>
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

// Chart Component with real Chart.js implementation
const Chart = ({ title, type, height = 300, data }) => {
  // Prepare data for Chart.js based on chart type
  const getChartData = () => {
    if (type === 'line') {
      return {
        labels: data.monthlySales.map(item => item.month),
        datasets: [
          {
            label: 'Monthly Sales',
            data: data.monthlySales.map(item => item.sales),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            currency: '$',
            tension: 0.4
          }
        ]
      };
    } else if (type === 'bar') {
      // Sample data for orders by month
      return {
        labels: data.monthlySales.map(item => item.month),
        datasets: [
          {
            label: 'Orders',
            data: data.monthlySales.map(item => Math.round(item.sales / 100)), // Simulated order count
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      };
    } else if (type === 'pie' || type === 'doughnut') {
      return {
        labels: data.salesByCategory.map(item => item.category),
        datasets: [
          {
            data: data.salesByCategory.map(item => item.sales),
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',  // Green
              'rgba(59, 130, 246, 0.7)',  // Blue
              'rgba(139, 92, 246, 0.7)',  // Purple
              'rgba(245, 158, 11, 0.7)',  // Amber
              'rgba(239, 68, 68, 0.7)',   // Red
              'rgba(107, 114, 128, 0.7)'  // Gray
            ],
            borderColor: [
              'rgb(16, 185, 129)',
              'rgb(59, 130, 246)',
              'rgb(139, 92, 246)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(107, 114, 128)'
            ],
            borderWidth: 1,
            currency: '$'
          }
        ]
      };
    }

    // Default empty data
    return {
      labels: [],
      datasets: []
    };
  };

  const chartData = getChartData();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <div className="p-6">
        {type === 'line' && (
          <LineChart
            data={chartData}
            height={height}
            fill={true}
            yAxisLabel="Revenue ($)"
            xAxisLabel="Month"
          />
        )}

        {type === 'bar' && (
          <BarChart
            data={chartData}
            height={height}
            yAxisLabel="Orders"
            xAxisLabel="Month"
          />
        )}

        {(type === 'pie' || type === 'doughnut') && (
          <PieChart
            data={chartData}
            height={height}
            isDoughnut={type === 'doughnut'}
            legendPosition="right"
          />
        )}
      </div>
    </div>
  );
};

// Top Products Table
const TopProductsTable = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.sales.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sales By Category
const SalesByCategory = ({ categories }) => {
  // Prepare data for pie chart
  const chartData = {
    labels: categories.map(item => item.category),
    datasets: [
      {
        data: categories.map(item => item.sales),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // Green
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(139, 92, 246, 0.7)',  // Purple
          'rgba(245, 158, 11, 0.7)',  // Amber
          'rgba(239, 68, 68, 0.7)',   // Red
          'rgba(107, 114, 128, 0.7)'  // Gray
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(107, 114, 128)'
        ],
        borderWidth: 1,
        currency: '$'
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <div className="p-6">
        {/* Pie Chart */}
        <div className="mb-6">
          <PieChart
            data={chartData}
            height={220}
            isDoughnut={true}
            cutout="70%"
          />
        </div>

        {/* Bar indicators */}
        <div className="space-y-4 mt-4">
          {categories.map((category) => (
            <div key={category.category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
                <span className="text-sm text-gray-500">${category.sales.toLocaleString()} ({category.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Customer Stats
const CustomerStats = ({ stats }) => {
  // Prepare data for pie chart
  const chartData = {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [stats.new, stats.returning],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(16, 185, 129, 0.7)'   // Green
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Customer Overview</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PieChart
              data={chartData}
              height={200}
              title="Customer Breakdown"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm font-medium text-gray-500">Total Customers</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm font-medium text-gray-500">New Customers</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.new.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm font-medium text-gray-500">Returning Customers</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.returning.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm font-medium text-gray-500">Churn Rate</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.churnRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Tab options
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faChartLine },
    { id: 'sales', label: 'Sales Analytics', icon: faChartBar },
    { id: 'behavior', label: 'User Behavior', icon: faUsers },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'sales' && <SalesAnalytics />}
        {activeTab === 'behavior' && <UserBehaviorAnalytics />}
      </div>
    </div>
  );
};

export default AnalyticsPage;
