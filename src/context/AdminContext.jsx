'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { seedUsers } from '../data/users';

const ADMIN_STORAGE_KEY = 'global_gourmet_admin_user';
const SETTINGS_STORAGE_KEY = 'global_gourmet_admin_settings';

const DEFAULT_SETTINGS = {
  siteName: 'Global Gourmet',
  logo: '/images/logo.png',
  currency: 'USD',
  taxRate: 0.08,
  shippingOptions: [
    { id: 'standard', name: 'Standard', price: 5.99, estimatedDays: '3-5' },
    { id: 'express', name: 'Express', price: 12.99, estimatedDays: '1-2' },
    { id: 'free', name: 'Free', price: 0, minimumOrder: 50, estimatedDays: '5-7' }
  ],
  emailNotifications: true,
  maintenanceMode: false
};

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_STORAGE_KEY) : null;
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      }

      const storedSettings = typeof window !== 'undefined' ? localStorage.getItem(SETTINGS_STORAGE_KEY) : null;
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (err) {
      console.error('Failed to load admin state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistAdminUser = (user) => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  };

  const persistSettings = (nextSettings) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const admin = seedUsers.find(
        (user) =>
          user.role === 'admin' &&
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password
      );

      if (!admin) {
        throw new Error('Invalid admin credentials');
      }

      const adminProfile = {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin'
      };

      setAdminUser(adminProfile);
      persistAdminUser(adminProfile);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setAdminUser(null);
    persistAdminUser(null);
  };

  const updateSettings = async (nextSettings) => {
    const mergedSettings = {
      ...settings,
      ...nextSettings
    };

    setSettings(mergedSettings);
    persistSettings(mergedSettings);

    return { success: true, data: mergedSettings };
  };

  const value = {
    adminUser,
    settings,
    loading,
    error,
    login,
    logout,
    updateSettings
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
