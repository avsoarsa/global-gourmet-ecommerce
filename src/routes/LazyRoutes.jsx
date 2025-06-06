import { lazy, Suspense } from 'react';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import FallbackLoginPage from '../components/auth/FallbackLoginPage';
import SimpleErrorBoundary from '../components/common/SimpleErrorBoundary';

// Enhanced lazy loading with prefetch and error handling
const lazyWithPreload = (factory) => {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
};

// Group related pages for better code splitting

// Core pages (higher priority)
const HomePage = lazyWithPreload(() => import(/* webpackChunkName: "home" */ '../pages/HomePage'));
const PersonalizedHomePage = lazyWithPreload(() => import(/* webpackChunkName: "personalized-home" */ '../pages/PersonalizedHomePage'));
const ProductsPage = lazyWithPreload(() => import(/* webpackChunkName: "products" */ '../pages/ProductsPage'));
const ProductDetailPage = lazyWithPreload(() => import(/* webpackChunkName: "product-detail" */ '../pages/ProductDetailPage'));

// Shopping pages
const CartPage = lazyWithPreload(() => import(/* webpackChunkName: "cart" */ '../pages/CartPage'));
const CheckoutPage = lazyWithPreload(() => import(/* webpackChunkName: "checkout" */ '../pages/CheckoutPage'));
const WishlistPage = lazyWithPreload(() => import(/* webpackChunkName: "wishlist" */ '../pages/WishlistPage'));

// Gift and specialty pages
const GiftBoxesPage = lazyWithPreload(() => import(/* webpackChunkName: "gift-boxes" */ '../pages/GiftBoxesPage'));
const CreateGiftBoxPage = lazyWithPreload(() => import(/* webpackChunkName: "create-gift-box" */ '../pages/CreateGiftBoxPage'));
const BulkOrdersPage = lazyWithPreload(() => import(/* webpackChunkName: "bulk-orders" */ '../pages/BulkOrdersPage'));

// User account pages
const AccountPage = lazyWithPreload(() => import(/* webpackChunkName: "account" */ '../pages/AccountPage'));
// Use a more explicit import for LoginPage to avoid issues
const LoginPage = lazyWithPreload(() =>
  import(/* webpackChunkName: "login-page" */ '../pages/LoginPage')
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.error('Error loading LoginPage:', error);
      // Return a fallback component if the import fails
      return {
        default: () => (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Login Page Error</h2>
              <p className="text-gray-700 mb-4">We're sorry, but there was an error loading the login page.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Try again
              </button>
            </div>
          </div>
        )
      };
    })
);

// Info pages
const AboutPage = lazyWithPreload(() => import(/* webpackChunkName: "about" */ '../pages/AboutPage'));
const SearchResultsPage = lazyWithPreload(() => import(/* webpackChunkName: "search-results" */ '../pages/SearchResultsPage'));

// Preload critical pages for faster navigation
const preloadCriticalPages = () => {
  // Preload home and products pages which are most commonly accessed
  HomePage.preload();
  ProductsPage.preload();

  // Preload other pages based on user behavior or after initial load
  setTimeout(() => {
    CartPage.preload();
    ProductDetailPage.preload();
  }, 2000); // Delay preloading to prioritize initial render
};

// Call preload function after initial render
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    requestIdleCallback(() => preloadCriticalPages());
  });
}

// Specialized loading fallbacks for different page types
const ProductPageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <ProductGridSkeleton count={8} />
    </div>
  </div>
);

const DetailPageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mt-8"></div>
        </div>
      </div>
    </div>
  </div>
);

const SimplePageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Error boundary component for lazy-loaded routes

const RouteErrorBoundary = ({ children }) => {
  const fallbackRender = ({ error, resetErrorBoundary }) => {
    console.error('Route error:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">We're sorry, but there was an error loading this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Try again
        </button>
      </div>
    );
  };

  return (
    <SimpleErrorBoundary fallback={fallbackRender}>
      {children}
    </SimpleErrorBoundary>
  );
};

// Wrapped components with Suspense and appropriate loaders
export const LazyHomePage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<ProductPageLoader />}>
      <HomePage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyProductsPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<ProductPageLoader />}>
      <ProductsPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyProductDetailPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<DetailPageLoader />}>
      <ProductDetailPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyGiftBoxesPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<ProductPageLoader />}>
      <GiftBoxesPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyCreateGiftBoxPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<DetailPageLoader />}>
      <CreateGiftBoxPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyBulkOrdersPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SimplePageLoader />}>
      <BulkOrdersPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyAboutPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SimplePageLoader />}>
      <AboutPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyCartPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SimplePageLoader />}>
      <CartPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyCheckoutPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SimplePageLoader />}>
      <CheckoutPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyWishlistPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<ProductPageLoader />}>
      <WishlistPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyAccountPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SimplePageLoader />}>
      <AccountPage />
    </Suspense>
  </RouteErrorBoundary>
);

export const LazyLoginPage = () => {
  // Add additional error handling for the login page
  const loginErrorFallback = ({ error, resetErrorBoundary }) => {
    console.error('Login page error:', error);
    return <FallbackLoginPage onRetry={resetErrorBoundary} />;
  };

  return (
    <SimpleErrorBoundary fallback={loginErrorFallback}>
      <Suspense
        fallback={<SimplePageLoader />}
      >
        <LoginPage />
      </Suspense>
    </SimpleErrorBoundary>
  );
};

export const LazySearchResultsPage = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<ProductPageLoader />}>
      <SearchResultsPage />
    </Suspense>
  </RouteErrorBoundary>
);
