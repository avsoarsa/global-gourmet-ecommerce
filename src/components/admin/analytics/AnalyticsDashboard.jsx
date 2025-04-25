import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faChartBar,
  faChartPie,
  faCalendarAlt,
  faDownload,
  faArrowUp,
  faArrowDown,
  faShoppingCart,
  faUsers,
  faMoneyBillWave,
  faBoxOpen,
  faFilter,
  faSync,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { getAnalyticsData } from '../../../services/analyticsService';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fallback data in case API fails
const fallbackData = {
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
    { id: 1, name: 'Organic Almonds', category: 'Nuts', sales: 5200, revenue: 15600 },
    { id: 2, name: 'Dried Cranberries', category: 'Dried Fruits', sales: 4800, revenue: 12000 },
    { id: 3, name: 'Cashew Nuts', category: 'Nuts', sales: 4200, revenue: 14700 },
    { id: 4, name: 'Organic Turmeric', category: 'Spices', sales: 3800, revenue: 7600 },
    { id: 5, name: 'Chia Seeds', category: 'Seeds', sales: 3500, revenue: 8750 }
  ],
  customerStats: {
    total: 2450,
    new: 320,
    returning: 1850,
    churnRate: 2.3,
    acquisitionCost: 12.5,
    lifetimeValue: 185.75
  },
  salesChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12500, 15000, 18500, 21000, 22500, 28000, 32000, 38000, 42000, 45000, 48000, 52000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  },
  ordersChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 150, 180, 220, 250, 280, 310, 350, 380, 410, 440, 480],
        backgroundColor: 'rgba(54, 162, 235, 0.8)'
      }
    ]
  },
  categoryChart: {
    labels: ['Nuts', 'Dried Fruits', 'Spices', 'Seeds', 'Superfoods', 'Gift Boxes'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [12500, 9800, 7200, 3600, 1800, 1100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
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
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' :
                changeType === 'decrease' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {changeType !== 'neutral' && (
                  <FontAwesomeIcon
                    icon={changeType === 'increase' ? faArrowUp : faArrowDown}
                    className="mr-1"
                  />
                )}
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

// Chart Component
const Chart = ({ title, type, height = 300, data, options = {} }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true
      }
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : undefined
  };

  const mergedOptions = { ...defaultOptions, ...options };

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
          <Line data={chartData} options={mergedOptions} height={height} />
        )}

        {type === 'bar' && (
          <Bar data={chartData} options={mergedOptions} height={height} />
        )}

        {type === 'pie' && (
          <Pie data={chartData} options={mergedOptions} height={height} />
        )}

        {type === 'doughnut' && (
          <Doughnut data={chartData} options={mergedOptions} height={height} />
        )}
      </div>
    </div>
  );
};

