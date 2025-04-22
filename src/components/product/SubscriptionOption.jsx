import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSync, faCheck } from '@fortawesome/free-solid-svg-icons';
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
    setIsSubscription(!isSubscription);
  };

  // Handle frequency change
  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
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
            {t('product.subscriptionOption')}
          </h3>
          <div className="ml-2 text-gray-500 cursor-pointer group relative">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="hidden group-hover:block absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 left-0 top-6">
              {t('product.subscriptionInfo')}
            </div>
          </div>
        </div>
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

      {isSubscription && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSync} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                {t('product.subscribeAndSave', { discount: subscriptionPricing?.discount })}
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
              {t('product.deliveryFrequency')}
            </label>
            <select
              value={frequency}
              onChange={handleFrequencyChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {frequencies.map(freq => (
                <option key={freq.id} value={freq.id}>
                  {freq.name} - {freq.description} ({freq.discount}% {t('product.off')})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">
              {t('product.subscriptionBenefits')}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1 mr-2" />
                <span className="text-sm text-gray-600">
                  {t('product.subscriptionBenefit1')}
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1 mr-2" />
                <span className="text-sm text-gray-600">
                  {t('product.subscriptionBenefit2')}
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1 mr-2" />
                <span className="text-sm text-gray-600">
                  {t('product.subscriptionBenefit3')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionOption;
