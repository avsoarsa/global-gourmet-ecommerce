import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST: Register a new user
  if (req.method === 'POST' && req.query.action === 'register') {
    try {
      const { email, password, first_name, last_name } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          }
        });
      }
      
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // Create user profile in database
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            first_name: first_name || '',
            last_name: last_name || '',
            role: 'customer'
          });
          
        if (profileError) {
          throw profileError;
        }
        
        // Create user profile
        const { error: userProfileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id
          });
          
        if (userProfileError) {
          throw userProfileError;
        }
      }
      
      return res.status(200).json({
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // POST: Login user
  if (req.method === 'POST' && req.query.action === 'login') {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          }
        });
      }
      
      // Login user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        throw authError;
      }
      
      // Update last login timestamp
      if (authData.user) {
        await supabase
          .from('users')
          .update({
            last_login: new Date()
          })
          .eq('id', authData.user.id);
      }
      
      return res.status(200).json({
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // POST: Logout user
  if (req.method === 'POST' && req.query.action === 'logout') {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          message: 'Logged out successfully'
        }
      });
    } catch (error) {
      console.error('Error logging out user:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // POST: Request password reset
  if (req.method === 'POST' && req.query.action === 'forgot-password') {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email is required'
          }
        });
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          message: 'Password reset email sent'
        }
      });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'PASSWORD_RESET_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // GET: Get current user
  if (req.method === 'GET' && req.query.action === 'me') {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User is not authenticated'
          }
        });
      }
      
      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          user,
          profile
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // Return 405 for other methods or actions
  return res.status(405).json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: `Method ${req.method} or action ${req.query.action} not allowed`
    }
  });
}