// Top Products Table
const TopProductsTable = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.sales.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sales By Category Component
const SalesByCategory = ({ categories }) => {
  const chartData = {
    labels: categories.map(cat => cat.category),
    datasets: [
      {
        data: categories.map(cat => cat.sales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
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
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
            height={220}
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

// Customer Stats Component
const CustomerStats = ({ stats }) => {
  const chartData = {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [stats.new, stats.returning],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Customer Insights</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Customers</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">New Customers</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.new.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Returning Customers</p>
            <p className="text-2xl font-semibold text-green-600">{stats.returning.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
            height={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Churn Rate</p>
            <p className="text-xl font-semibold text-gray-900">{stats.churnRate}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Customer Lifetime Value</p>
            <p className="text-xl font-semibold text-gray-900">${stats.lifetimeValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get analytics data from API
        const { success, data: analyticsData, error: apiError } = await getAnalyticsData(timeRange);

        if (!success) {
          throw new Error(apiError || 'Failed to fetch analytics data');
        }

        // Format data for charts
        const formattedData = {
          salesOverview: {
            daily: analyticsData.averageOrderValue || 0,
            weekly: analyticsData.totalRevenue / 4 || 0, // Approximate weekly revenue
            monthly: analyticsData.totalRevenue || 0,
            yearly: analyticsData.totalRevenue * 12 || 0 // Approximate yearly revenue
          },
          orderStats: {
            total: analyticsData.orderCount || 0,
            completed: analyticsData.completedOrders || 0,
            pending: analyticsData.orderCount - analyticsData.completedOrders || 0,
            cancelled: 0 // Not available in the API response
          },
          customerStats: {
            total: analyticsData.newUserCount || 0,
            new: analyticsData.newUserCount || 0,
            returning: 0 // Not available in the API response
          },
          productStats: {
            views: analyticsData.productViewCount || 0,
            conversions: analyticsData.conversionRate || 0
          },
          salesByDay: analyticsData.salesByDay || [],
          usersByDay: analyticsData.usersByDay || [],
          topProducts: [], // Not available in the API response
          topCategories: [] // Not available in the API response
        };

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error.message || 'Failed to load analytics data');

        // Use fallback data in case of error
        setData(fallbackData);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Handle refresh data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      // Get analytics data from API
      const { success, data: analyticsData, error: apiError } = await getAnalyticsData(timeRange);

      if (!success) {
        throw new Error(apiError || 'Failed to refresh analytics data');
      }

      // Format data for charts (same as in useEffect)
      const formattedData = {
        salesOverview: {
          daily: analyticsData.averageOrderValue || 0,
          weekly: analyticsData.totalRevenue / 4 || 0,
          monthly: analyticsData.totalRevenue || 0,
          yearly: analyticsData.totalRevenue * 12 || 0
        },
        orderStats: {
          total: analyticsData.orderCount || 0,
          completed: analyticsData.completedOrders || 0,
          pending: analyticsData.orderCount - analyticsData.completedOrders || 0,
          cancelled: 0
        },
        customerStats: {
          total: analyticsData.newUserCount || 0,
          new: analyticsData.newUserCount || 0,
          returning: 0
        },
        productStats: {
          views: analyticsData.productViewCount || 0,
          conversions: analyticsData.conversionRate || 0
        },
        salesByDay: analyticsData.salesByDay || [],
        usersByDay: analyticsData.usersByDay || [],
        topProducts: [],
        topCategories: []
      };

      setData(formattedData);
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
      setError(error.message || 'Failed to refresh analytics data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-green-500 text-4xl mb-4" />
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !data) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Analytics</h3>
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your store's performance and sales metrics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select pl-10 pr-10 py-2 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon
              icon={faSync}
              className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(data.salesOverview[timeRange])}
          icon={faMoneyBillWave}
          change={data.salesOverview[timeRange] > 0 ? "Active" : "No sales"}
          changeType={data.salesOverview[timeRange] > 0 ? "increase" : "neutral"}
          period={timeRange.slice(0, -2) + (timeRange === 'daily' ? 'day' : '')}
        />
        <StatCard
          title="Orders"
          value={formatNumber(data.orderStats.total)}
          icon={faShoppingCart}
          change={`${formatNumber(data.orderStats.pending)} pending`}
          changeType="neutral"
          period={timeRange.slice(0, -2) + (timeRange === 'daily' ? 'day' : '')}
        />
        <StatCard
          title="Customers"
          value={formatNumber(data.customerStats.total)}
          icon={faUsers}
          change={data.customerStats.new > 0 ? `${formatNumber(data.customerStats.new)} new` : null}
          changeType="increase"
          period={timeRange.slice(0, -2) + (timeRange === 'daily' ? 'day' : '')}
        />
        <StatCard
          title="Product Views"
          value={formatNumber(data.productStats.views)}
          icon={faBoxOpen}
          change={`${data.productStats.conversions}% conversion`}
          changeType={data.productStats.conversions > 2 ? "increase" : "decrease"}
          period={timeRange.slice(0, -2) + (timeRange === 'daily' ? 'day' : '')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          title="Sales Overview"
          type="line"
          height={300}
          data={{
            labels: data.salesChart.labels,
            datasets: data.salesChart.datasets
          }}
        />
        <Chart
          title="Orders Overview"
          type="bar"
          height={300}
          data={{
            labels: data.ordersChart.labels,
            datasets: data.ordersChart.datasets
          }}
        />
      </div>

      {/* More Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProductsTable products={data.topProducts} />
        </div>
        <div>
          <SalesByCategory categories={data.salesByCategory} />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="mt-6">
        <CustomerStats stats={data.customerStats} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
