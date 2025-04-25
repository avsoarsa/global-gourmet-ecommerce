import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faCreditCard, faClipboardCheck, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { createOrder } from '../services/checkoutService';
import { processPayment } from '../services/paymentService';
import { getShippingMethods } from '../services/checkoutService';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import AddressForm from '../components/checkout/AddressForm';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ReviewStep from '../components/checkout/ReviewStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { formatPrice } = useRegion();
  const { addPointsForPurchase } = useLoyalty();

  // Checkout steps
  const STEPS = [
    { name: 'Shipping', description: 'Address & delivery', icon: faShippingFast },
    { name: 'Payment', description: 'Payment method', icon: faCreditCard },
    { name: 'Review', description: 'Order summary', icon: faClipboardCheck },
    { name: 'Confirmation', description: 'Order complete', icon: faCheckCircle }
  ];

  // State
  const [currentStep, setCurrentStep] = useState(1); // 1-based index
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({});
  const [shippingAddressValid, setShippingAddressValid] = useState(false);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [availableShippingMethods, setAvailableShippingMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderComplete]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && !orderComplete) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [currentUser, navigate, orderComplete]);

  // Fetch shipping methods when address is valid
  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (shippingAddressValid) {
        try {
          const { success, data, error } = await getShippingMethods({
            address: shippingAddress,
            cartTotal: cartTotal
          });

          if (success && data) {
            setAvailableShippingMethods(data);
            // Set default shipping method if none selected
            if (!shippingMethod && data.length > 0) {
              setShippingMethod(data[0].id);
            }
          } else if (error) {
            console.error('Error fetching shipping methods:', error);
            setApiError(`Failed to load shipping options: ${error}`);
          }
        } catch (error) {
          console.error('Error fetching shipping methods:', error);
          setApiError('Failed to load shipping options. Please try again.');
        }
      }
    };

    fetchShippingMethods();
  }, [shippingAddressValid, shippingAddress, cartTotal, shippingMethod]);

  // Handle address change
  const handleAddressChange = (address) => {
    setShippingAddress(address);

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
    const isValid = requiredFields.every(field => address[field] && address[field].trim() !== '');

    setShippingAddressValid(isValid);
  };

  // Handle step navigation
  const goToNextStep = () => {
    // Validate current step
    if (currentStep === 1 && !shippingAddressValid) {
      setValidationErrors({
        shipping: 'Please complete all required fields'
      });
      return;
    }

    if (currentStep === 2 && !paymentMethod) {
      setValidationErrors({
        payment: 'Please select a payment method'
      });
      return;
    }

    // Clear validation errors
    setValidationErrors({});

    // Move to next step
    if (currentStep < STEPS.length) {
      if (currentStep === 3) {
        // If on review step, place order
        handlePlaceOrder();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }

    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }

    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  // Handle direct step navigation
  const goToStep = (step) => {
    // Only allow navigation to completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setApiError(null);
    setValidationErrors({});

    try {
      // Validate required fields
      if (!shippingMethod) {
        setValidationErrors({
          shipping: 'Please select a shipping method'
        });
        return;
      }

      if (!paymentMethod) {
        setValidationErrors({
          payment: 'Please select a payment method'
        });
        return;
      }

      // Create order in the backend
      const { success: orderSuccess, data: orderData, error: orderError } = await createOrder({
        shippingAddress,
        paymentMethod,
        shippingMethod,
        paymentDetails,
        notes: ''
      });

      if (!orderSuccess) {
        throw new Error(orderError || 'Failed to create order');
      }

      // Process payment
      const { success: paymentSuccess, data: paymentData, error: paymentError } = await processPayment({
        orderId: orderData.id,
        paymentMethod,
        paymentDetails
      });

      if (!paymentSuccess) {
        throw new Error(paymentError || 'Failed to process payment');
      }

      // Set order details for confirmation
      setOrderId(orderData.id);
      setOrderNumber(orderData.order_number);

      // Add loyalty points for the purchase
      if (currentUser) {
        await addPointsForPurchase(cartTotal, orderData.id);
      }

      // Clear cart and show confirmation
      clearCart();
      setCurrentStep(4); // Confirmation step
      setOrderComplete(true);
    } catch (error) {
      console.error('Error placing order:', error);
      setApiError(error.message || 'There was an error processing your order. Please try again.');
      setValidationErrors({
        order: 'There was an error processing your order. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('checkout.title')}</h1>

      {/* Progress Indicator */}
      {currentStep < 4 && (
        <CheckoutStepper
          currentStep={currentStep}
          steps={STEPS}
          onStepClick={goToStep}
        />
      )}

      {/* Checkout Steps */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 border border-gray-100">
        {/* Validation Errors */}
        {(Object.keys(validationErrors).length > 0 || apiError) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <ul className="list-disc pl-5">
              {Object.values(validationErrors).map((error, index) => (
                <li key={`validation-${index}`}>{error}</li>
              ))}
              {apiError && <li key="api-error">{apiError}</li>}
            </ul>
          </div>
        )}

        {/* Step 1: Shipping */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b border-gray-200">Shipping Information</h2>

            <AddressForm
              address={shippingAddress}
              onAddressChange={handleAddressChange}
              showValidation={!!validationErrors.shipping}
            />

            {/* Shipping Methods */}
            {shippingAddressValid && availableShippingMethods.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Method
                </h3>

                <div className="space-y-4">
                  {availableShippingMethods.map(method => (
                    <label
                      key={method.id}
                      className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                        shippingMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          className="form-radio mt-1"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.description}
                          </div>
                          <div className="mt-1 text-sm font-medium text-gray-900">
                            {method.price === 0
                              ? 'Free'
                              : formatPrice(method.price)}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <Link
                to="/cart"
                className="px-6 py-3 rounded-md text-gray-600 font-medium transition-colors duration-300 flex items-center border border-gray-300 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Cart
              </Link>
              <button
                onClick={goToNextStep}
                disabled={!shippingAddressValid || !shippingMethod}
                className={`px-6 py-3 rounded-md text-white font-medium transition-colors duration-300 flex items-center ${
                  shippingAddressValid && shippingMethod
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Payment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <PaymentStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            showValidation={!!validationErrors.payment}
          />
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <ReviewStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            shippingAddress={shippingAddress}
            shippingMethod={shippingMethod}
            availableShippingMethods={availableShippingMethods}
            paymentMethod={paymentMethod}
            paymentDetails={paymentDetails}
            isProcessing={isProcessing}
            showValidation={!!validationErrors.order}
            apiError={apiError}
          />
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <ConfirmationStep orderId={orderId} orderNumber={orderNumber} />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
