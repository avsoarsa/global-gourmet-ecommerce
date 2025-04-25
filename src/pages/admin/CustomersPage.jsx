import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faEye,
  faEnvelope,
  faShoppingBag,
  faUser,
  faUserPlus,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import ExportButton from '../../components/admin/ExportButton';
import { getAdminUsers } from '../../services/adminService';
import { formatDate, formatCurrency } from '../../utils/formatters';

// Fallback customers data in case API fails
const fallbackCustomers = [
  {
    id: 101,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    registeredDate: '2023-01-15',
    totalOrders: 12,
    totalSpent: 1250.75,
    lastOrderDate: '2023-11-20'
  },
  {
    id: 102,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States'
    },
    registeredDate: '2023-02-20',
    totalOrders: 8,
    totalSpent: 890.50,
    lastOrderDate: '2023-11-19'
  },
  {
    id: 103,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'United States'
    },
    registeredDate: '2023-03-10',
    totalOrders: 15,
    totalSpent: 1875.25,
    lastOrderDate: '2023-11-19'
  },
  {
    id: 104,
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    phone: '+1 (555) 789-0123',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'United States'
    },
    registeredDate: '2023-04-05',
    totalOrders: 5,
    totalSpent: 425.30,
    lastOrderDate: '2023-11-18'
  },
  {
    id: 105,
    firstName: 'Charlie',
    lastName: 'Wilson',
    email: 'charlie.wilson@example.com',
    phone: '+1 (555) 234-5678',
    address: {
      street: '654 Maple Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'United States'
    },
    registeredDate: '2023-05-12',
    totalOrders: 3,
    totalSpent: 178.50,
    lastOrderDate: '2023-11-18'
  },
  {
    id: 106,
    firstName: 'Diana',
    lastName: 'Miller',
    email: 'diana.miller@example.com',
    phone: '+1 (555) 345-6789',
    address: {
      street: '987 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States'
    },
    registeredDate: '2023-06-25',
    totalOrders: 7,
    totalSpent: 720.80,
    lastOrderDate: '2023-11-17'
  }
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Map frontend sort fields to backend fields
        const backendSortBy =
          sortBy === 'name' ? 'first_name' :
          sortBy === 'email' ? 'email' :
          sortBy === 'orders' ? 'total_orders' :
          sortBy === 'spent' ? 'total_spent' :
          sortBy === 'date' ? 'created_at' :
          'first_name';

        // Get users from API
        const { success, data, error: apiError } = await getAdminUsers({
          page,
          pageSize,
          sortBy: backendSortBy,
          sortDesc: sortOrder === 'desc',
          search: searchTerm
        });

        if (!success) {
          throw new Error(apiError || 'Failed to fetch customers');
        }

        // Format customers for the UI
        const formattedCustomers = data.users.map(user => ({
          id: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          registeredDate: user.createdAt,
          lastLoginDate: user.lastLoginAt,
          totalOrders: user.totalOrders || 0,
          totalSpent: user.totalSpent || 0,
          lastOrderDate: user.lastOrderDate || '',
          notes: user.notes || ''
        }));

        setCustomers(formattedCustomers);
        setFilteredCustomers(formattedCustomers);
        setTotalPages(data.totalPages);
        setTotalCustomers(data.total);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError(error.message || 'Failed to load customers');

        // Use fallback data in case of error
        setCustomers(fallbackCustomers);
        setFilteredCustomers(fallbackCustomers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [page, pageSize, sortBy, sortOrder, searchTerm]);

  // Filter and sort customers
  useEffect(() => {
    let result = [...customers];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Sort customers
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'orders':
          comparison = a.totalOrders - b.totalOrders;
          break;
        case 'spent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'date':
          comparison = new Date(a.registeredDate) - new Date(b.registeredDate);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCustomers(result);
  }, [customers, searchTerm, sortBy, sortOrder]);

  // View customer details
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-green-500 text-4xl mb-4" />
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Customers</h3>
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

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <ExportButton
            data={filteredCustomers}
            headers={[
              { label: 'ID', key: 'id' },
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Registered Date', key: 'registeredDate', format: 'date' },
              { label: 'Total Orders', key: 'totalOrders', format: 'number' },
              { label: 'Total Spent', key: 'totalSpent', format: 'currency' }
            ]}
            filename="customers-export"
          />
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
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
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="orders">Sort by Orders</option>
              <option value="spent">Sort by Total Spent</option>
              <option value="date">Sort by Registration Date</option>
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

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.totalOrders} orders
                    <div className="text-xs text-gray-400">
                      {customer.lastOrderDate ? `Last order: ${formatDate(customer.lastOrderDate)}` : 'No orders yet'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.registeredDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewCustomer(customer)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                      Email
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No customers found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{totalCustomers}</span> customers
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page > 1
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (page <= 3) {
                // If near start, show first 5
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                // If near end, show last 5
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show current page and 2 on each side
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pageNum === page
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page < totalPages
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
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
                        Customer Details
                      </h3>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${selectedCustomer.email}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                          Email
                        </a>
                        <Link
                          to={`/admin/customers/${selectedCustomer.id}/orders`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FontAwesomeIcon icon={faShoppingBag} className="mr-1" />
                          Orders
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Personal Information</h4>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Name:</span> {selectedCustomer.firstName} {selectedCustomer.lastName}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Email:</span> {selectedCustomer.email}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Phone:</span> {selectedCustomer.phone}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Registered:</span> {formatDate(selectedCustomer.registeredDate)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                        {selectedCustomer.address && selectedCustomer.address.street ? (
                          <>
                            <p className="text-sm text-gray-900">{selectedCustomer.address.street}</p>
                            <p className="text-sm text-gray-900">
                              {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}
                            </p>
                            <p className="text-sm text-gray-900">{selectedCustomer.address.country}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No address on file</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm font-medium text-gray-500">Total Orders</div>
                          <div className="mt-1 text-2xl font-semibold text-gray-900">{selectedCustomer.totalOrders}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm font-medium text-gray-500">Total Spent</div>
                          <div className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(selectedCustomer.totalSpent)}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm font-medium text-gray-500">Last Order</div>
                          <div className="mt-1 text-lg font-semibold text-gray-900">
                            {selectedCustomer.lastOrderDate ? formatDate(selectedCustomer.lastOrderDate) : 'No orders yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
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

export default CustomersPage;
