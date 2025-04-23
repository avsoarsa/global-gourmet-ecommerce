import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    const { id, slug } = req.query;
    
    try {
      let query = supabase.from('product_categories').select('*');
      
      // Apply filters
      if (id) {
        query = query.eq('id', id);
      }
      
      if (slug) {
        query = query.eq('slug', slug);
      }
      
      // Only show active categories
      query = query.eq('is_active', true);
      
      // Order by display_order
      query = query.order('display_order', { ascending: true });
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while fetching categories',
          details: error.message
        }
      });
    }
  }
  
  // Return 405 for other methods
  return res.status(405).json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: `Method ${req.method} not allowed`
    }
  });
}
