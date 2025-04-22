import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { useSubscription } from '../../context/SubscriptionContext';

/**
 * Component for selecting subscription options on product detail page
 */
const SubscriptionOption = ({ product, selectedWeight, onSubscribe }) => {
  const { t } = useTranslation();
  const {
    isProductSubscriptionEligible,
    getSubscriptionFrequencies
  } = useSubscription();

  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState('monthly');

  // Check if product is eligible for subscription
  const isEligible = product && isProductSubscriptionEligible(product);

  // Get subscription frequencies
  const frequencies = getSubscriptionFrequencies();

  // Get selected weight option
  const weightOption = product && product.weightOptions ?
    product.weightOptions.find(option => option.weight === selectedWeight) : null;

  // Calculate subscription price
  const getSubscriptionPrice = (frequencyId) => {
    const selectedFrequency = frequencies.find(f => f.id === frequencyId);
    if (!selectedFrequency || !weightOption) return null;

    const discount = selectedFrequency.discount;
    const originalPrice = weightOption.price;
    const discountedPrice = originalPrice * (1 - discount / 100);

    return {
      price: parseFloat(discountedPrice.toFixed(2)),
      discount,
      originalPrice
    };
  };

  // Get current subscription price
  const subscriptionPricing = getSubscriptionPrice(frequency);

  // Handle subscription toggle
  const handleSubscriptionToggle = () => {
    const newIsSubscription = !isSubscription;
    setIsSubscription(newIsSubscription);

    // Notify parent component of subscription change
    if (onSubscribe) {
      onSubscribe({
        isSubscription: newIsSubscription,
        frequency,
        pricing: subscriptionPricing
      });
    }
  };

  // Handle frequency change
  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);

    // Notify parent component of frequency change
    if (onSubscribe && isSubscription) {
      const newPricing = getSubscriptionPrice(newFrequency);
      onSubscribe({
        isSubscription,
        frequency: newFrequency,
        pricing: newPricing
      });
    }
  };

  // Handle subscribe button click
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe({
        isSubscription,
        frequency,
        pricing: subscriptionPricing
      });
    }
  };

  if (!isEligible) return null;

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Subscribe & Save
          </h3>
          <div className="ml-2 text-gray-500 cursor-pointer group relative">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="hidden group-hover:block absolute z-10 w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 left-0 top-6">
              <p className="font-medium mb-2">About Subscriptions:</p>
              <p className="mb-2">Subscribe to receive this product regularly and save up to 15% on each order.</p>
              <ul className="list-disc pl-4 space-y-1 mb-2">
                <li>Choose your delivery frequency</li>
                <li>Cancel or modify anytime</li>
                <li>No commitment or contracts</li>
                <li>Automatic billing and shipping</li>
              </ul>
              <p>Manage all your subscriptions from your account dashboard.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{isSubscription ? 'Subscription Active' : 'One-time purchase'}</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isSubscription}
              onChange={handleSubscriptionToggle}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {isSubscription && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSync} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Save {subscriptionPricing?.discount}% with subscription
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 line-through">
                ${subscriptionPricing?.originalPrice.toFixed(2)}
              </div>
              <div className="text-lg font-bold text-green-700">
                ${subscriptionPricing?.price.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Frequency
            </label>
            <select
              value={frequency}
              onChange={handleFrequencyChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {frequencies.map(freq => (
                <option key={freq.id} value={freq.id}>
                  {freq.name} - {freq.description} ({freq.discount}% off)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">
              Subscription Benefits
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">
                  Save up to 15% on every order
                </span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">
                  Convenient automatic deliveries
                </span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">
                  Easily pause, skip, or cancel anytime
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> When you add this subscription to cart, you'll be charged for your first order today. Future orders will be automatically processed according to your selected frequency. You can manage all your subscriptions from your account dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionOption;
