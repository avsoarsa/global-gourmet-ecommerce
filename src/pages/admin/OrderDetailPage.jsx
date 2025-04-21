import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFileInvoice,
  faEnvelope,
  faEdit,
  faCheckCircle,
  faTruck,
  faBoxOpen,
  faSpinner,
  faTimes,
  faExclamationTriangle,
  faUser,
  faMapMarkerAlt,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

// Sample orders data (in a real app, this would come from an API)
const sampleOrders = [
  {
    id: 1234,
    customer: {
      id: 101,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    date: '2023-11-20',
    total: 125.99,
    subtotal: 119.99,
    tax: 6.00,
    shipping: 0,
    status: 'delivered',
    items: [
      { id: 1, name: 'Organic Almonds', quantity: 2, price: 24.99, total: 49.98 },
      { id: 2, name: 'Premium Cashews', quantity: 1, price: 29.99, total: 29.99 },
      { id: 3, name: 'Dried Cranberries', quantity: 3, price: 15.99, total: 47.97 }
    ],
    paymentMethod: 'Credit Card',
    paymentDetails: {
      cardType: 'Visa',
      lastFour: '4242',
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    shippingMethod: 'Standard',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    notes: '',
    timeline: [
      { date: '2023-11-20T14:30:00', status: 'delivered', note: 'Package delivered' },
      { date: '2023-11-18T09:15:00', status: 'shipped', note: 'Package shipped via USPS' },
      { date: '2023-11-17T16:45:00', status: 'processing', note: 'Order processed and ready for shipment' },
      { date: '2023-11-17T10:30:00', status: 'pending', note: 'Payment confirmed' },
      { date: '2023-11-17T10:20:00', status: 'pending', note: 'Order placed' }
    ]
  },
  {
    id: 1233,
    customer: {
      id: 102,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543'
    },
    date: '2023-11-19',
    total: 89.50,
    subtotal: 82.50,
    tax: 7.00,
    shipping: 0,
    status: 'processing',
    items: [
      { id: 4, name: 'Organic Walnuts', quantity: 1, price: 27.50, total: 27.50 },
      { id: 5, name: 'Dried Apricots', quantity: 2, price: 31.00, total: 62.00 }
    ],
    paymentMethod: 'PayPal',
    paymentDetails: {
      email: 'jane.smith@example.com',
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States'
      }
    },
    shippingMethod: 'Express',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States'
    },
    notes: 'Please leave package at the front door',
    timeline: [
      { date: '2023-11-19T11:20:00', status: 'processing', note: 'Order processed and ready for shipment' },
      { date: '2023-11-19T10:15:00', status: 'pending', note: 'Payment confirmed' },
      { date: '2023-11-19T10:10:00', status: 'pending', note: 'Order placed' }
    ]
  }
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // Fetch order data (simulated)
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const foundOrder = sampleOrders.find(o => o.id === parseInt(id));
      
      if (foundOrder) {
        setOrder(foundOrder);
        setNewStatus(foundOrder.status);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
      case 'processing':
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500" />;
      case 'shipped':
        return <FontAwesomeIcon icon={faTruck} className="text-purple-500" />;
      case 'delivered':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimes} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faBoxOpen} className="text-gray-500" />;
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle status update
  const handleStatusUpdate = () => {
    if (!newStatus) {
      return;
    }
    
    // In a real app, this would be an API call
    const updatedOrder = {
      ...order,
      status: newStatus,
      timeline: [
        {
          date: new Date().toISOString(),
          status: newStatus,
          note: statusNote || `Status updated to ${newStatus}`
        },
        ...order.timeline
      ]
    };
    
    setOrder(updatedOrder);
    setStatusUpdateOpen(false);
    setStatusNote('');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Orders
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/admin/orders"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
          <span className={`ml-4 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusUpdateOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Update Status
          </button>
          
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
            Generate Invoice
          </button>
          
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Email Customer
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details and Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium text-gray-500">Tax</span>
                <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">
                  {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Timeline</h2>
            </div>
            
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== order.timeline.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusBadgeClass(event.status)}`}>
                              {getStatusIcon(event.status)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900 capitalize">{event.status}</span>
                                {event.note && ` - ${event.note}`}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(event.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer and Shipping Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{order.customer.name}</h3>
                  <p className="text-sm text-gray-500">Customer ID: {order.customer.id}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="mt-1 text-sm text-gray-900">{order.date}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to={`/admin/customers/${order.customer.id}`}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  View Customer Profile
                </Link>
              </div>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 h-5 w-5" />
                </div>
                <div className="ml-3 text-sm">
                  <p className="font-medium text-gray-900">Shipping Address</p>
                  <p className="text-gray-700 mt-1">{order.shippingAddress.street}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900">Shipping Method</p>
                <p className="mt-1 text-sm text-gray-700">{order.shippingMethod}</p>
              </div>
              
              {order.notes && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900">Order Notes</p>
                  <p className="mt-1 text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 h-5 w-5" />
                </div>
                <div className="ml-3 text-sm">
                  <p className="font-medium text-gray-900">Payment Method</p>
                  <p className="text-gray-700 mt-1">{order.paymentMethod}</p>
                  
                  {order.paymentMethod === 'Credit Card' && (
                    <p className="text-gray-700 mt-1">
                      {order.paymentDetails.cardType} ending in {order.paymentDetails.lastFour}
                    </p>
                  )}
                  
                  {order.paymentMethod === 'PayPal' && (
                    <p className="text-gray-700 mt-1">
                      PayPal Account: {order.paymentDetails.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900">Billing Address</p>
                <p className="mt-1 text-sm text-gray-700">{order.paymentDetails.billingAddress.street}</p>
                <p className="text-sm text-gray-700">
                  {order.paymentDetails.billingAddress.city}, {order.paymentDetails.billingAddress.state} {order.paymentDetails.billingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-700">{order.paymentDetails.billingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Update Modal */}
      {statusUpdateOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Update Order Status
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update the status of order #{order.id}
                      </p>
                      <div className="mt-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                          Note (optional)
                        </label>
                        <textarea
                          id="note"
                          name="note"
                          rows="3"
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Add a note about this status change"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setStatusUpdateOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
