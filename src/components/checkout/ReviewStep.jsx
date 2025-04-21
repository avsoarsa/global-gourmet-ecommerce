import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCreditCard,
  faEdit,
  faTag,
  faCheck,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';

const OrderSummaryItem = ({ item }) => {
  const { formatPrice } = useRegion();
  
  return (
    <div className="flex py-4 border-b border-gray-200">
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
            <p className="mt-1 text-sm text-gray-500">
              {item.quantity} x {formatPrice(item.price)}
            </p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

const PromoCodeForm = ({ onApply }) => {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      setError(t('checkout.enterPromoCode'));
      return;
    }
    
    setIsApplying(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, only accept "DISCOUNT10" and "FREESHIP"
      if (promoCode.toUpperCase() === 'DISCOUNT10') {
        onApply({
          code: promoCode.toUpperCase(),
          type: 'percentage',
          value: 10,
          description: t('checkout.percentOff', { percent: 10 })
        });
      } else if (promoCode.toUpperCase() === 'FREESHIP') {
        onApply({
          code: promoCode.toUpperCase(),
          type: 'shipping',
          value: 100,
          description: t('checkout.freeShipping')
        });
      } else {
        setError(t('checkout.invalidPromoCode'));
      }
      
      setIsApplying(false);
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder={t('checkout.enterPromoCodePlaceholder')}
          className="form-input flex-1 rounded-r-none"
        />
        <button
          type="submit"
          disabled={isApplying}
          className="btn-primary rounded-l-none"
        >
          {isApplying ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            t('checkout.apply')
          )}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
};

const AppliedPromoCode = ({ promo, onRemove }) => {
  return (
    <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faTag} className="text-green-600 mr-2" />
        <div>
          <div className="text-sm font-medium text-green-800">{promo.code}</div>
          <div className="text-xs text-green-700">{promo.description}</div>
        </div>
      </div>
      
      <button
        onClick={onRemove}
        className="text-green-700 hover:text-green-800"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

const ReviewStep = ({ onNext, onBack, shippingAddress, paymentMethod, isProcessing }) => {
  const { t } = useTranslation();
  const { cartItems, cartTotal } = useCart();
  const { formatPrice, getShippingOptions } = useRegion();
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  // Get shipping cost based on selected method
  const shippingOptions = getShippingOptions();
  const shippingMethod = shippingAddress?.shippingMethod || 'standard';
  const shippingCost = shippingOptions.domestic[shippingMethod];
  
  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return (cartTotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'shipping') {
      return shippingCost;
    }
    
    return 0;
  };
  
  const discount = calculateDiscount();
  
  // Calculate tax (for demo purposes, 8% of subtotal)
  const taxRate = 0.08;
  const tax = (cartTotal - discount) * taxRate;
  
  // Calculate final total
  const total = cartTotal + shippingCost + tax - discount;
  
  // Handle promo code application
  const handleApplyPromo = (promo) => {
    setAppliedPromo(promo);
  };
  
  // Handle promo code removal
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };
  
  // Get payment method display info
  const getPaymentMethodInfo = () => {
    if (paymentMethod.type === 'credit-card' && paymentMethod.cardData) {
      const { cardNumber, expiryMonth, expiryYear } = paymentMethod.cardData;
      const last4 = cardNumber.slice(-4);
      return `**** **** **** ${last4} (${expiryMonth}/${expiryYear})`;
    } else if (paymentMethod.type === 'paypal') {
      return 'PayPal';
    } else if (paymentMethod.type === 'bank-transfer') {
      return t('checkout.bankTransfer');
    }
    
    return t('checkout.notSpecified');
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {t('checkout.reviewOrder')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Shipping Information */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('checkout.shippingInformation')}
              </h3>
              
              <button
                onClick={() => onBack(2)}
                className="text-sm text-green-600 hover:text-green-700 flex items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                {t('common.edit')}
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                    {shippingAddress.country}
                  </p>
                  <p className="text-gray-600 mt-1">{shippingAddress.phone}</p>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="font-medium text-gray-900">
                      {t('checkout.shippingMethod')}:
                    </p>
                    <p className="text-gray-600 mt-1">
                      {shippingMethod === 'standard' && t('checkout.standard')}
                      {shippingMethod === 'express' && t('checkout.express')}
                      {shippingMethod === 'overnight' && t('checkout.overnight')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('checkout.paymentInformation')}
              </h3>
              
              <button
                onClick={() => onBack(1)}
                className="text-sm text-green-600 hover:text-green-700 flex items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                {t('common.edit')}
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {paymentMethod.type === 'credit-card' && t('checkout.creditCard')}
                    {paymentMethod.type === 'paypal' && 'PayPal'}
                    {paymentMethod.type === 'bank-transfer' && t('checkout.bankTransfer')}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {getPaymentMethodInfo()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Promo Code */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('checkout.promoCode')}
            </h3>
            
            {appliedPromo ? (
              <AppliedPromoCode promo={appliedPromo} onRemove={handleRemovePromo} />
            ) : (
              <PromoCodeForm onApply={handleApplyPromo} />
            )}
          </div>
        </div>
        
        <div>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('checkout.orderSummary')}
            </h3>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map(item => (
                <OrderSummaryItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">{t('cart.subtotal')}</p>
                <p className="font-medium text-gray-900">{formatPrice(cartTotal)}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">{t('cart.shipping')}</p>
                <p className="font-medium text-gray-900">
                  {shippingCost === 0 
                    ? t('shipping.free') 
                    : formatPrice(shippingCost)}
                </p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">{t('cart.tax')} ({(taxRate * 100).toFixed(0)}%)</p>
                <p className="font-medium text-gray-900">{formatPrice(tax)}</p>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <p className="text-green-600">{t('cart.discount')}</p>
                  <p className="font-medium text-green-600">-{formatPrice(discount)}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <p className="text-base font-medium text-gray-900">{t('cart.total')}</p>
                <p className="text-base font-bold text-gray-900">{formatPrice(total)}</p>
              </div>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="mt-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="form-checkbox mt-1 h-4 w-4 text-green-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                {t('checkout.termsAgreement')} <a href="#" className="text-green-600 hover:text-green-700">{t('footer.terms')}</a> {t('checkout.and')} <a href="#" className="text-green-600 hover:text-green-700">{t('footer.privacy')}</a>.
              </span>
            </label>
          </div>
          
          {/* Place Order Button */}
          <div className="mt-6">
            <button
              onClick={onNext}
              disabled={isProcessing}
              className="btn-primary w-full py-3 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  {t('checkout.processing')}
                </>
              ) : (
                t('checkout.placeOrder')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
