import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faStore,
  faGlobe,
  faShippingFast,
  faCreditCard,
  faEnvelope,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const SettingsPage = () => {
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Global Gourmet',
    storeEmail: 'info@globalgourmet.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Main St, New York, NY 10001',
    storeCurrency: 'USD',
    storeLanguage: 'en',
    storeTimeZone: 'America/New_York'
  });
  
  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: 50,
    domesticShippingRates: {
      standard: 5.99,
      express: 12.99,
      overnight: 24.99
    },
    internationalShipping: true,
    internationalShippingRates: {
      standard: 19.99,
      express: 39.99
    }
  });
  
  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptedPaymentMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: true
    },
    taxRate: 8.5,
    enableTaxExemption: true
  });
  
  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    abandonedCart: true,
    lowStockAlert: true,
    newsletterFrequency: 'weekly'
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Handle store settings change
  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle shipping settings change
  const handleShippingSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'enableFreeShipping' || name === 'internationalShipping') {
      setShippingSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'freeShippingThreshold') {
      setShippingSettings(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else if (name.startsWith('domestic') || name.startsWith('international')) {
      const [category, rate] = name.split('.');
      
      setShippingSettings(prev => ({
        ...prev,
        [`${category}Rates`]: {
          ...prev[`${category}Rates`],
          [rate]: parseFloat(value)
        }
      }));
    }
  };
  
  // Handle payment settings change
  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('acceptedPaymentMethods')) {
      const method = name.split('.')[1];
      
      setPaymentSettings(prev => ({
        ...prev,
        acceptedPaymentMethods: {
          ...prev.acceptedPaymentMethods,
          [method]: checked
        }
      }));
    } else if (name === 'enableTaxExemption') {
      setPaymentSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'taxRate') {
      setPaymentSettings(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    }
  };
  
  // Handle email settings change
  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setEmailSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEmailSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(false);
    setFormError(null);
    
    try {
      // In a real app, this would be an API call to save settings
      console.log('Saving settings:', {
        storeSettings,
        shippingSettings,
        paymentSettings,
        emailSettings
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setFormError('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your store settings and preferences
        </p>
      </div>
      
      {/* Settings Form */}
      <form onSubmit={handleSubmit}>
        {/* Success/Error Messages */}
        {formSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}
        
        {formError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {formError}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Store Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStore} className="text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Store Information</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreSettingsChange}
                  className="form-input block w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  id="storeEmail"
                  name="storeEmail"
                  value={storeSettings.storeEmail}
                  onChange={handleStoreSettingsChange}
                  className="form-input block w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Phone
                </label>
                <input
                  type="text"
                  id="storePhone"
                  name="storePhone"
                  value={storeSettings.storePhone}
                  onChange={handleStoreSettingsChange}
                  className="form-input block w-full"
                />
              </div>
              
              <div>
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Address
                </label>
                <input
                  type="text"
                  id="storeAddress"
                  name="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={handleStoreSettingsChange}
                  className="form-input block w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label htmlFor="storeCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="storeCurrency"
                  name="storeCurrency"
                  value={storeSettings.storeCurrency}
                  onChange={handleStoreSettingsChange}
                  className="form-select block w-full"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="storeLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="storeLanguage"
                  name="storeLanguage"
                  value={storeSettings.storeLanguage}
                  onChange={handleStoreSettingsChange}
                  className="form-select block w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="storeTimeZone" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Zone
                </label>
                <select
                  id="storeTimeZone"
                  name="storeTimeZone"
                  value={storeSettings.storeTimeZone}
                  onChange={handleStoreSettingsChange}
                  className="form-select block w-full"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faShippingFast} className="text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Shipping</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableFreeShipping"
                  name="enableFreeShipping"
                  checked={shippingSettings.enableFreeShipping}
                  onChange={handleShippingSettingsChange}
                  className="form-checkbox h-4 w-4 text-green-600"
                />
                <label htmlFor="enableFreeShipping" className="ml-2 block text-sm text-gray-900">
                  Enable free shipping
                </label>
              </div>
              
              {shippingSettings.enableFreeShipping && (
                <div className="mt-4 ml-6">
                  <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                    Free shipping for orders over ($)
                  </label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={handleShippingSettingsChange}
                    min="0"
                    step="0.01"
                    className="form-input block w-full max-w-xs"
                  />
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Domestic Shipping Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="domestic.standard" className="block text-sm text-gray-500 mb-1">
                    Standard Shipping ($)
                  </label>
                  <input
                    type="number"
                    id="domestic.standard"
                    name="domestic.standard"
                    value={shippingSettings.domesticShippingRates.standard}
                    onChange={handleShippingSettingsChange}
                    min="0"
                    step="0.01"
                    className="form-input block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="domestic.express" className="block text-sm text-gray-500 mb-1">
                    Express Shipping ($)
                  </label>
                  <input
                    type="number"
                    id="domestic.express"
                    name="domestic.express"
                    value={shippingSettings.domesticShippingRates.express}
                    onChange={handleShippingSettingsChange}
                    min="0"
                    step="0.01"
                    className="form-input block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="domestic.overnight" className="block text-sm text-gray-500 mb-1">
                    Overnight Shipping ($)
                  </label>
                  <input
                    type="number"
                    id="domestic.overnight"
                    name="domestic.overnight"
                    value={shippingSettings.domesticShippingRates.overnight}
                    onChange={handleShippingSettingsChange}
                    min="0"
                    step="0.01"
                    className="form-input block w-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="internationalShipping"
                  name="internationalShipping"
                  checked={shippingSettings.internationalShipping}
                  onChange={handleShippingSettingsChange}
                  className="form-checkbox h-4 w-4 text-green-600"
                />
                <label htmlFor="internationalShipping" className="ml-2 block text-sm font-medium text-gray-700">
                  Enable international shipping
                </label>
              </div>
              
              {shippingSettings.internationalShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label htmlFor="international.standard" className="block text-sm text-gray-500 mb-1">
                      International Standard ($)
                    </label>
                    <input
                      type="number"
                      id="international.standard"
                      name="international.standard"
                      value={shippingSettings.internationalShippingRates.standard}
                      onChange={handleShippingSettingsChange}
                      min="0"
                      step="0.01"
                      className="form-input block w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="international.express" className="block text-sm text-gray-500 mb-1">
                      International Express ($)
                    </label>
                    <input
                      type="number"
                      id="international.express"
                      name="international.express"
                      value={shippingSettings.internationalShippingRates.express}
                      onChange={handleShippingSettingsChange}
                      min="0"
                      step="0.01"
                      className="form-input block w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCreditCard} className="text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptedPaymentMethods.creditCard"
                    name="acceptedPaymentMethods.creditCard"
                    checked={paymentSettings.acceptedPaymentMethods.creditCard}
                    onChange={handlePaymentSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="acceptedPaymentMethods.creditCard" className="ml-2 block text-sm text-gray-900">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptedPaymentMethods.paypal"
                    name="acceptedPaymentMethods.paypal"
                    checked={paymentSettings.acceptedPaymentMethods.paypal}
                    onChange={handlePaymentSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="acceptedPaymentMethods.paypal" className="ml-2 block text-sm text-gray-900">
                    PayPal
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptedPaymentMethods.bankTransfer"
                    name="acceptedPaymentMethods.bankTransfer"
                    checked={paymentSettings.acceptedPaymentMethods.bankTransfer}
                    onChange={handlePaymentSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="acceptedPaymentMethods.bankTransfer" className="ml-2 block text-sm text-gray-900">
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={paymentSettings.taxRate}
                  onChange={handlePaymentSettingsChange}
                  min="0"
                  step="0.01"
                  className="form-input block w-full"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTaxExemption"
                  name="enableTaxExemption"
                  checked={paymentSettings.enableTaxExemption}
                  onChange={handlePaymentSettingsChange}
                  className="form-checkbox h-4 w-4 text-green-600"
                />
                <label htmlFor="enableTaxExemption" className="ml-2 block text-sm text-gray-900">
                  Enable tax exemption for eligible customers
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderConfirmation"
                    name="orderConfirmation"
                    checked={emailSettings.orderConfirmation}
                    onChange={handleEmailSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="orderConfirmation" className="ml-2 block text-sm text-gray-900">
                    Order confirmation emails
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderShipped"
                    name="orderShipped"
                    checked={emailSettings.orderShipped}
                    onChange={handleEmailSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="orderShipped" className="ml-2 block text-sm text-gray-900">
                    Order shipped emails
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderDelivered"
                    name="orderDelivered"
                    checked={emailSettings.orderDelivered}
                    onChange={handleEmailSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="orderDelivered" className="ml-2 block text-sm text-gray-900">
                    Order delivered emails
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="abandonedCart"
                    name="abandonedCart"
                    checked={emailSettings.abandonedCart}
                    onChange={handleEmailSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="abandonedCart" className="ml-2 block text-sm text-gray-900">
                    Abandoned cart reminders
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockAlert"
                    name="lowStockAlert"
                    checked={emailSettings.lowStockAlert}
                    onChange={handleEmailSettingsChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <label htmlFor="lowStockAlert" className="ml-2 block text-sm text-gray-900">
                    Low stock alerts
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="newsletterFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Newsletter Frequency
              </label>
              <select
                id="newsletterFrequency"
                name="newsletterFrequency"
                value={emailSettings.newsletterFrequency}
                onChange={handleEmailSettingsChange}
                className="form-select block w-full max-w-xs"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save Settings
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
