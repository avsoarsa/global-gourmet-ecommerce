import { lazy, Suspense } from 'react';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';

// Lazy-loaded components
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const GiftBoxesPage = lazy(() => import('../pages/GiftBoxesPage'));
const CreateGiftBoxPage = lazy(() => import('../pages/CreateGiftBoxPage'));
const BulkOrdersPage = lazy(() => import('../pages/BulkOrdersPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));

// Loading fallbacks
const PageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <ProductGridSkeleton count={8} />
    </div>
  </div>
);

// Wrapped components with Suspense
export const LazyHomePage = () => (
  <Suspense fallback={<PageLoader />}>
    <HomePage />
  </Suspense>
);

export const LazyProductsPage = () => (
  <Suspense fallback={<PageLoader />}>
    <ProductsPage />
  </Suspense>
);

export const LazyProductDetailPage = () => (
  <Suspense fallback={<PageLoader />}>
    <ProductDetailPage />
  </Suspense>
);

export const LazyGiftBoxesPage = () => (
  <Suspense fallback={<PageLoader />}>
    <GiftBoxesPage />
  </Suspense>
);

export const LazyCreateGiftBoxPage = () => (
  <Suspense fallback={<PageLoader />}>
    <CreateGiftBoxPage />
  </Suspense>
);

export const LazyBulkOrdersPage = () => (
  <Suspense fallback={<PageLoader />}>
    <BulkOrdersPage />
  </Suspense>
);

export const LazyAboutPage = () => (
  <Suspense fallback={<PageLoader />}>
    <AboutPage />
  </Suspense>
);

export const LazyCartPage = () => (
  <Suspense fallback={<PageLoader />}>
    <CartPage />
  </Suspense>
);

export const LazyCheckoutPage = () => (
  <Suspense fallback={<PageLoader />}>
    <CheckoutPage />
  </Suspense>
);

export const LazyWishlistPage = () => (
  <Suspense fallback={<PageLoader />}>
    <WishlistPage />
  </Suspense>
);

export const LazyAccountPage = () => (
  <Suspense fallback={<PageLoader />}>
    <AccountPage />
  </Suspense>
);

export const LazyLoginPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LoginPage />
  </Suspense>
);
