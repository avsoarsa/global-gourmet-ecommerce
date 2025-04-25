import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faShoppingBag,
  faMoneyBillWave,
  faEdit,
  faTrash,
  faPlus,
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { getUserDetails, updateUserProfile } from '../../services/adminService';
import { formatDate, formatCurrency } from '../../utils/formatters';

// Fallback customers data in case API fails
const fallbackCustomers = [
  {
    id: 101,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    addresses: [
      {
        id: 1,
        type: 'Shipping',
        isDefault: true,
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      {
        id: 2,
        type: 'Billing',
        isDefault: true,
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    ],
    registeredDate: '2023-01-15',
    lastLoginDate: '2023-11-20',
    totalOrders: 12,
    totalSpent: 1250.75,
    recentOrders: [
      { id: 1234, date: '2023-11-20', total: 125.99, status: 'delivered' },
      { id: 1220, date: '2023-10-15', total: 89.50, status: 'delivered' },
      { id: 1198, date: '2023-09-02', total: 210.75, status: 'delivered' }
    ],
    notes: 'Prefers organic products. Allergic to nuts.'
  },
  {
    id: 102,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    addresses: [
      {
        id: 3,
        type: 'Shipping',
        isDefault: true,
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States'
      },
      {
        id: 4,
        type: 'Billing',
        isDefault: true,
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States'
      }
    ],
    registeredDate: '2023-02-20',
    lastLoginDate: '2023-11-19',
    totalOrders: 8,
    totalSpent: 890.50,
    recentOrders: [
      { id: 1233, date: '2023-11-19', total: 89.50, status: 'processing' },
      { id: 1210, date: '2023-10-05', total: 120.25, status: 'delivered' },
      { id: 1185, date: '2023-08-22', total: 75.99, status: 'delivered' }
    ],
    notes: 'Member of loyalty program. Prefers express shipping.'
  }
];

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Fetch customer data from backend
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user details from API
        const { success, data, error: apiError } = await getUserDetails(id);

        if (!success) {
          throw new Error(apiError || 'Failed to fetch customer details');
        }

        // Format customer for the UI
        const formattedCustomer = {
          id: data.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          addresses: data.addresses || [],
          registeredDate: data.createdAt,
          lastLoginDate: data.lastLoginAt,
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0,
          recentOrders: data.recentOrders || [],
          notes: data.notes || ''
        };

        setCustomer(formattedCustomer);
        setEditData({
          firstName: formattedCustomer.firstName,
          lastName: formattedCustomer.lastName,
          email: formattedCustomer.email,
          phone: formattedCustomer.phone,
          notes: formattedCustomer.notes
        });
      } catch (error) {
        console.error('Error fetching customer details:', error);
        setError(error.message || 'Failed to load customer details');

        // Try to use fallback data in case of error
        const foundCustomer = fallbackCustomers.find(c => c.id === parseInt(id));
        if (foundCustomer) {
          setCustomer(foundCustomer);
          setEditData({
            firstName: foundCustomer.firstName,
            lastName: foundCustomer.lastName,
            email: foundCustomer.email,
            phone: foundCustomer.phone,
            notes: foundCustomer.notes
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  // Handle edit customer
  const handleEditCustomer = async () => {
    try {
      setIsUpdating(true);

      // Update user profile via API
      const { success, data, error: apiError } = await updateUserProfile(customer.id, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        notes: editData.notes
      });

      if (!success) {
        throw new Error(apiError || 'Failed to update customer profile');
      }

      // Update local state
      const updatedCustomer = {
        ...customer,
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        notes: editData.notes
      };

      setCustomer(updatedCustomer);

      // Show success message
      alert('Customer profile updated successfully');
    } catch (error) {
      console.error('Error updating customer profile:', error);
      alert(`Error updating customer profile: ${error.message}`);
    } finally {
      setShowEditModal(false);
      setIsUpdating(false);
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-green-500 text-4xl mb-4" />
          <p className="text-gray-500">Loading customer details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !customer) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Customer</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
        <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/admin/customers"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/admin/customers"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Customer
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
        {/* Customer Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 text-3xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-700">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-700">{customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-900">Registered</p>
                    <p className="text-gray-700">{formatDate(customer.registeredDate)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-900">Last Login</p>
                    <p className="text-gray-700">{customer.lastLoginDate ? formatDate(customer.lastLoginDate) : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Stats</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-gray-400 h-5 w-5" />
                    <p className="ml-2 text-sm font-medium text-gray-500">Total Orders</p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{customer.totalOrders}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 h-5 w-5" />
                    <p className="ml-2 text-sm font-medium text-gray-500">Total Spent</p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notes</h2>
            </div>

            <div className="p-6">
              {customer.notes ? (
                <p className="text-sm text-gray-700">{customer.notes}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">No notes available for this customer.</p>
              )}
            </div>
          </div>
        </div>

        {/* Addresses and Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Addresses</h2>
              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add Address
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start mt-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 h-5 w-5 mt-0.5" />
                      <div className="ml-3 text-sm">
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-700">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-700">{address.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                View All Orders
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
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
                  {customer.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && (
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Customer
                    </h3>
                    <div className="mt-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={editData.firstName}
                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={editData.lastName}
                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows="3"
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleEditCustomer}
                  disabled={isUpdating}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isUpdating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
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

export default CustomerDetailPage;
