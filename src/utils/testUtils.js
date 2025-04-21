/**
 * Test utilities for unit and integration tests
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { RegionProvider } from '../context/RegionContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

/**
 * Custom render function that wraps component with all necessary providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - Object containing render result and additional utilities
 */
export const renderWithProviders = (ui, options = {}) => {
  const AllProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <RegionProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                </WishlistProvider>
              </CartProvider>
            </RegionProvider>
          </AuthProvider>
        </I18nextProvider>
      </BrowserRouter>
    );
  };
  
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  addresses: [
    {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'United States',
      isDefault: true
    }
  ],
  paymentMethods: [
    {
      id: '1',
      cardNumber: '4111111111111111',
      cardholderName: 'Test User',
      expiryMonth: '12',
      expiryYear: '2030',
      cardType: 'visa',
      isDefault: true
    }
  ],
  orders: [
    {
      id: '1001',
      date: '2023-01-15T12:00:00Z',
      status: 'Delivered',
      total: 125.99,
      items: [
        {
          id: '1',
          name: 'Organic Almonds',
          price: 12.99,
          quantity: 2
        },
        {
          id: '2',
          name: 'Premium Cashews',
          price: 14.99,
          quantity: 1
        }
      ]
    },
    {
      id: '1002',
      date: '2023-02-20T15:30:00Z',
      status: 'Processing',
      total: 89.97,
      items: [
        {
          id: '3',
          name: 'Dried Apricots',
          price: 9.99,
          quantity: 3
        }
      ]
    }
  ],
  loyaltyPoints: 250,
  subscriptions: [
    {
      id: '1',
      product: 'Monthly Nut Box',
      frequency: 'Monthly',
      nextDelivery: '2023-04-15',
      price: 39.99,
      status: 'active'
    }
  ],
  wishlist: [
    {
      id: '5',
      name: 'Organic Walnuts',
      price: 13.99,
      image: '/images/products/walnuts.jpg'
    },
    {
      id: '8',
      name: 'Dried Cranberries',
      price: 8.99,
      image: '/images/products/cranberries.jpg'
    }
  ]
};

/**
 * Mock product data for testing
 */
export const mockProducts = [
  {
    id: '1',
    name: 'Organic Almonds',
    description: 'Premium quality organic almonds',
    price: 12.99,
    category: 'nuts',
    image: '/images/products/almonds.jpg',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    isOrganic: true,
    isBestseller: true
  },
  {
    id: '2',
    name: 'Premium Cashews',
    description: 'Delicious premium cashews',
    price: 14.99,
    category: 'nuts',
    image: '/images/products/cashews.jpg',
    rating: 4.3,
    reviewCount: 95,
    inStock: true,
    isOrganic: false,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Dried Apricots',
    description: 'Sweet and tangy dried apricots',
    price: 9.99,
    category: 'dried-fruits',
    image: '/images/products/apricots.jpg',
    rating: 4.2,
    reviewCount: 87,
    inStock: true,
    isOrganic: true,
    isBestseller: false
  }
];

/**
 * Mock cart data for testing
 */
export const mockCart = {
  items: [
    {
      id: '1',
      name: 'Organic Almonds',
      price: 12.99,
      quantity: 2,
      image: '/images/products/almonds.jpg',
      weight: '500g'
    },
    {
      id: '3',
      name: 'Dried Apricots',
      price: 9.99,
      quantity: 1,
      image: '/images/products/apricots.jpg',
      weight: '250g'
    }
  ],
  subtotal: 35.97,
  shipping: 5.99,
  tax: 2.88,
  total: 44.84
};

/**
 * Wait for a specified time (useful for async tests)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the specified time
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
