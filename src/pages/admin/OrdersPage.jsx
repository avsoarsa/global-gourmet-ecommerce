import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faEye,
  faFileInvoice,
  faCheckCircle,
  faTruck,
  faBoxOpen,
  faSpinner,
  faTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import ExportButton from '../../components/admin/ExportButton';

// Sample orders data (in a real app, this would come from an API)
const sampleOrders = [
  {
    id: 1234,
    customer: {
      id: 101,
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    date: '2023-11-20',
    total: 125.99,
    status: 'delivered',
    items: [
      { id: 1, name: 'Organic Almonds', quantity: 2, price: 24.99 },
      { id: 2, name: 'Premium Cashews', quantity: 1, price: 29.99 },
      { id: 3, name: 'Dried Cranberries', quantity: 3, price: 15.99 }
    ],
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard'
  },
  {
    id: 1233,
    customer: {
      id: 102,
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    date: '2023-11-19',
    total: 89.50,
    status: 'processing',
    items: [
      { id: 4, name: 'Organic Walnuts', quantity: 1, price: 27.50 },
      { id: 5, name: 'Dried Apricots', quantity: 2, price: 31.00 }
    ],
    paymentMethod: 'PayPal',
    shippingMethod: 'Express'
  },
  {
    id: 1232,
    customer: {
      id: 103,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com'
    },
    date: '2023-11-19',
    total: 210.75,
    status: 'shipped',
    items: [
      { id: 6, name: 'Gift Box - Premium', quantity: 1, price: 89.99 },
      { id: 7, name: 'Saffron Threads', quantity: 2, price: 59.99 }
    ],
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express'
  },
  {
    id: 1231,
    customer: {
      id: 104,
      name: 'Alice Brown',
      email: 'alice.brown@example.com'
    },
    date: '2023-11-18',
    total: 45.25,
    status: 'delivered',
    items: [
      { id: 8, name: 'Chia Seeds', quantity: 1, price: 12.99 },
      { id: 9, name: 'Quinoa', quantity: 2, price: 16.13 }
    ],
    paymentMethod: 'PayPal',
    shippingMethod: 'Standard'
  },
  {
    id: 1230,
    customer: {
      id: 105,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com'
    },
    date: '2023-11-18',
    total: 178.50,
    status: 'pending',
    items: [
      { id: 10, name: 'Mixed Nuts - Deluxe', quantity: 3, price: 59.50 }
    ],
    paymentMethod: 'Bank Transfer',
    shippingMethod: 'Standard'
  },
  {
    id: 1229,
    customer: {
      id: 106,
      name: 'Diana Miller',
      email: 'diana.miller@example.com'
    },
    date: '2023-11-17',
    total: 67.80,
    status: 'cancelled',
    items: [
      { id: 11, name: 'Dried Mango Slices', quantity: 2, price: 18.99 },
      { id: 12, name: 'Pistachios', quantity: 1, price: 29.82 }
    ],
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express'
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch orders (simulated)
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setOrders(sampleOrders);
      setFilteredOrders(sampleOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sort orders
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'customer':
          comparison = a.customer.name.localeCompare(b.customer.name);
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ExportButton
            data={filteredOrders}
            headers={[
              { label: 'Order ID', key: 'id' },
              { label: 'Customer', key: 'customer.name' },
              { label: 'Email', key: 'customer.email' },
              { label: 'Date', key: 'date', format: 'date' },
              { label: 'Total', key: 'total', format: 'currency' },
              { label: 'Status', key: 'status' },
              { label: 'Payment Method', key: 'paymentMethod' },
              { label: 'Shipping Method', key: 'shippingMethod' }
            ]}
            filename="orders-export"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="id">Sort by Order ID</option>
              <option value="customer">Sort by Customer</option>
              <option value="total">Sort by Total</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={toggleSortOrder}
                className="text-gray-400 hover:text-gray-500"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FontAwesomeIcon icon={faFileInvoice} className="mr-1" />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order #{selectedOrder.id}
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Information</h4>
                        <p className="text-sm text-gray-900">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-900">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Order Information</h4>
                        <p className="text-sm text-gray-900">Date: {selectedOrder.date}</p>
                        <p className="text-sm text-gray-900">Payment Method: {selectedOrder.paymentMethod}</p>
                        <p className="text-sm text-gray-900">Shipping Method: {selectedOrder.shippingMethod}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedOrder.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                Total:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                ${selectedOrder.total.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
