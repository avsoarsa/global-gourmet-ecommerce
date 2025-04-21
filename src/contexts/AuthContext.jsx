import { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Admin user credentials (in a real app, this would be stored securely on the server)
const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
          // Create user object (without password)
          const user = {
            email: ADMIN_USER.email,
            name: ADMIN_USER.name,
            role: ADMIN_USER.role
          };
          
          // Store in state and localStorage
          setCurrentUser(user);
          localStorage.setItem('adminUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser');
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };
  
  // Context value
  const value = {
    currentUser,
    login,
    logout,
    isAdmin
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
