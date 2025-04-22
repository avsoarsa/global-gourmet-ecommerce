import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faLightbulb,
  faSpinner,
  faCheck,
  faTimes,
  faSliders,
  faRefresh,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  getPersonalizationMetrics,
  getPersonalizationSettings,
  updatePersonalizationSettings
} from '../../utils/personalizationUtils';

const PersonalizationPerformance = () => {
  const [metrics, setMetrics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    loadTimes: [],
    renderTimes: [],
    algorithmTimes: []
  });
  
  // Load metrics and settings
  useEffect(() => {
    loadData();
  }, []);
  
  // Load metrics and settings
  const loadData = () => {
    setIsLoading(true);
    
    try {
      // Get metrics
      const personalizationMetrics = getPersonalizationMetrics() || {
        impressions: 0,
        clicks: 0,
        feedback: { positive: 0, negative: 0 },
        conversions: 0,
        lastUpdated: null
      };
      
      // Get settings
      const personalizationSettings = getPersonalizationSettings();
      
      // Update state
      setMetrics(personalizationMetrics);
      setSettings(personalizationSettings);
      setEditedSettings(personalizationSettings);
      
      // Get performance data from localStorage if available
      const storedPerformanceData = localStorage.getItem('personalization_performance_data');
      if (storedPerformanceData) {
        setPerformanceData(JSON.parse(storedPerformanceData));
      }
    } catch (error) {
      console.error('Error loading personalization data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle settings change
  const handleSettingChange = (key, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    setIsSaving(true);
    
    try {
      updatePersonalizationSettings(editedSettings);
      setSettings(editedSettings);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    const defaultSettings = {
      enabled: true,
      weightRecency: 0.7,
      weightFrequency: 0.5,
      weightFeedback: 0.8,
      decayRate: 0.95,
      minRelevanceScore: 0.3,
      refreshInterval: 24,
      maxSections: 3,
      maxItemsPerSection: 8
    };
    
    setEditedSettings(defaultSettings);
  };
  
  // Calculate engagement rate
  const calculateEngagementRate = () => {
    if (!metrics || metrics.impressions === 0) return 0;
    return (metrics.clicks / metrics.impressions) * 100;
  };
  
  // Calculate feedback quality
  const calculateFeedbackQuality = () => {
    const { positive, negative } = metrics?.feedback || { positive: 0, negative: 0 };
    const total = positive + negative;
    
    if (total === 0) return 0;
    return (positive / total) * 100;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Record performance data
  const recordPerformanceData = (loadTime, renderTime, algorithmTime) => {
    setPerformanceData(prev => {
      const newData = {
        loadTimes: [...prev.loadTimes, loadTime].slice(-50), // Keep last 50 entries
        renderTimes: [...prev.renderTimes, renderTime].slice(-50),
        algorithmTimes: [...prev.algorithmTimes, algorithmTime].slice(-50)
      };
      
      // Store in localStorage
      localStorage.setItem('personalization_performance_data', JSON.stringify(newData));
      
      return newData;
    });
  };
  
  // Calculate average
  const calculateAverage = (arr) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };
  
  // Calculate percentile
  const calculatePercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-2xl mr-2" />
          <span className="text-gray-600">Loading personalization data...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Personalization Performance</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faSliders} className="mr-2" />
            Settings
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faUsers} className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Engagement</h3>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.impressions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.clicks || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rate</p>
              <p className="text-2xl font-bold text-gray-900">{calculateEngagementRate().toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faLightbulb} className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Feedback</h3>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Positive</p>
              <p className="text-2xl font-bold text-green-600">{metrics?.feedback?.positive || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Negative</p>
              <p className="text-2xl font-bold text-red-600">{metrics?.feedback?.negative || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quality</p>
              <p className="text-2xl font-bold text-gray-900">{calculateFeedbackQuality().toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Algorithm</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculateAverage(performanceData.algorithmTimes).toFixed(0)}ms
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Render</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculateAverage(performanceData.renderTimes).toFixed(0)}ms
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculateAverage(performanceData.loadTimes).toFixed(0)}ms
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P50
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P90
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P95
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Algorithm Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateAverage(performanceData.algorithmTimes).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.algorithmTimes, 50).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.algorithmTimes, 90).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.algorithmTimes, 95).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.max(...performanceData.algorithmTimes, 0).toFixed(2)}ms
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Render Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateAverage(performanceData.renderTimes).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.renderTimes, 50).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.renderTimes, 90).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.renderTimes, 95).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.max(...performanceData.renderTimes, 0).toFixed(2)}ms
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Load Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateAverage(performanceData.loadTimes).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.loadTimes, 50).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.loadTimes, 90).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatePercentile(performanceData.loadTimes, 95).toFixed(2)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.max(...performanceData.loadTimes, 0).toFixed(2)}ms
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Last updated: {formatDate(metrics?.lastUpdated)}</p>
          <p>Sample size: {performanceData.loadTimes.length} measurements</p>
        </div>
      </div>
      
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="mb-8 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personalization Settings</h3>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Enabled</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={editedSettings.enabled}
                  onChange={() => handleSettingChange('enabled', !editedSettings.enabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recency Weight ({editedSettings.weightRecency})
                <span className="ml-1 text-xs text-gray-500">(0-1)</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={editedSettings.weightRecency}
                onChange={(e) => handleSettingChange('weightRecency', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">How much to prioritize recent activity</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency Weight ({editedSettings.weightFrequency})
                <span className="ml-1 text-xs text-gray-500">(0-1)</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={editedSettings.weightFrequency}
                onChange={(e) => handleSettingChange('weightFrequency', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">How much to prioritize frequent activity</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Weight ({editedSettings.weightFeedback})
                <span className="ml-1 text-xs text-gray-500">(0-1)</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={editedSettings.weightFeedback}
                onChange={(e) => handleSettingChange('weightFeedback', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">How much to prioritize user feedback</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decay Rate ({editedSettings.decayRate})
                <span className="ml-1 text-xs text-gray-500">(0-1)</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={editedSettings.decayRate}
                onChange={(e) => handleSettingChange('decayRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">How quickly older interactions lose value</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Relevance Score ({editedSettings.minRelevanceScore})
                <span className="ml-1 text-xs text-gray-500">(0-1)</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.1"
                value={editedSettings.minRelevanceScore}
                onChange={(e) => handleSettingChange('minRelevanceScore', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum score for a recommendation to be shown</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Sections ({editedSettings.maxSections})
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={editedSettings.maxSections}
                onChange={(e) => handleSettingChange('maxSections', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum number of personalized sections to show</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Items Per Section ({editedSettings.maxItemsPerSection})
              </label>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={editedSettings.maxItemsPerSection}
                onChange={(e) => handleSettingChange('maxItemsPerSection', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum items per personalized section</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetSettings}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset to Defaults
            </button>
            
            <div className="flex items-center space-x-2">
              {saveSuccess && (
                <span className="text-green-600 text-sm flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="mr-1" />
                  Saved successfully
                </span>
              )}
              
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isSaving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Optimization Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-1 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization Tips</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <span className="font-medium">Increase Recency Weight</span> if you want to prioritize recent user behavior more heavily.
              </li>
              <li>
                <span className="font-medium">Increase Feedback Weight</span> if you want user feedback to have more impact on recommendations.
              </li>
              <li>
                <span className="font-medium">Lower Min Relevance Score</span> to show more personalized recommendations (may reduce quality).
              </li>
              <li>
                <span className="font-medium">Reduce Max Sections</span> if performance is an issue on mobile devices.
              </li>
              <li>
                <span className="font-medium">Monitor P95 Load Times</span> to ensure good performance for most users.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationPerformance;
