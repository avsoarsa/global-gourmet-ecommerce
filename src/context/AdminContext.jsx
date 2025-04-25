import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { supabase } from '../utils/supabaseClient';

// Create context
const AdminContext = createContext();

// Admin provider component
export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize admin context
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAdminUser(parsedUser);

        // Load admin settings
        loadSettings();
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('adminUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Load admin settings
  const loadSettings = async () => {
    try {
      setLoading(true);

      // Get admin settings from API
      const { success, data, error: settingsError } = await adminService.getAdminSettings();

      if (!success) {
        throw new Error(settingsError || 'Failed to load admin settings');
      }

      // If no settings exist yet, use defaults
      if (!data) {
        const defaultSettings = {
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

        setSettings(defaultSettings);

        // Save default settings to database
        await adminService.updateAdminSettings(defaultSettings);
      } else {
        setSettings(data);
      }

      setError(null);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setError('Failed to load admin settings');

      // Use default settings as fallback
      setSettings({
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
      });
    } finally {
      setLoading(false);
    }
  };

  // Update admin settings
  const updateSettings = async (updatedSettings) => {
    try {
      setLoading(true);

      // Update settings via API
      const { success, data, error: updateError } = await adminService.updateAdminSettings(updatedSettings);

      if (!success) {
        throw new Error(updateError || 'Failed to update admin settings');
      }

      // Update settings in state
      setSettings(data);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Error updating admin settings:', error);
      setError('Failed to update admin settings');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin login with Supabase authentication
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      // Check if user is an admin
      const { success, data: adminData, error: adminError } = await adminService.checkAdminStatus();

      if (!success) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error(adminError || 'You do not have admin privileges');
      }

      if (!adminData.isAdmin) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error('You do not have admin privileges');
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        console.warn('Error fetching admin profile:', profileError);
      }

      // Create admin user object
      const adminUserData = {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profileData?.first_name || 'Admin',
        lastName: profileData?.last_name || 'User',
        role: 'admin',
        adminData: adminData.adminData
      };

      // Store admin user in state and localStorage
      setAdminUser(adminUserData);
      localStorage.setItem('adminUser', JSON.stringify(adminUserData));

      // Load admin settings
      await loadSettings();

      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin logout
  const logout = async () => {
    try {
      setLoading(true);

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear state and local storage
      setAdminUser(null);
      setSettings(null);
      localStorage.removeItem('adminUser');

      // Redirect to login page
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get admin activity log
  const getActivityLog = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);

      // Get activity log via API
      const { success, data, error: activityError } = await adminService.getAdminActivity({
        page,
        pageSize
      });

      if (!success) {
        throw new Error(activityError || 'Failed to fetch admin activity');
      }

      setError(null);
      return {
        activities: data.activities,
        pagination: {
          total: data.total,
          page: data.page,
          limit: data.pageSize,
          pages: data.totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching admin activity:', error);
      setError('Failed to fetch admin activity');
      return {
        activities: [],
        pagination: {
          total: 0,
          page,
          limit: pageSize,
          pages: 0
        }
      };
    } finally {
      setLoading(false);
    }
  };

  // Get admin dashboard stats
  const getDashboardStats = async () => {
    try {
      setLoading(true);

      // Get dashboard stats via API
      const { success, data, error: statsError } = await adminService.getDashboardStats();

      if (!success) {
        throw new Error(statsError || 'Failed to fetch dashboard stats');
      }

      setError(null);
      return {
        sales: {
          total: data.totalRevenue,
          monthly: data.totalRevenue
        },
        orders: {
          total: data.orderCount,
          pending: data.pendingOrders,
          completed: data.completedOrders
        },
        customers: {
          total: data.userCount
        },
        products: {
          total: data.productCount
        },
        recentOrders: data.recentOrders,
        topSellingProducts: data.topSellingProducts
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Failed to fetch admin stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    adminUser,
    settings,
    loading,
    error,
    login,
    logout,
    updateSettings,
    getActivityLog,
    getDashboardStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }

  return context;
};

export default AdminContext;
