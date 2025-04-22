import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import BackToTop from '../common/BackToTop';
import Breadcrumb from '../common/Breadcrumb';
import MobileNavigation from '../mobile/MobileNavigation';
import PullToRefresh from '../mobile/PullToRefresh';
import PersistentCartBar from '../cart/PersistentCartBar';

/**
 * ProductLayout - A layout for product-related pages without a footer
 * Used for:
 * - Product detail pages
 * - Create gift box page
 * - Products listing page
 * - Gift boxes page
 * - Bulk orders page
 * - Account page
 */
const ProductLayout = () => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if we're on a product detail page
  const isProductDetailPage = location.pathname.match(/^\/product\/\d+$/);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate a refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Reload the current page
    window.location.reload();

    setIsRefreshing(false);
  };

  // Add bottom padding for mobile navigation
  useEffect(() => {
    const updateBodyPadding = () => {
      if (window.innerWidth < 768) {
        document.body.style.paddingBottom = '4rem'; // 64px for mobile nav
      } else {
        document.body.style.paddingBottom = '0';
      }
    };

    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);

    return () => {
      window.removeEventListener('resize', updateBodyPadding);
      document.body.style.paddingBottom = '0';
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="flex-grow pt-16">
          {!isProductDetailPage && <Breadcrumb />}
          <Outlet />
        </main>
      </PullToRefresh>
      <BackToTop />
      <PersistentCartBar />
      <MobileNavigation />
    </div>
  );
};

export default ProductLayout;
