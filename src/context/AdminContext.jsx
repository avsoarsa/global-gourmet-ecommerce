import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService';

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

  // Load admin settings (mock implementation)
  const loadSettings = async () => {
    try {
      setLoading(true);

      // Mock settings data
      const mockSettings = {
        siteName: 'Global Gourmet',
        logo: '/images/logo.png',
        currency: 'USD',
        taxRate: 0.08,
        shippingOptions: [
          { id: 1, name: 'Standard', price: 5.99, estimatedDays: '3-5' },
          { id: 2, name: 'Express', price: 12.99, estimatedDays: '1-2' },
          { id: 3, name: 'Free', price: 0, minimumOrder: 50, estimatedDays: '5-7' }
        ],
        emailNotifications: true,
        maintenanceMode: false
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setSettings(mockSettings);
      setError(null);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setError('Failed to load admin settings');
    } finally {
      setLoading(false);
    }
  };

  // Update admin settings (mock implementation)
  const updateSettings = async (updatedSettings) => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update settings in state
      setSettings(updatedSettings);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Error updating admin settings:', error);
      setError('Failed to update admin settings');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Admin login with mock authentication
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Mock admin user for testing
      const ADMIN_USER = {
        id: 0,
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      };

      // Check credentials
      if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        // Create user object (without password)
        const { password: _, ...adminUserData } = ADMIN_USER;

        // Store admin user in state and localStorage
        setAdminUser(adminUserData);
        localStorage.setItem('adminUser', JSON.stringify(adminUserData));

        // Load admin settings
        await loadSettings();

        return { success: true };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin logout
  const logout = () => {
    setAdminUser(null);
    setSettings(null);
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Get admin activity log (mock implementation)
  const getActivityLog = async (page = 1, limit = 20) => {
    try {
      setLoading(true);

      // Mock activity data
      const mockActivities = [
        {
          id: 1,
          userId: 0,
          action: 'login',
          details: 'Admin user logged in',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ipAddress: '192.168.1.1'
        },
        {
          id: 2,
          userId: 0,
          action: 'update_settings',
          details: 'Updated shipping settings',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ipAddress: '192.168.1.1'
        },
        {
          id: 3,
          userId: 0,
          action: 'create_product',
          details: 'Created new product: Organic Almonds',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ipAddress: '192.168.1.1'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setError(null);
      return {
        activities: mockActivities,
        pagination: {
          total: mockActivities.length,
          page,
          limit,
          pages: Math.ceil(mockActivities.length / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching admin activity:', error);
      setError('Failed to fetch admin activity');
      return { activities: [], pagination: { total: 0, page, limit, pages: 0 } };
    } finally {
      setLoading(false);
    }
  };

  // Get admin dashboard stats (mock implementation)
  const getDashboardStats = async () => {
    try {
      setLoading(true);

      // Mock stats data
      const mockStats = {
        sales: {
          total: 12580.75,
          today: 1250.50,
          weekly: 5890.25,
          monthly: 12580.75
        },
        orders: {
          total: 156,
          pending: 12,
          processing: 8,
          shipped: 15,
          delivered: 121
        },
        customers: {
          total: 89,
          new: 12
        },
        products: {
          total: 42,
          outOfStock: 3,
          lowStock: 5
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setError(null);
      return mockStats;
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
