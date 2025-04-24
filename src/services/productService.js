/**
 * Product Service
 * Handles all product-related API calls
 */

import { supabase } from '../utils/supabaseClient';
import { memoize, paginate, selectFields } from '../utils/performanceUtils';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';

/**
 * Get all products
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of products to return
 * @param {number} options.page - Page number (1-based)
 * @param {string} options.category - Category filter
 * @param {string} options.search - Search term
 * @param {string} options.sort - Sort field
 * @param {string} options.order - Sort order (asc/desc)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Products response
 */
export const getProducts = async (options = {}) => {
  try {
    const {
      limit = 12,
      page = 1,
      category,
      search,
      sort = 'created_at',
      order = 'desc',
      featured,
      bestseller,
      organic
    } = options;

    // Calculate offset from page
    const offset = (page - 1) * limit;

    // Start building query with optimized field selection
    let query = supabase
      .from('products')
      .select(`
        id, name, slug, description, short_description, price, compare_at_price,
        discount_percentage, hs_code, origin, nutritional_info, rating,
        review_count, stock_quantity, is_featured, is_bestseller, is_organic,
        product_images (id, image_url, is_primary),
        product_variants (id, weight, price, compare_at_price, stock_quantity),
        product_categories!inner (id, name, slug)
      `, { count: 'exact' })
      .order(sort, { ascending: order === 'asc' });

    // Apply pagination using our utility
    query = paginate(query, page, limit);

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('product_categories.slug', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    if (bestseller !== undefined) {
      query = query.eq('is_bestseller', bestseller);
    }

    if (organic !== undefined) {
      query = query.eq('is_organic', organic);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format the response to match the expected structure
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      originalPrice: product.compare_at_price,
      discount: product.discount_percentage,
      hsCode: product.hs_code,
      image: product.product_images.find(img => img.is_primary)?.image_url ||
             product.product_images[0]?.image_url || '',
      origin: product.origin,
      nutritionalInfo: product.nutritional_info,
      rating: product.rating,
      reviews: product.review_count,
      inStock: product.stock_quantity > 0,
      featured: product.is_featured,
      bestseller: product.is_bestseller,
      organic: product.is_organic,
      category: product.product_categories.name,
      categorySlug: product.product_categories.slug,
      weightOptions: product.product_variants.map(variant => ({
        weight: variant.weight,
        price: variant.price,
        originalPrice: variant.compare_at_price,
        inStock: variant.stock_quantity > 0
      }))
    }));

    return {
      success: true,
      data: {
        products: formattedProducts,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getProducts');
  }
};

/**
 * Get a product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Product response
 */
export const getProductBySlug = memoize(async (slug) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { slug },
      ['slug']
    );

    if (validationError) {
      return validationError;
    }

    // Use optimized field selection
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, short_description, price, compare_at_price,
        discount_percentage, hs_code, origin, nutritional_info, rating,
        review_count, stock_quantity, is_featured, is_bestseller, is_organic,
        product_images (id, image_url, is_primary),
        product_variants (id, weight, price, compare_at_price, stock_quantity),
        product_categories!inner (id, name, slug)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        success: false,
        error: `Product with slug ${slug} not found`,
        status: 404
      };
    }

    // Format the response to match the expected structure
    const formattedProduct = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.short_description,
      price: data.price,
      originalPrice: data.compare_at_price,
      discount: data.discount_percentage,
      hsCode: data.hs_code,
      image: data.product_images.find(img => img.is_primary)?.image_url ||
             data.product_images[0]?.image_url || '',
      images: data.product_images.map(img => ({
        id: img.id,
        url: img.image_url,
        isPrimary: img.is_primary
      })),
      origin: data.origin,
      nutritionalInfo: data.nutritional_info,
      rating: data.rating,
      reviews: data.review_count,
      inStock: data.stock_quantity > 0,
      featured: data.is_featured,
      bestseller: data.is_bestseller,
      organic: data.is_organic,
      category: data.product_categories.name,
      categorySlug: data.product_categories.slug,
      weightOptions: data.product_variants.map(variant => ({
        id: variant.id,
        weight: variant.weight,
        price: variant.price,
        originalPrice: variant.compare_at_price,
        inStock: variant.stock_quantity > 0
      }))
    };

    return {
      success: true,
      data: formattedProduct
    };
  } catch (error) {
    return handleApiError(error, 'getProductBySlug');
  }
}, slug => slug); // Memoize by slug

