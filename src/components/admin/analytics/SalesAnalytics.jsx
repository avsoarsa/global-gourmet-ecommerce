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
  faMoneyBillWave,
  faBoxOpen,
  faFilter,
  faSync,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Line, Bar, Pie } from 'react-chartjs-2';
// Import statements for chart components

const SalesAnalytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for sales analytics
  const mockSalesData = {
    summary: {
      totalSales: 425000.00,
      totalOrders: 1250,
      averageOrderValue: 340.00,
      monthlyGrowth: 15.3
    },
    salesByDay: {
      '2023-07-01': 1250.75,
      '2023-07-02': 1350.50,
      '2023-07-03': 1450.25,
      '2023-07-04': 1550.00,
      '2023-07-05': 1650.75,
      '2023-07-06': 1750.50,
      '2023-07-07': 1850.25
    },
    salesByMonth: {
      '2023-01': 28000,
      '2023-02': 32000,
      '2023-03': 35000,
      '2023-04': 30000,
      '2023-05': 28000,
      '2023-06': 32000,
      '2023-07': 38000,
      '2023-08': 42000,
      '2023-09': 45000,
      '2023-10': 50000,
      '2023-11': 55000,
      '2023-12': 60000
    },
    salesByCategory: {
      'Nuts': 12500,
      'Dried Fruits': 9800,
      'Spices': 7200,
      'Seeds': 3600,
      'Superfoods': 1800,
      'Gift Boxes': 1100
    },
    topProducts: [
      { id: 1, name: 'Organic Almonds', category: 'Nuts', unitsSold: 520, revenue: 15600 },
      { id: 2, name: 'Dried Cranberries', category: 'Dried Fruits', unitsSold: 480, revenue: 12000 },
      { id: 3, name: 'Cashew Nuts', category: 'Nuts', unitsSold: 420, revenue: 14700 },
      { id: 4, name: 'Organic Turmeric', category: 'Spices', unitsSold: 380, revenue: 7600 },
      { id: 5, name: 'Chia Seeds', category: 'Seeds', unitsSold: 350, revenue: 8750 },
      { id: 6, name: 'Organic Walnuts', category: 'Nuts', unitsSold: 320, revenue: 9600 },
      { id: 7, name: 'Dried Apricots', category: 'Dried Fruits', unitsSold: 310, revenue: 7750 },
      { id: 8, name: 'Cinnamon Sticks', category: 'Spices', unitsSold: 290, revenue: 5800 },
      { id: 9, name: 'Flax Seeds', category: 'Seeds', unitsSold: 280, revenue: 5600 },
      { id: 10, name: 'Goji Berries', category: 'Superfoods', unitsSold: 250, revenue: 7500 }
    ]
  };

  // Use mock data instead of API call
  useEffect(() => {
    const loadMockData = () => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setData(mockSalesData);
        setIsLoading(false);
        setIsRefreshing(false);
      }, 800);
    };

    loadMockData();
  }, [timeRange]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API delay
    setTimeout(() => {
      setData(mockSalesData);
      setIsRefreshing(false);
    }, 800);
  };

  // Handle export
  const handleExport = () => {
    try {
      // Generate CSV content from mock data
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add headers
      csvContent += 'Product,Category,Units Sold,Revenue\n';

      // Add data rows
      mockSalesData.topProducts.forEach(product => {
        csvContent += `"${product.name}","${product.category}",${product.unitsSold},${product.revenue}\n`;
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = encodedUri;
      a.download = `sales-report-${timeRange}.csv`;

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Prepare data for charts
  const prepareSalesByMonthChart = () => {
    const months = Object.keys(data.salesByMonth).sort();
    const values = months.map(month => data.salesByMonth[month]);

    // Format month labels (YYYY-MM to MMM YYYY)
    const labels = months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Sales',
          data: values,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };
  };

  const prepareSalesByCategoryChart = () => {
    const categories = Object.keys(data.salesByCategory);
    const values = categories.map(category => data.salesByCategory[category]);

    // Generate colors for each category
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(40, 159, 64, 0.6)',
      'rgba(210, 199, 199, 0.6)'
    ];

    return {
      labels: categories,
      datasets: [
        {
          label: 'Sales by Category',
          data: values,
          backgroundColor: backgroundColors.slice(0, categories.length),
          borderWidth: 1
        }
      ]
    };
  };

  const prepareTopProductsChart = () => {
    const products = data.topProducts.slice(0, 5); // Top 5 products
    const labels = products.map(product => product.name);
    const values = products.map(product => product.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue by Product',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
          Sales Analytics
        </h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
          >
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="yearly">Last 365 Days</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon
              icon={faSync}
              className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.summary.totalSales)}</p>

              <div className="mt-1 flex items-center">
                <span className={`text-sm font-medium ${data.summary.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <FontAwesomeIcon
                    icon={data.summary.monthlyGrowth >= 0 ? faArrowUp : faArrowDown}
                    className="mr-1"
                  />
                  {Math.abs(data.summary.monthlyGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{data.summary.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FontAwesomeIcon icon={faChartLine} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.summary.averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FontAwesomeIcon icon={faBoxOpen} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Top Category</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.entries(data.salesByCategory).sort((a, b) => b[1] - a[1])[0][0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Monthly Sales Trend</h3>
          </div>

          <div className="p-6">
            <Line
              data={prepareSalesByMonthChart()}
              options={lineChartOptions}
              height={300}
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Products by Revenue</h3>
          </div>

          <div className="p-6">
            <Bar
              data={prepareTopProductsChart()}
              options={barChartOptions}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-x-auto">
          <div>
            <Pie
              data={prepareSalesByCategoryChart()}
              options={pieChartOptions}
              height={300}
            />
          </div>

          <div className="space-y-4 flex flex-col justify-center">
            {Object.entries(data.salesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, sales]) => {
                const percentage = (sales / Object.values(data.salesByCategory).reduce((a, b) => a + b, 0)) * 100;

                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(sales)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.unitsSold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
