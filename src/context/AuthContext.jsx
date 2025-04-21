import { createContext, useState, useContext, useEffect } from 'react';
import { authenticate, updateUser } from '../data/users';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = authenticate(email, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Update user profile data
  const updateUserProfile = async (userData) => {
    if (!currentUser) return false;

    try {
      // In a real app, this would call an API
      // For now, we'll update the user in localStorage
      const updatedUser = {
        ...currentUser,
        ...userData
      };

      // Update in state and localStorage
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update in our mock data store
      updateUser(updatedUser);

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
