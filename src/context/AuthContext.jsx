import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import authService from '../services/authService';

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

      // If user signed in with Google, we need to handle the profile differently
      const isGoogleUser = user.app_metadata?.provider === 'google';
      let firstName = '';
      let lastName = '';

      if (isGoogleUser) {
        // For Google users, the name is in the user_metadata.full_name
        const fullName = user.user_metadata?.full_name || '';
        const nameParts = fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';

        // Create user profile if it doesn't exist for Google users
        if (!userProfile) {
          try {
            const { error: createProfileError } = await supabase
              .from('user_profiles')
              .upsert({
                user_id: user.id,
                phone: user.user_metadata?.phone || '',
                created_at: new Date(),
                updated_at: new Date()
              });

            if (createProfileError) {
              console.error('Error creating profile for Google user:', createProfileError);
            }
          } catch (err) {
            console.error('Error creating profile for Google user:', err);
          }
        }
      } else {
        // For email users, the name is in the user_metadata.first_name and user_metadata.last_name
        firstName = user.user_metadata?.first_name || '';
        lastName = user.user_metadata?.last_name || '';
      }

      // Combine user data with profile data
      const combinedProfile = {
        ...user,
        firstName,
        lastName,
        email: user.email,
        phone: userProfile?.phone || user.user_metadata?.phone || '',
        birthdate: userProfile?.birthdate || '',
        preferences: userProfile?.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          newsletterSubscription: true
        },
        profileData: userProfile || null,
        isGoogleUser
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
  const register = async (email, password, firstName, lastName, phone) => {
    try {
      console.log('Registering user:', { email, firstName, lastName, phone });

      // Use authService instead of direct Supabase calls
      const result = await authService.signUp(email, password, firstName, lastName, phone);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Registration successful:', result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      console.log('Signing in with Google');

      // Use authService instead of direct Supabase calls
      const result = await authService.signInWithGoogle();

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Google sign-in initiated:', result.data);

      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Login a user
  const login = async (email, password) => {
    try {
      console.log('Logging in user:', { email });

      // Use authService instead of direct Supabase calls
      const result = await authService.signIn(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Login successful:', result.data);

      return {
        success: true,
        data: result.data
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

      // Use authService instead of direct Supabase calls
      const result = await authService.signOut();

      if (!result.success) {
        throw new Error(result.error);
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

      // Use authService instead of direct Supabase calls
      const result = await authService.resetPassword(email);

      if (!result.success) {
        throw new Error(result.error);
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
      // Use authService instead of direct Supabase calls
      const result = await authService.updatePassword(password);

      if (!result.success) {
        throw new Error(result.error);
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

      // Use authService instead of direct Supabase calls
      const result = await authService.getProfile();

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('User profile retrieved:', result.data);

      return {
        success: true,
        data: result.data
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
      // Use authService instead of direct Supabase calls
      const result = await authService.updateProfile(userData);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update current user state with the new profile data
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...result.data
      }));

      return {
        success: true,
        data: result.data
      };
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
