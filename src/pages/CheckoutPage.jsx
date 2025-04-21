import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
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
  const STEPS = {
    SHIPPING: 'shipping',
    PAYMENT: 'payment',
    REVIEW: 'review',
    CONFIRMATION: 'confirmation'
  };

  // State
  const [currentStep, setCurrentStep] = useState(STEPS.SHIPPING);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

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

  // Handle step navigation
  const goToNextStep = () => {
    switch (currentStep) {
      case STEPS.SHIPPING:
        setCurrentStep(STEPS.PAYMENT);
        break;
      case STEPS.PAYMENT:
        setCurrentStep(STEPS.REVIEW);
        break;
      case STEPS.REVIEW:
        handlePlaceOrder();
        break;
      default:
        break;
    }

    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case STEPS.PAYMENT:
        setCurrentStep(STEPS.SHIPPING);
        break;
      case STEPS.REVIEW:
        setCurrentStep(STEPS.PAYMENT);
        break;
      default:
        break;
    }

    // Scroll to top when changing steps
    window.scrollTo(0, 0);
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

      // Clear cart and show confirmation
      clearCart();
      setCurrentStep(STEPS.CONFIRMATION);
      setOrderComplete(true);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="heading-2 mb-8">{t('checkout.title')}</h1>

      {/* Progress Indicator */}
      {currentStep !== STEPS.CONFIRMATION && (
        <CheckoutProgress currentStep={currentStep} steps={STEPS} />
      )}

      {/* Checkout Steps */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {currentStep === STEPS.SHIPPING && (
          <ShippingStep
            onNext={goToNextStep}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
          />
        )}

        {currentStep === STEPS.PAYMENT && (
          <PaymentStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}

        {currentStep === STEPS.REVIEW && (
          <ReviewStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === STEPS.CONFIRMATION && (
          <ConfirmationStep orderId={orderId} />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
