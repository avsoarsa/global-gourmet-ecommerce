import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faShoppingBag, faMapMarkerAlt,
  faBell, faHeart, faCreditCard, faSignOutAlt,
  faStar, faGift, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import ProfileSection from '../components/account/ProfileSection';
import OrdersSection from '../components/account/OrdersSection';
import AddressesSection from '../components/account/AddressesSection';
import SavedPaymentMethods from '../components/account/SavedPaymentMethods';
import LoyaltyPoints from '../components/account/LoyaltyPoints';
import Subscriptions from '../components/account/Subscriptions';
import PersonalizedRecommendations from '../components/account/PersonalizedRecommendations';
import AccountDashboard from '../components/account/AccountDashboard';

const AccountPage = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // Set active tab based on URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && [
      'dashboard',
      'profile',
      'orders',
      'addresses',
      'payment-methods',
      'rewards',
      'subscriptions',
      'recommendations'
    ].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Update URL when tab changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', activeTab);
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [activeTab, location.pathname]);

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AccountDashboard user={currentUser} />;
      case 'profile':
        return <ProfileSection user={currentUser} />;
      case 'orders':
        return <OrdersSection orders={currentUser.orders} />;
      case 'addresses':
        return <AddressesSection addresses={currentUser.addresses} />;
      case 'payment-methods':
        return <SavedPaymentMethods />;
      case 'rewards':
        return <LoyaltyPoints user={currentUser} />;
      case 'subscriptions':
        return <Subscriptions user={currentUser} />;
      case 'recommendations':
        return <PersonalizedRecommendations user={currentUser} orderHistory={currentUser.orders} />;
      default:
        return <AccountDashboard user={currentUser} />;
    }
  };

  // Get tab title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t('account.dashboard', 'Dashboard');
      case 'profile':
        return t('account.profile', 'Profile');
      case 'orders':
        return t('account.orders', 'Orders');
      case 'addresses':
        return t('account.addresses', 'Addresses');
      case 'payment-methods':
        return t('account.paymentMethods', 'Payment Methods');
      case 'rewards':
        return t('account.rewards', 'Rewards');
      case 'subscriptions':
        return t('account.subscriptions', 'Subscriptions');
      case 'recommendations':
        return t('account.recommendations', 'Recommendations');
      default:
        return t('account.dashboard', 'Dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="heading-2 mb-8">{t('account.myAccount')}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{currentUser.firstName} {currentUser.lastName}</h2>
                  <p className="text-white/80">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="mr-3" />
                    <span>{t('account.dashboard', 'Dashboard')}</span>
                  </button>
                </li>

                {/* Profile */}
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3" />
                    <span>{t('account.profile')}</span>
                  </button>
                </li>

                {/* Orders */}
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faShoppingBag} className="mr-3" />
                    <span>{t('account.orders')}</span>
                  </button>
                </li>

                {/* Addresses */}
                <li>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'addresses'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                    <span>{t('account.addresses')}</span>
                  </button>
                </li>

                {/* Payment Methods */}
                <li>
                  <button
                    onClick={() => setActiveTab('payment-methods')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'payment-methods'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="mr-3" />
                    <span>{t('account.paymentMethods', 'Payment Methods')}</span>
                  </button>
                </li>

                {/* Rewards */}
                <li>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'rewards'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} className="mr-3" />
                    <span>{t('account.rewards')}</span>
                  </button>
                </li>

                {/* Subscriptions */}
                <li>
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'subscriptions'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGift} className="mr-3" />
                    <span>{t('account.subscriptions')}</span>
                  </button>
                </li>

                {/* Recommendations */}
                <li>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition-colors ${
                      activeTab === 'recommendations'
                        ? 'bg-green-50 text-green-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="mr-3" />
                    <span>{t('account.recommendations')}</span>
                  </button>
                </li>

                {/* Wishlist */}
                <li>
                  <a
                    href="/wishlist"
                    className="w-full text-left px-4 py-3 rounded-md flex items-center transition-colors hover:bg-gray-50 text-gray-700"
                  >
                    <FontAwesomeIcon icon={faHeart} className="mr-3" />
                    <span>{t('account.wishlist')}</span>
                  </a>
                </li>

                {/* Sign Out */}
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-md flex items-center transition-colors hover:bg-red-50 text-red-600"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    <span>{t('account.signOut')}</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab Header */}
            {activeTab !== 'dashboard' && (
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">{getTabTitle()}</h2>
              </div>
            )}

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
