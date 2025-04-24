import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user profile - defined outside useEffect to avoid circular dependency
  const fetchUserProfile = async (user) => {
    try {
      if (!user) {
        return { success: false, error: 'No user provided' };
      }

      // Get user profile from user_profiles table
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Supabase profile error:', profileError);
        throw new Error(profileError.message);
      }

      // Combine user data with profile data
      const combinedProfile = {
        ...user,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email,
        phone: userProfile?.phone || '',
        birthdate: userProfile?.birthdate || '',
        preferences: userProfile?.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          newsletterSubscription: true
        },
        profileData: userProfile || null
      };

      return {
        success: true,
        data: combinedProfile
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(session);

        if (session?.user) {
          // Load full user profile
          const { success, data } = await fetchUserProfile(session.user);
          if (success) {
            // Set the combined user profile data
            setCurrentUser({
              ...session.user,
              ...data
            });
          } else {
            // Fallback to just the session user if profile fetch fails
            setCurrentUser(session.user);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);

        if (session?.user) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            // Load full user profile
            const { success, data } = await fetchUserProfile(session.user);
            if (success) {
              // Set the combined user profile data
              setCurrentUser({
                ...session.user,
                ...data
              });
            } else {
              // Fallback to just the session user if profile fetch fails
              setCurrentUser(session.user);
            }
          }
        } else {
          setCurrentUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Register a new user
  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('Registering user:', { email, firstName, lastName });

      // Use direct Supabase auth instead of API endpoint
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw new Error(authError.message);
      }

      console.log('Registration successful:', authData);

      // Create user profile in database if needed
      // This would typically be handled by a database trigger or backend function

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Login a user
  const login = async (email, password) => {
    try {
      console.log('Logging in user:', { email });

      // Use direct Supabase auth instead of API endpoint
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw new Error(authError.message);
      }

      console.log('Login successful:', authData);

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout a user
  const logout = async () => {
    try {
      console.log('Logging out user');

      // Use direct Supabase auth instead of API endpoint
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message);
      }

      console.log('Logout successful');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Request password reset
  const forgotPassword = async (email) => {
    try {
      console.log('Requesting password reset for:', email);

      // Use direct Supabase auth instead of API endpoint
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message);
      }

      console.log('Password reset email sent');

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password with token
  const resetPassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      console.log('Getting user profile');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Supabase auth error:', userError);
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the fetchUserProfile function to get the profile
      const { success, data, error } = await fetchUserProfile(user);

      if (!success) {
        throw new Error(error || 'Failed to fetch user profile');
      }

      console.log('User profile retrieved:', data);

      return {
        success: true,
        data: {
          user,
          profile: data
        }
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile data
  const updateUserProfile = async (userData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    try {
      // In a real app, this would call an API
      // For now, we'll update the user metadata
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
