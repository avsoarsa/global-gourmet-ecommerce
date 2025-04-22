import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RegionProvider } from './context/RegionContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider } from './context/AdminContext';
import { CartNotificationProvider } from './context/CartNotificationContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import DebugPage from './pages/DebugPage';
import CartNotification from './components/cart/CartNotification';
import CartNotificationContainer from './components/cart/CartNotificationContainer';
import ActivityNotification from './components/common/ActivityNotification';
import Layout from './components/layout/Layout';
import ProductLayout from './components/layout/ProductLayout';
import ConversionLayout from './components/layout/ConversionLayout';
import LoginLayout from './components/layout/LoginLayout';
import AdminLayout from './components/admin/AdminLayout';

// Import admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrdersPage from './pages/admin/OrdersPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailPage from './pages/admin/CustomerDetailPage';
import InventoryPage from './pages/admin/InventoryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import RecipesPage from './pages/admin/RecipesPage';
import RecipeFormPage from './pages/admin/RecipeFormPage';

// Import lazy-loaded routes
import {
  LazyHomePage,
  LazyProductsPage,
  LazyProductDetailPage,
  LazyGiftBoxesPage,
  LazyCreateGiftBoxPage,
  LazyBulkOrdersPage,
  LazyAboutPage,
  LazyCartPage,
  LazyCheckoutPage,
  LazyWishlistPage,
  LazyAccountPage,
  LazyLoginPage,
  LazySearchResultsPage
} from './routes/LazyRoutes';

// Import i18n configuration
import './i18n';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  // Add a safety timeout to ensure the app renders even if some context providers are slow
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2000); // 2 second safety timeout

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <RegionProvider>
          <ErrorBoundary>
            <AuthProvider>
              <ErrorBoundary>
                <NotificationProvider>
                  <ErrorBoundary>
                    <LoyaltyProvider>
                      <ErrorBoundary>
                        <SubscriptionProvider>
                          <CartNotificationProvider>
                            <ErrorBoundary>
                              <CartProvider>
                                <ErrorBoundary>
                                  <RecentlyViewedProvider>
                                    <WishlistProvider>
                                      {/* Cart Notification */}
                                      <CartNotificationContainer />

                                      {/* Activity Notification */}
                                      <ActivityNotification interval={15000} duration={7000} position="bottom-right" className="z-50" />

                                      {/* Fallback loading state that will show if contexts take too long */}
                                      {!isAppReady && (
                                        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                                          <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading Global Gourmet...</p>
                                          </div>
                                        </div>
                                      )}
                                      <Routes>
                                        {/* Main Layout with Footer */}
                                        <Route path="/" element={<Layout />}>
                                          <Route index element={<LazyHomePage />} />
                                          <Route path="about" element={<LazyAboutPage />} />
                                          <Route path="wishlist" element={<LazyWishlistPage />} />
                                        </Route>

                                        {/* Pages with no footer */}
                                        <Route path="/" element={<ProductLayout />}>
                                          <Route path="products" element={<LazyProductsPage />} />
                                          <Route path="category/:categorySlug" element={<LazyProductsPage />} />
                                          <Route path="gift-boxes" element={<LazyGiftBoxesPage />} />
                                          <Route path="bulk-orders" element={<LazyBulkOrdersPage />} />
                                          <Route path="product/:productId" element={<LazyProductDetailPage />} />
                                          <Route path="create-gift-box" element={<LazyCreateGiftBoxPage />} />
                                          <Route path="account" element={<LazyAccountPage />} />
                                          <Route path="search" element={<LazySearchResultsPage />} />
                                        </Route>

                                        {/* Conversion Layout - No Footer */}
                                        <Route path="/" element={<ConversionLayout />}>
                                          <Route path="cart" element={<LazyCartPage />} />
                                          <Route path="checkout" element={<LazyCheckoutPage />} />
                                        </Route>

                                        {/* Login Layout - Minimal */}
                                        <Route path="/" element={<LoginLayout />}>
                                          <Route path="login" element={<LazyLoginPage />} />
                                        </Route>
                                        <Route path="debug" element={<DebugPage />} />

                                        {/* Admin Routes with AdminProvider */}
                                        <Route path="admin/*" element={
                                          <AdminProvider>
                                            <Routes>
                                              <Route path="login" element={<AdminLoginPage />} />
                                              <Route path="*" element={<AdminLayout />}>
                                                <Route index element={<AdminDashboardPage />} />
                                                <Route path="products" element={<ProductsPage />} />
                                                <Route path="products/new" element={<ProductFormPage />} />
                                                <Route path="products/:id/edit" element={<ProductFormPage />} />
                                                <Route path="orders" element={<OrdersPage />} />
                                                <Route path="orders/:id" element={<OrderDetailPage />} />
                                                <Route path="customers" element={<CustomersPage />} />
                                                <Route path="customers/:id" element={<CustomerDetailPage />} />
                                                <Route path="inventory" element={<InventoryPage />} />
                                                <Route path="recipes" element={<RecipesPage />} />
                                                <Route path="recipes/new" element={<RecipeFormPage />} />
                                                <Route path="recipes/:id/edit" element={<RecipeFormPage />} />
                                                <Route path="analytics" element={<AnalyticsPage />} />
                                                <Route path="notifications" element={<NotificationsPage />} />
                                                <Route path="settings" element={<SettingsPage />} />
                                              </Route>
                                            </Routes>
                                          </AdminProvider>
                                        } />
                                      </Routes>
                                    </WishlistProvider>
                                  </RecentlyViewedProvider>
                                </ErrorBoundary>
                              </CartProvider>
                            </ErrorBoundary>
                          </CartNotificationProvider>
                        </SubscriptionProvider>
                      </ErrorBoundary>
                    </LoyaltyProvider>
                  </ErrorBoundary>
                </NotificationProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorBoundary>
        </RegionProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
