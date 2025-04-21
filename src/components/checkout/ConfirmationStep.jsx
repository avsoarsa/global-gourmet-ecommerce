import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faFileInvoice,
  faShoppingBag,
  faHome,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const ConfirmationStep = ({ orderId }) => {
  const { t } = useTranslation();
  
  // Get current date and estimated delivery date
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + 5); // Delivery in 5 days
  
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('checkout.orderConfirmed')}
        </h2>
        
        <p className="text-gray-600">
          {t('checkout.thankYouMessage')}
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('checkout.orderDetails')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">{t('checkout.orderNumber')}</p>
              <p className="font-medium text-gray-900">#{orderId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('checkout.orderDate')}</p>
              <p className="font-medium text-gray-900">{formatDate(currentDate)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('checkout.estimatedDelivery')}</p>
              <p className="font-medium text-gray-900">{formatDate(deliveryDate)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{t('checkout.paymentMethod')}</p>
              <p className="font-medium text-gray-900">Credit Card</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            {t('checkout.confirmationEmailSent')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link 
          to="/account?tab=orders" 
          className="btn-outline py-3 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
          {t('checkout.viewOrder')}
        </Link>
        
        <button className="btn-outline py-3 flex items-center justify-center">
          <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
          {t('checkout.downloadInvoice')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/" 
          className="btn-outline py-3 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          {t('checkout.continueShopping')}
        </Link>
        
        <button className="btn-primary py-3 flex items-center justify-center">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          {t('checkout.contactSupport')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
