'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { seedUsers } from '../data/users';

const STORAGE_KEY = 'global_gourmet_current_user';

const cloneUser = (user) => (user ? JSON.parse(JSON.stringify(user)) : null);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => seedUsers.map((user) => cloneUser(user)));
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to restore stored user session:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistUser = (user) => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const register = async (email, password, firstName, lastName, phone) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return { success: false, error: 'Email is already registered.' };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        newsletterSubscription: true
      },
      loyalty: { points: 0, tier: 'bronze', history: [], rewards: [] },
      addresses: [],
      orders: [],
      wishlist: []
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    persistUser(newUser);

    return { success: true, data: newUser };
  };

  const login = async (email, password) => {
    const user = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.toLowerCase() &&
        candidate.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setCurrentUser(user);
    persistUser(user);

    return { success: true, data: user };
  };

  const signInWithGoogle = async () => {
    const demoUser = users.find((user) => user.email === 'user@example.com');

    if (!demoUser) {
      return { success: false, error: 'Demo Google user not configured.' };
    }

    setCurrentUser(demoUser);
    persistUser(demoUser);

    return { success: true, data: demoUser };
  };

  const logout = async () => {
    setCurrentUser(null);
    persistUser(null);
    return { success: true };
  };

  const forgotPassword = async (email) => {
    const user = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return { success: false, error: 'Email not found.' };
    }

    return { success: true };
  };

  const resetPassword = async (password) => {
    if (!currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id ? { ...user, password } : user
      )
    );

    const updatedUser = { ...currentUser, password };
    setCurrentUser(updatedUser);
    persistUser(updatedUser);

    return { success: true };
  };

  const getUserProfile = async () => {
    if (!currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }

    return { success: true, data: currentUser };
  };

  const updateUserProfile = async (userData) => {
    if (!currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }

    const updatedUser = {
      ...currentUser,
      ...userData,
      preferences: {
        ...currentUser.preferences,
        ...(userData?.preferences || {})
      }
    };

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      )
    );
    setCurrentUser(updatedUser);
    persistUser(updatedUser);

    return { success: true, data: updatedUser };
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
