import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faWarehouse,
  faChartLine,
  faCog,
  faBars,
  faTimes,
  faSignOutAlt,
  faSearch,
  faUser,
  faBell,
  faUtensils,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../context/AdminContext';
import NotificationDropdown from './NotificationDropdown';
import SkipToContent from '../common/SkipToContent';

const AdminLayout = () => {
  const { adminUser, logout, error } = useAdmin();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Set error message when API error occurs
  useEffect(() => {
    if (error) {
      setErrorMessage(error);

      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // If not admin, redirect to admin login
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { path: '/admin', icon: faTachometerAlt, label: 'Dashboard' },
    { path: '/admin/products', icon: faBox, label: 'Products' },
    { path: '/admin/orders', icon: faShoppingCart, label: 'Orders' },
    { path: '/admin/customers', icon: faUsers, label: 'Customers' },
    { path: '/admin/inventory', icon: faWarehouse, label: 'Inventory' },
    { path: '/admin/recipes', icon: faUtensils, label: 'Recipes' },
    { path: '/admin/analytics', icon: faChartLine, label: 'Analytics' },
    { path: '/admin/notifications', icon: faBell, label: 'Notifications' },
    { path: '/admin/settings', icon: faCog, label: 'Settings' }
  ];

  // Check if path is active
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };



  return (
    <div className="flex h-screen bg-gray-100">
      <SkipToContent />
      {/* Sidebar - Desktop */}
      <aside
        className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobileMenuOpen ? 'translate-x-0' : ''}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold">Global Gourmet</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md lg:hidden text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mr-3 flex-shrink-0 h-4 w-4 ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 flex-shrink-0 h-4 w-4 text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10 fixed top-0 right-0 left-0 lg:left-64">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none hidden lg:block"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>

              <div className="ml-4 relative w-64 hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3">
                <NotificationDropdown />
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span className="ml-2 text-gray-700 hidden md:block">{adminUser?.firstName} {adminUser?.lastName}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto pt-16 pb-6 px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-700 hover:text-red-900"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
