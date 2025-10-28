'use client';

import { useEffect, useState } from 'react';
import CartNotificationContainer from '../components/cart/CartNotificationContainer';
import ActivityNotification from '../components/common/ActivityNotification';

const AppClientShell = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isAppReady && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Global Gourmet...</p>
          </div>
        </div>
      )}
      <CartNotificationContainer />
      <ActivityNotification
        interval={15000}
        duration={7000}
        position="bottom-right"
        className="z-50"
      />
      {children}
    </>
  );
};

export default AppClientShell;
