import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faRoute,
  faChartLine,
  faDownload,
  faFilter,
  faSync,
  faMobileAlt,
  faDesktop,
  faTabletAlt,
  faUserCheck,
  faUserSlash,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { getUserBehaviorData, exportAnalyticsData } from '../../../services/analyticsService';

const UserBehaviorAnalytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user behavior data
  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const behaviorData = await getUserBehaviorData({ timeRange });
      setData(behaviorData);
    } catch (error) {
      console.error('Error fetching user behavior data:', error);
      setError('Failed to load user behavior data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await exportAnalyticsData('user-behavior', { timeRange });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `user-behavior-report-${timeRange}.csv`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
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

  // Calculate device type distribution
  const deviceDistribution = data.sessionMetrics.reduce((acc, session) => {
    const deviceType = session.deviceType || 'unknown';
    acc[deviceType] = (acc[deviceType] || 0) + 1;
    return acc;
  }, {});

  // Calculate login status distribution
  const loginDistribution = data.sessionMetrics.reduce((acc, session) => {
    const status = session.isLoggedIn ? 'logged_in' : 'guest';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calculate conversion metrics
  const totalSessions = data.totalSessions;
  const purchaseSessions = data.sessionMetrics.filter(s => s.madePurchase).length;
  const conversionRate = totalSessions > 0 ? (purchaseSessions / totalSessions) * 100 : 0;

  // Calculate average session duration
  const totalDuration = data.sessionMetrics.reduce((sum, session) => sum + session.durationSeconds, 0);
  const avgDuration = data.sessionMetrics.length > 0 ? totalDuration / data.sessionMetrics.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
          User Behavior Analytics
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FontAwesomeIcon icon={faUsers} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{totalSessions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FontAwesomeIcon icon={faChartLine} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FontAwesomeIcon icon={faRoute} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.floor(avgDuration / 60)}m {Math.round(avgDuration % 60)}s
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FontAwesomeIcon icon={faMobileAlt} className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Mobile Traffic</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((deviceDistribution.mobile || 0) / totalSessions * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Funnel Analysis */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Conversion Funnel</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {data.funnelAnalysis.map((step, index) => {
              // Map step names to more readable format
              const stepLabels = {
                'page_view': 'Page View',
                'product_view': 'Product View',
                'add_to_cart': 'Add to Cart',
                'begin_checkout': 'Begin Checkout',
                'purchase': 'Purchase'
              };
              
              const stepLabel = stepLabels[step.step] || step.step;
              const width = `${step.conversionRate}%`;
              
              return (
                <div key={step.step}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{index + 1}. {stepLabel}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.sessionsReachingStep.toLocaleString()} sessions ({step.conversionRate.toFixed(1)}%)
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width }}
                    ></div>
                  </div>
                  
                  {index < data.funnelAnalysis.length - 1 && (
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-red-500">
                        {step.dropOffRate.toFixed(1)}% drop off
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Device & User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Device Distribution */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Device Distribution</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(deviceDistribution).map(([device, count]) => {
                const percentage = (count / totalSessions) * 100;
                
                // Map device types to icons
                const deviceIcons = {
                  'desktop': faDesktop,
                  'mobile': faMobileAlt,
                  'tablet': faTabletAlt,
                  'unknown': faDesktop
                };
                
                const icon = deviceIcons[device] || deviceIcons.unknown;
                
                return (
                  <div key={device}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={icon} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {device.charAt(0).toUpperCase() + device.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {count.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* User Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">User Status</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(loginDistribution).map(([status, count]) => {
                const percentage = (count / totalSessions) * 100;
                
                // Map status to readable labels and icons
                const statusLabels = {
                  'logged_in': 'Logged In Users',
                  'guest': 'Guest Users'
                };
                
                const statusIcons = {
                  'logged_in': faUserCheck,
                  'guest': faUserSlash
                };
                
                const label = statusLabels[status] || status;
                const icon = statusIcons[status] || faUsers;
                
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={icon} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {count.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${status === 'logged_in' ? 'bg-green-600' : 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent User Journeys */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent User Journeys</h3>
          <span className="text-sm text-gray-500">Showing {data.userJourneys.length} of {totalSessions} sessions</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Journey Path
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.userJourneys.map((journey) => (
                <tr key={journey.sessionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {journey.sessionId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {journey.userId ? `User #${journey.userId}` : 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap items-center">
                      {journey.journey.map((step, index) => {
                        // Map event types to icons and colors
                        const eventIcons = {
                          'page_view': { icon: faUsers, color: 'bg-blue-100 text-blue-600' },
                          'product_view': { icon: faDesktop, color: 'bg-purple-100 text-purple-600' },
                          'add_to_cart': { icon: faShoppingCart, color: 'bg-green-100 text-green-600' },
                          'begin_checkout': { icon: faRoute, color: 'bg-yellow-100 text-yellow-600' },
                          'purchase': { icon: faChartLine, color: 'bg-red-100 text-red-600' }
                        };
                        
                        const { icon, color } = eventIcons[step.eventType] || 
                          { icon: faUsers, color: 'bg-gray-100 text-gray-600' };
                        
                        return (
                          <div key={index} className="flex items-center mr-2 mb-2">
                            <div className={`p-1.5 rounded-full ${color} mr-1`}>
                              <FontAwesomeIcon icon={icon} className="text-xs" />
                            </div>
                            <span className="text-xs">
                              {step.pageName || step.productName || step.eventType}
                            </span>
                            {index < journey.journey.length - 1 && (
                              <svg className="h-4 w-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
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

export default UserBehaviorAnalytics;
