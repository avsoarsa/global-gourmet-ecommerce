import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SimpleHeader from './SimpleHeader';
import BackToTop from '../common/BackToTop';
import MobileNavigation from '../mobile/MobileNavigation';
import PullToRefresh from '../mobile/PullToRefresh';
import PersistentCartBar from '../cart/PersistentCartBar';

/**
 * ConversionLayout - A distraction-free layout for high-conversion pages
 * Removes footer and other distracting elements to focus user attention on conversion
 */
const ConversionLayout = () => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SimpleHeader />
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="flex-grow pt-16">
          <Outlet />
        </main>
      </PullToRefresh>
      <BackToTop />
      <PersistentCartBar />
      <MobileNavigation />
    </div>
  );
};

export default ConversionLayout;
