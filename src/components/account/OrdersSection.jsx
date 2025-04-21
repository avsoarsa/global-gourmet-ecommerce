import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faEye, faFileInvoice,
  faCheckCircle, faTruck, faBoxOpen, faSpinner,
  faRedo, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { format, parseISO } from 'date-fns';
import OrderTracking from './OrderTracking';
import { useRegion } from '../../context/RegionContext';

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />;
    case 'shipped':
      return <FontAwesomeIcon icon={faTruck} className="text-blue-600" />;
    case 'processing':
      return <FontAwesomeIcon icon={faSpinner} className="text-yellow-600" />;
    case 'pending':
      return <FontAwesomeIcon icon={faBoxOpen} className="text-gray-600" />;
    default:
      return <FontAwesomeIcon icon={faBoxOpen} className="text-gray-600" />;
  }
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, onClose, products }) => {
  // In a real app, we would fetch the product details from the API
  // For now, we'll use dummy data
  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId) || {
      name: `Product #${productId}`,
      image: 'https://via.placeholder.com/80',
      price: 0
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="heading-3">Order #{order.id}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <p className="text-gray-600">Order Date</p>
              <p className="font-semibold">{format(parseISO(order.date), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Status</p>
              <p className="font-semibold flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2">{order.status}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="heading-4 mb-3">Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => {
                    const product = getProductDetails(item.productId);
                    return (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">ID: {item.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-medium">Subtotal</td>
                    <td className="px-4 py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-medium">Shipping</td>
                    <td className="px-4 py-3 text-right font-medium">$0.00</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-medium">Total</td>
                    <td className="px-4 py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="heading-4 mb-3">Shipping Address</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h4 className="heading-4 mb-3">Shipping Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.status === 'Delivered' ? (
                  <div>
                    <p className="font-medium">Delivered on {format(parseISO(order.date), 'MMMM d, yyyy')}</p>
                    <p className="text-gray-600">Your package was delivered successfully.</p>
                  </div>
                ) : order.status === 'Shipped' ? (
                  <div>
                    <p className="font-medium">Shipped on {format(parseISO(order.date), 'MMMM d, yyyy')}</p>
                    <p className="text-gray-600">Tracking Number: TRK123456789</p>
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                      Track Package
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Order {order.status}</p>
                    <p className="text-gray-600">Your order is being prepared for shipment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button className="btn-outline">
              <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
              Download Invoice
            </button>
            <button className="btn-primary">
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersSection = ({ orders }) => {
  const { t } = useTranslation();
  const { formatPrice } = useRegion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'tracking'
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Dummy products data (in a real app, this would come from an API)
  const products = [
    { id: 1, name: "Organic Almonds", image: "https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFsbW9uZHN8ZW58MHx8MHx8fDA%3D", price: 12.99 },
    { id: 2, name: "Dried Cranberries", image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JhbmJlcnJpZXN8ZW58MHx8MHx8fDA%3D", price: 9.99 },
    { id: 3, name: "Cashew Nuts", image: "https://images.unsplash.com/photo-1563412885-a1e904cf631c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FzaGV3fGVufDB8fDB8fHww", price: 14.99 },
    { id: 4, name: "Organic Walnuts", image: "https://images.unsplash.com/photo-1604045838308-c2c5d3fb7edf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FsbnV0c3xlbnwwfHwwfHx8MA%3D%3D", price: 18.99 },
    { id: 5, name: "Dried Apricots", image: "https://images.unsplash.com/photo-1600179893732-7c6683e92dd9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXByaWNvdHN8ZW58MHx8MHx8fDA%3D", price: 14.99 },
    { id: 6, name: "Pistachios", image: "https://images.unsplash.com/photo-1615887588890-43c3f01a48a8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGlzdGFjaGlvc3xlbnwwfHwwfHx8MA%3D%3D", price: 8.99 },
    { id: 7, name: "Organic Dates", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGF0ZXN8ZW58MHx8MHx8fDA%3D", price: 29.99 },
  ];

  // Add tracking events to orders for the OrderTracking component
  const ordersWithEvents = orders.map(order => {
    // Generate sample events based on order status
    const events = [];

    // Order placed event (always present)
    events.push({
      type: 'order_placed',
      date: format(parseISO(order.date), 'MM/dd/yyyy'),
      time: format(parseISO(order.date), 'h:mm a'),
      description: t('account.orderPlacedDesc')
    });

    // Processing event
    if (['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())) {
      const processingDate = new Date(parseISO(order.date));
      processingDate.setDate(processingDate.getDate() + 1);

      events.push({
        type: 'processing',
        date: format(processingDate, 'MM/dd/yyyy'),
        time: format(processingDate, 'h:mm a'),
        description: t('account.processingDesc')
      });
    }

    // Shipped event
    if (['shipped', 'delivered'].includes(order.status.toLowerCase())) {
      const shippedDate = new Date(parseISO(order.date));
      shippedDate.setDate(shippedDate.getDate() + 3);

      events.push({
        type: 'shipped',
        date: format(shippedDate, 'MM/dd/yyyy'),
        time: format(shippedDate, 'h:mm a'),
        description: t('account.shippedDesc')
      });
    }

    // Delivered event
    if (order.status.toLowerCase() === 'delivered') {
      const deliveredDate = new Date(parseISO(order.date));
      deliveredDate.setDate(deliveredDate.getDate() + 5);

      events.push({
        type: 'delivered',
        date: format(deliveredDate, 'MM/dd/yyyy'),
        time: format(deliveredDate, 'h:mm a'),
        description: t('account.deliveredDesc')
      });
    }

    // Add tracking number and carrier for shipped/delivered orders
    const enhancedOrder = {
      ...order,
      events,
      carrier: order.status.toLowerCase() === 'shipped' || order.status.toLowerCase() === 'delivered' ? 'FedEx' : null,
      trackingNumber: order.status.toLowerCase() === 'shipped' || order.status.toLowerCase() === 'delivered' ? 'TRK123456789' : null
    };

    return enhancedOrder;
  });

  // Handle tracking an order
  const handleTrackOrder = (order) => {
    setTrackingOrder(ordersWithEvents.find(o => o.id === order.id));
    setViewMode('tracking');
  };

  // Handle reordering
  const handleReorder = (order) => {
    // In a real app, this would add the items to the cart
    console.log(`Reordering items from order #${order.id}`);
  };

  // Filter orders based on search term and status
  const filteredOrders = ordersWithEvents.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         order.date.includes(searchTerm) ||
                         order.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {viewMode === 'tracking' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-3">{t('account.trackOrder')}</h2>
            <button
              onClick={() => setViewMode('list')}
              className="btn-outline-sm"
            >
              &larr; {t('account.backToOrders')}
            </button>
          </div>

          <OrderTracking order={trackingOrder} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-3">{t('account.orderHistory')}</h2>

            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('account.searchOrders')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-2"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select py-2"
              >
                <option value="all">{t('account.allOrders')}</option>
                <option value="pending">{t('account.status.pending')}</option>
                <option value="processing">{t('account.status.processing')}</option>
                <option value="shipped">{t('account.status.shipped')}</option>
                <option value="delivered">{t('account.status.delivered')}</option>
              </select>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('account.orderNumber')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('account.orderDate')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('account.orderStatus')}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">{t('cart.total')}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium">#{order.id}</td>
                      <td className="px-4 py-4">{format(parseISO(order.date), 'MMM d, yyyy')}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-2">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">{formatPrice(order.total)}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            title={t('account.viewDetails')}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>

                          <button
                            onClick={() => handleTrackOrder(order)}
                            className="text-green-600 hover:text-green-700 font-medium"
                            title={t('account.trackOrder')}
                          >
                            <FontAwesomeIcon icon={faTruck} />
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                            title={t('account.reorder')}
                          >
                            <FontAwesomeIcon icon={faRedo} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">{t('account.noOrdersFound')}</p>
            </div>
          )}

          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              products={products}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