/**
 * Get all categories
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>} - Categories response
 */
export const getCategories = memoize(async () => {
  try {
    // Use optimized field selection
    const { data, error } = await selectFields(
      supabase
        .from('product_categories')
        .order('display_order', { ascending: true }),
      ['id', 'name', 'slug', 'image', 'display_order']
    );

    if (error) {
      throw error;
    }

    // Format the response to match the expected structure
    const formattedCategories = data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      displayOrder: category.display_order
    }));

    return {
      success: true,
      data: formattedCategories
    };
  } catch (error) {
    return handleApiError(error, 'getCategories');
  }
});

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Reviews response
 */
export const getProductReviews = async (productId, options = {}) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { productId },
      ['productId']
    );

    if (validationError) {
      return validationError;
    }

    const { page = 1, pageSize = 10 } = options;

    // Use optimized field selection and pagination
    let query = selectFields(
      supabase
        .from('product_reviews')
        .eq('product_id', productId)
        .order('created_at', { ascending: false }),
      ['id', 'product_id', 'user_id', 'user_name', 'user_avatar', 'rating',
       'title', 'content', 'created_at', 'helpful_count', 'is_verified']
    );

    // Add count for pagination
    query = query.select('review_images (id, image_url)', { count: 'exact' });

    // Apply pagination
    query = paginate(query, page, pageSize);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format the response to match the expected structure
    const formattedReviews = data.map(review => ({
      id: review.id,
      productId: review.product_id,
      userId: review.user_id,
      userName: review.user_name,
      userAvatar: review.user_avatar,
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: review.created_at,
      helpfulCount: review.helpful_count,
      verified: review.is_verified,
      images: review.review_images.map(image => image.image_url)
    }));

    return {
      success: true,
      data: {
        reviews: formattedReviews,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getProductReviews');
  }
};

/**
 * Add a product review
 * @param {Object} review - Review object
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Added review response
 */
export const addProductReview = async (review) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        productId: review.productId,
        rating: review.rating,
        title: review.title,
        content: review.content
      },
      ['productId', 'rating', 'title', 'content']
    );

    if (validationError) {
      return validationError;
    }

    // Validate rating
    if (review.rating < 1 || review.rating > 5) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5',
        status: 400
      };
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to add a review',
        status: 401
      };
    }

    // Check if user has already reviewed this product
    const { data: existingReview, error: existingError } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', review.productId)
      .eq('user_id', user.id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw existingError;
    }

    if (existingReview) {
      return {
        success: false,
        error: 'You have already reviewed this product',
        status: 400
      };
    }

    // Add the review
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: review.productId,
        user_id: user.id,
        user_name: review.userName || user.user_metadata?.full_name || user.email.split('@')[0],
        user_avatar: review.userAvatar,
        rating: review.rating,
        title: review.title,
        content: review.content,
        is_verified: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add review images if any
    if (review.images && review.images.length > 0) {
      const imagePromises = review.images.map((imageUrl, index) => {
        return supabase
          .from('review_images')
          .insert({
            review_id: data.id,
            image_url: imageUrl,
            display_order: index + 1
          });
      });

      await Promise.all(imagePromises);
    }

    // Update the product's rating and review count
    await updateProductRating(review.productId);

    return {
      success: true,
      data: {
        id: data.id,
        productId: data.product_id,
        userId: data.user_id,
        userName: data.user_name,
        userAvatar: data.user_avatar,
        rating: data.rating,
        title: data.title,
        content: data.content,
        date: data.created_at,
        helpfulCount: data.helpful_count,
        verified: data.is_verified,
        images: review.images || []
      }
    };
  } catch (error) {
    return handleApiError(error, 'addProductReview');
  }
};

