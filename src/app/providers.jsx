'use client';

import ErrorBoundary from '../components/common/ErrorBoundary';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { RegionProvider } from '../context/RegionContext';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { LoyaltyProvider } from '../context/LoyaltyContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { CartNotificationProvider } from '../context/CartNotificationContext';
import { CartProvider } from '../context/CartContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { WishlistProvider } from '../context/WishlistContext';

export const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <RegionProvider>
          <AnalyticsProvider>
            <ErrorBoundary>
              <AuthProvider>
                <ErrorBoundary>
                  <NotificationProvider>
                    <ErrorBoundary>
                      <LoyaltyProvider>
                        <ErrorBoundary>
                          <SubscriptionProvider>
                            <ErrorBoundary>
                              <CartNotificationProvider>
                                <ErrorBoundary>
                                  <CartProvider>
                                    <ErrorBoundary>
                                      <RecentlyViewedProvider>
                                        <WishlistProvider>
                                          {children}
                                        </WishlistProvider>
                                      </RecentlyViewedProvider>
                                    </ErrorBoundary>
                                  </CartProvider>
                                </ErrorBoundary>
                              </CartNotificationProvider>
                            </ErrorBoundary>
                          </SubscriptionProvider>
                        </ErrorBoundary>
                      </LoyaltyProvider>
                    </ErrorBoundary>
                  </NotificationProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </AnalyticsProvider>
        </RegionProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};
