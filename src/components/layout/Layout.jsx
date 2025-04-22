import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../common/BackToTop';
import Breadcrumb from '../common/Breadcrumb';
import MobileNavigation from '../mobile/MobileNavigation';
import PullToRefresh from '../mobile/PullToRefresh';
import SkipToContent from '../common/SkipToContent';
import PersistentCartBar from '../cart/PersistentCartBar';

const Layout = () => {
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
      <SkipToContent />
      <Header />
      <PullToRefresh onRefresh={handleRefresh}>
        <main id="main-content" className="flex-grow pt-16">
          {!isProductDetailPage && <Breadcrumb />}
          <Outlet />
        </main>
      </PullToRefresh>
      <Footer />
      <BackToTop />
      <PersistentCartBar />
      <MobileNavigation />
    </div>
  );
};

export default Layout;