/**
 * Update a product's rating and review count
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
const updateProductRating = async (productId) => {
  try {
    if (!productId) {
      console.error('Product ID is required for updating rating');
      return;
    }

    // Get all reviews for the product with optimized query
    const { data, error } = await selectFields(
      supabase
        .from('product_reviews')
        .eq('product_id', productId),
      ['rating']
    );

    if (error) {
      console.error('Error fetching product reviews for rating update:', error);
      return;
    }

    // Calculate the average rating
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = data.length > 0 ? parseFloat((totalRating / data.length).toFixed(1)) : 0;

    // Update the product
    await supabase
      .from('products')
      .update({
        rating: averageRating,
        review_count: data.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);
  } catch (error) {
    console.error('Error in updateProductRating:', error);
    // Don't throw here as this is a background operation
    // and shouldn't affect the main review submission flow
  }
};

/**
 * Mark a review as helpful
 * @param {string} reviewId - Review ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Updated review response
 */
export const markReviewAsHelpful = async (reviewId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { reviewId },
      ['reviewId']
    );

    if (validationError) {
      return validationError;
    }

    // Get the current helpful count with optimized query
    const { data: currentReview, error: fetchError } = await selectFields(
      supabase
        .from('product_reviews')
        .eq('id', reviewId)
        .single(),
      ['id', 'helpful_count']
    );

    if (fetchError) {
      throw fetchError;
    }

    // Increment the helpful count
    const { data, error } = await selectFields(
      supabase
        .from('product_reviews')
        .update({
          helpful_count: (currentReview.helpful_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .single(),
      ['id', 'helpful_count']
    );

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        id: data.id,
        helpfulCount: data.helpful_count
      }
    };
  } catch (error) {
    return handleApiError(error, 'markReviewAsHelpful');
  }
};

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {string} categoryId - Category ID
 * @param {number} limit - Number of products to return
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>} - Related products response
 */
export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { productId, categoryId },
      ['productId', 'categoryId']
    );

    if (validationError) {
      return validationError;
    }

    // Use optimized field selection
    const { data, error } = await selectFields(
      supabase
        .from('products')
        .eq('product_categories.category_id', categoryId)
        .neq('id', productId)
        .limit(limit),
      [
        'id', 'name', 'slug', 'description', 'short_description', 'price',
        'compare_at_price', 'discount_percentage', 'rating', 'review_count',
        'stock_quantity', 'is_featured', 'is_bestseller', 'is_organic',
        'product_images (id, image_url, is_primary)',
        'product_categories!inner (id, name, slug)'
      ]
    );

    if (error) {
      throw error;
    }

    // Format the response to match the expected structure
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      originalPrice: product.compare_at_price,
      discount: product.discount_percentage,
      image: product.product_images.find(img => img.is_primary)?.image_url ||
             product.product_images[0]?.image_url || '',
      rating: product.rating,
      reviews: product.review_count,
      inStock: product.stock_quantity > 0,
      featured: product.is_featured,
      bestseller: product.is_bestseller,
      organic: product.is_organic,
      category: product.product_categories.name,
      categorySlug: product.product_categories.slug
    }));

    return {
      success: true,
      data: formattedProducts
    };
  } catch (error) {
    return handleApiError(error, 'getRelatedProducts');
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>} - Search results
 */
export const searchProducts = async (query, limit = 10) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { query },
      ['query']
    );

    if (validationError) {
      return validationError;
    }

    if (query.length < 2) {
      return {
        success: true,
        data: []
      };
    }

    // Use optimized field selection
    const { data, error } = await selectFields(
      supabase
        .from('products')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit),
      [
        'id', 'name', 'slug', 'price', 'compare_at_price',
        'product_images (id, image_url, is_primary)'
      ]
    );

    if (error) {
      throw error;
    }

    // Format the response
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compare_at_price,
      image: product.product_images.find(img => img.is_primary)?.image_url ||
             product.product_images[0]?.image_url || ''
    }));

    return {
      success: true,
      data: formattedProducts
    };
  } catch (error) {
    return handleApiError(error, 'searchProducts');
  }
};

export default {
  getProducts,
  getProductBySlug,
  getCategories,
  getProductReviews,
  addProductReview,
  markReviewAsHelpful,
  getRelatedProducts,
  searchProducts
};
