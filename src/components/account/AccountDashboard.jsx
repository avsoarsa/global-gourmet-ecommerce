import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faMapMarkerAlt,
  faCreditCard,
  faStar,
  faGift,
  faChartLine,
  faHeart,
  faBoxOpen,
  faExclamationTriangle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

/**
 * Account dashboard component showing overview of user account
 */
const AccountDashboard = ({ user }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    savedAddresses: 0,
    paymentMethods: 0,
    loyaltyPoints: 0,
    activeSubscriptions: 0,
    wishlistItems: 0
  });
  
  // Load user data
  useEffect(() => {
    if (user) {
      // Get recent orders (last 3)
      const orders = user.orders || [];
      setRecentOrders(orders.slice(0, 3));
      
      // Calculate stats
      setStats({
        totalOrders: orders.length,
        savedAddresses: (user.addresses || []).length,
        paymentMethods: (user.paymentMethods || []).length,
        loyaltyPoints: user.loyaltyPoints || 0,
        activeSubscriptions: (user.subscriptions || []).filter(sub => sub.status === 'active').length,
        wishlistItems: (user.wishlist || []).length
      });
    }
  }, [user]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
        <p className="opacity-90">Here's an overview of your account and recent activity.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FontAwesomeIcon icon={faShoppingBag} className="text-blue-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FontAwesomeIcon icon={faStar} className="text-purple-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Loyalty Points</div>
              <div className="text-2xl font-bold">{stats.loyaltyPoints}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FontAwesomeIcon icon={faHeart} className="text-red-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Wishlist Items</div>
              <div className="text-2xl font-bold">{stats.wishlistItems}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/account?tab=orders" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
            View All <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentOrders.length > 0 ? (
            recentOrders.map(order => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="bg-gray-100 p-2 rounded-md mr-4">
                      <FontAwesomeIcon icon={faBoxOpen} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-6">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className={`font-medium ${
                        order.status === 'Delivered' ? 'text-green-600' : 
                        order.status === 'Processing' ? 'text-blue-600' : 
                        order.status === 'Shipped' ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="mr-6">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                    </div>
                    
                    <Link 
                      to={`/account?tab=orders&id=${order.id}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mb-2" />
              <p>You haven't placed any orders yet.</p>
              <Link to="/products" className="mt-2 inline-block text-green-600 hover:text-green-700 font-medium">
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Account Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          to="/account?tab=addresses" 
          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
          </div>
          <div>
            <div className="font-medium">Manage Addresses</div>
            <div className="text-sm text-gray-500">{stats.savedAddresses} saved addresses</div>
          </div>
        </Link>
        
        <Link 
          to="/account?tab=payment-methods" 
          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FontAwesomeIcon icon={faCreditCard} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">Payment Methods</div>
            <div className="text-sm text-gray-500">{stats.paymentMethods} saved cards</div>
          </div>
        </Link>
        
        <Link 
          to="/account?tab=subscriptions" 
          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FontAwesomeIcon icon={faGift} className="text-purple-600" />
          </div>
          <div>
            <div className="font-medium">Subscriptions</div>
            <div className="text-sm text-gray-500">{stats.activeSubscriptions} active subscriptions</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AccountDashboard;
