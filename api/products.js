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

  // Handle GET request
  if (req.method === 'GET') {
    const { id, slug, category, featured, bestseller, organic, limit = 12, page = 1 } = req.query;
    
    try {
      let query = supabase.from('products').select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories!inner (*)
      `);
      
      // Apply filters
      if (id) {
        query = query.eq('id', id);
      }
      
      if (slug) {
        query = query.eq('slug', slug);
      }
      
      if (category) {
        query = query.eq('product_categories.slug', category);
      }
      
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      
      if (bestseller === 'true') {
        query = query.eq('is_bestseller', true);
      }
      
      if (organic === 'true') {
        query = query.eq('is_organic', true);
      }
      
      // Only show active products
      query = query.eq('is_active', true);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      query = query.range(startIndex, startIndex + limit - 1);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Get total count for pagination
      const { count: totalCount, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }
      
      return res.status(200).json({
        success: true,
        data,
        meta: {
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while fetching products',
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
