import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faCreditCard, faClipboardCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';
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
  const [shippingAddress, setShippingAddress] = useState({});
  const [shippingAddressValid, setShippingAddressValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate random order ID
      const newOrderId = Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);

      // Save order data to localStorage for persistence
      const orderData = {
        id: newOrderId,
        date: new Date().toISOString(),
        items: cartItems,
        total: cartTotal,
        shippingAddress,
        paymentMethod,
        status: 'Processing'
      };

      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart and show confirmation
      clearCart();
      setCurrentStep(4); // Confirmation step
      setOrderComplete(true);
    } catch (error) {
      console.error('Error placing order:', error);
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

      {/* Trust Badges */}
      <div className="flex justify-center space-x-8 mb-4">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-gray-600">Secure Checkout</span>
        </div>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-600">Quality Guarantee</span>
        </div>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-xs text-gray-600">Easy Returns</span>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 border border-gray-100">
        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <ul className="list-disc pl-5">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
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

            <div className="mt-8 flex justify-end">
              <button
                onClick={goToNextStep}
                disabled={!shippingAddressValid}
                className={`px-6 py-3 rounded-md text-white font-medium transition-colors duration-300 flex items-center ${shippingAddressValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
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
            showValidation={!!validationErrors.payment}
          />
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <ReviewStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            isProcessing={isProcessing}
            showValidation={!!validationErrors.order}
          />
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <ConfirmationStep orderId={orderId} />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
