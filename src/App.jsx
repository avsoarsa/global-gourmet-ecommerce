import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RegionProvider } from './context/RegionContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
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
  LazyLoginPage
} from './routes/LazyRoutes';

// Import i18n configuration
import './i18n';

function App() {
  return (
    <Router>
      <RegionProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
              <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LazyHomePage />} />
                <Route path="products" element={<LazyProductsPage />} />
                <Route path="product/:productId" element={<LazyProductDetailPage />} />
                <Route path="category/:categorySlug" element={<LazyProductsPage />} />
                <Route path="gift-boxes" element={<LazyGiftBoxesPage />} />
                <Route path="create-gift-box" element={<LazyCreateGiftBoxPage />} />
                <Route path="bulk-orders" element={<LazyBulkOrdersPage />} />
                <Route path="about" element={<LazyAboutPage />} />
                <Route path="cart" element={<LazyCartPage />} />
                <Route path="checkout" element={<LazyCheckoutPage />} />
                <Route path="wishlist" element={<LazyWishlistPage />} />
                <Route path="account" element={<LazyAccountPage />} />
              </Route>
              <Route path="login" element={<LazyLoginPage />} />

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
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </RegionProvider>
    </Router>
  );
}

export default App;
