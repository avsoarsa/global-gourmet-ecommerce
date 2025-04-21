import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faTruck, faCheckCircle, faSpinner,
  faMapMarkerAlt, faCalendarAlt, faClock, faInfoCircle,
  faDownload, faRedo
} from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';

// Sample order statuses
const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Order Timeline Component
const OrderTimeline = ({ status, events }) => {
  const { t } = useTranslation();
  
  // Define the steps in the order process
  const steps = [
    { 
      key: 'order_placed', 
      label: t('account.orderPlaced', 'Order Placed'),
      icon: faBox,
      completed: true // Order placed is always completed
    },
    { 
      key: 'processing', 
      label: t('account.processing', 'Processing'),
      icon: faSpinner,
      completed: ['processing', 'shipped', 'delivered'].includes(status)
    },
    { 
      key: 'shipped', 
      label: t('account.shipped', 'Shipped'),
      icon: faTruck,
      completed: ['shipped', 'delivered'].includes(status)
    },
    { 
      key: 'delivered', 
      label: t('account.delivered', 'Delivered'),
      icon: faCheckCircle,
      completed: status === 'delivered'
    }
  ];
  
  return (
    <div className="py-4">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const event = events.find(e => e.type === step.key);
            
            return (
              <div key={step.key} className="relative flex items-start">
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                
                <div className="ml-4">
                  <h4 className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  
                  {event && (
                    <div className="mt-1 text-xs text-gray-500">
                      <div>{event.date} {event.time}</div>
                      {event.description && (
                        <div className="mt-1">{event.description}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Order Details Component
const OrderDetails = ({ order }) => {
  const { t } = useTranslation();
  const { formatPrice } = useRegion();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t('account.orderDetails')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('account.orderNumber')}: #{order.id}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button className="btn-outline-sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              {t('account.downloadInvoice')}
            </button>
            
            {order.status !== ORDER_STATUSES.CANCELLED && (
              <button className="btn-primary-sm">
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                {t('account.reorder')}
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-500 mb-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
              {t('account.orderDate')}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {order.date}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-500 mb-1">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" />
              {t('account.orderStatus')}
            </div>
            <div className={`text-sm font-medium ${
              order.status === ORDER_STATUSES.DELIVERED 
                ? 'text-green-600' 
                : order.status === ORDER_STATUSES.CANCELLED 
                  ? 'text-red-600' 
                  : 'text-blue-600'
            }`}>
              {t(`account.status.${order.status}`, order.status)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-500 mb-1">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
              {t('checkout.shippingAddress')}
            </div>
            <div className="text-sm text-gray-900">
              {order.shippingAddress.street}, {order.shippingAddress.city}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            {t('account.orderItems')}
          </h4>
          
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.product')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.quantity')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cart.price')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={item.image} 
                            alt={item.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatPrice(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    {t('cart.subtotal')}:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatPrice(order.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    {t('cart.shipping')}:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatPrice(order.shipping)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    {t('cart.tax')}:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatPrice(order.tax)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    {t('cart.total')}:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main OrderTracking Component
const OrderTracking = ({ order }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('timeline');
  
  if (!order) {
    return (
      <div className="text-center py-8">
        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-4" />
        <p className="text-gray-500">{t('account.noOrderSelected')}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'timeline'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('account.trackOrder')}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'details'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('account.orderDetails')}
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'timeline' ? (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('account.trackingInformation')}
            </h3>
            
            {order.status === ORDER_STATUSES.CANCELLED ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {t('account.orderCancelled')}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{order.cancellationReason || t('account.orderCancelledMessage')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <OrderTimeline status={order.status} events={order.events} />
            )}
            
            {order.trackingNumber && order.carrier && (
              <div className="mt-6 bg-gray-50 rounded-md p-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">
                    {t('account.trackingNumber')}
                  </div>
                  <div className="text-gray-500 mb-3">
                    {order.carrier}: {order.trackingNumber}
                  </div>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                    {t('account.trackWithCarrier', { carrier: order.carrier })}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <OrderDetails order={order} />
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
