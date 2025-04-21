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
  
  // Load admin settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await adminService.getAdminSettings();
      setSettings(settings);
      setError(null);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setError('Failed to load admin settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Update admin settings
  const updateSettings = async (updatedSettings) => {
    try {
      setLoading(true);
      const result = await adminService.updateAdminSettings(updatedSettings);
      setSettings(result);
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
  
  // Admin login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Call the login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      
      // Check if the user is an admin
      if (data.user.role !== 'admin') {
        throw new Error('Not authorized as admin');
      }
      
      // Store admin user in state and localStorage
      setAdminUser(data.user);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
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
  const logout = () => {
    setAdminUser(null);
    setSettings(null);
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };
  
  // Get admin activity log
  const getActivityLog = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const result = await adminService.getAdminActivity(page, limit);
      setError(null);
      return result;
    } catch (error) {
      console.error('Error fetching admin activity:', error);
      setError('Failed to fetch admin activity');
      return { activities: [], pagination: { total: 0, page, limit, pages: 0 } };
    } finally {
      setLoading(false);
    }
  };
  
  // Get admin dashboard stats
  const getDashboardStats = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAdminStats();
      setError(null);
      return result;
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
