/**
 * Product Service
 * Handles all product-related API calls
 */

import { supabase } from '../utils/supabaseClient';

/**
 * Get all products
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of products to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.category - Category filter
 * @param {string} options.search - Search term
 * @param {string} options.sort - Sort field
 * @param {string} options.order - Sort order (asc/desc)
 * @returns {Promise<Array>} - Array of products
 */
export const getProducts = async (options = {}) => {
  try {
    const {
      limit = 12,
      offset = 0,
      category,
      search,
      sort = 'created_at',
      order = 'desc',
      featured,
      bestseller,
      organic
    } = options;

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories!inner (*)
      `)
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

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
      console.error('Error fetching products:', error);
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
      image: product.product_images[0]?.image_url || '',
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
      products: formattedProducts,
      total: count
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

/**
 * Get a product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object>} - Product object
 */
export const getProductBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories!inner (*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }

    if (!data) {
      throw new Error(`Product with slug ${slug} not found`);
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
      image: data.product_images[0]?.image_url || '',
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
        weight: variant.weight,
        price: variant.price,
        originalPrice: variant.compare_at_price,
        inStock: variant.stock_quantity > 0
      }))
    };

    return formattedProduct;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    throw error;
  }
};

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of categories
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Format the response to match the expected structure
    const formattedCategories = data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image
    }));

    return formattedCategories;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of reviews to return
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} - Array of reviews
 */
export const getProductReviews = async (productId, options = {}) => {
  try {
    const { limit = 10, offset = 0 } = options;

    const { data, error, count } = await supabase
      .from('product_reviews')
      .select(`
        *,
        review_images (*)
      `, { count: 'exact' })
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching product reviews:', error);
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
      reviews: formattedReviews,
      total: count
    };
  } catch (error) {
    console.error('Error in getProductReviews:', error);
    throw error;
  }
};

/**
 * Add a product review
 * @param {Object} review - Review object
 * @returns {Promise<Object>} - Added review
 */
export const addProductReview = async (review) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add a review');
    }

    // Add the review
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: review.productId,
        user_id: user.id,
        user_name: review.userName,
        user_avatar: review.userAvatar,
        rating: review.rating,
        title: review.title,
        content: review.content,
        is_verified: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product review:', error);
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
    };
  } catch (error) {
    console.error('Error in addProductReview:', error);
    throw error;
  }
};

/**
 * Update a product's rating and review count
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
const updateProductRating = async (productId) => {
  try {
    // Get all reviews for the product
    const { data, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product reviews for rating update:', error);
      throw error;
    }

    // Calculate the average rating
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = data.length > 0 ? totalRating / data.length : 0;

    // Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: averageRating,
        review_count: data.length
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product rating:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error in updateProductRating:', error);
    throw error;
  }
};

/**
 * Mark a review as helpful
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} - Updated review
 */
export const markReviewAsHelpful = async (reviewId) => {
  try {
    // Get the current helpful count
    const { data: currentReview, error: fetchError } = await supabase
      .from('product_reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      console.error('Error fetching review helpful count:', fetchError);
      throw fetchError;
    }

    // Increment the helpful count
    const { data, error } = await supabase
      .from('product_reviews')
      .update({
        helpful_count: (currentReview.helpful_count || 0) + 1
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }

    return {
      id: data.id,
      helpfulCount: data.helpful_count
    };
  } catch (error) {
    console.error('Error in markReviewAsHelpful:', error);
    throw error;
  }
};

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {string} categoryId - Category ID
 * @param {number} limit - Number of products to return
 * @returns {Promise<Array>} - Array of related products
 */
export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories!inner (*)
      `)
      .eq('category_id', categoryId)
      .neq('id', productId)
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
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
      image: product.product_images[0]?.image_url || '',
      rating: product.rating,
      reviews: product.review_count,
      inStock: product.stock_quantity > 0,
      featured: product.is_featured,
      bestseller: product.is_bestseller,
      organic: product.is_organic,
      category: product.product_categories.name,
      categorySlug: product.product_categories.slug
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductBySlug,
  getCategories,
  getProductReviews,
  addProductReview,
  markReviewAsHelpful,
  getRelatedProducts
};
