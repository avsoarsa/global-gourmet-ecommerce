/**
 * Admin API Service
 * Handles all admin-related API calls
 */

import { supabase } from '../utils/supabaseClient';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';
import { memoize, selectFields, paginate } from '../utils/performanceUtils';

/**
 * Check if the current user has admin privileges
 * @returns {Promise<{success: boolean, data?: {isAdmin: boolean}, error?: string}>}
 */
export const checkAdminStatus = async () => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      return {
        success: false,
        error: 'Not authenticated',
        status: 401
      };
    }

    // Check if user has admin role
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return {
      success: true,
      data: {
        isAdmin: !!data,
        adminData: data || null
      }
    };
  } catch (error) {
    return handleApiError(error, 'checkAdminStatus');
  }
};

/**
 * Get admin dashboard statistics
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getDashboardStats = async () => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Get total users count
    const { count: userCount, error: userError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    if (userError) {
      throw userError;
    }

    // Get total orders count and revenue
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('total_amount, status');

    if (orderError) {
      throw orderError;
    }

    const orderCount = orderData.length;
    const totalRevenue = orderData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const completedOrders = orderData.filter(order => order.status === 'completed').length;
    const pendingOrders = orderData.filter(order => order.status === 'pending').length;

    // Get total products count
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productError) {
      throw productError;
    }

    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        user_profiles (first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      throw recentOrdersError;
    }

    // Get top selling products
    const { data: topProducts, error: topProductsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        products (name, price),
        quantity
      `)
      .limit(100);

    if (topProductsError) {
      throw topProductsError;
    }

    // Calculate top products by quantity sold
    const productSales = {};
    topProducts.forEach(item => {
      const productId = item.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          name: item.products?.name || 'Unknown Product',
          price: item.products?.price || 0,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      productSales[productId].totalQuantity += item.quantity;
      productSales[productId].totalRevenue += (item.products?.price || 0) * item.quantity;
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    return {
      success: true,
      data: {
        userCount,
        orderCount,
        productCount,
        totalRevenue,
        completedOrders,
        pendingOrders,
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          userName: order.user_profiles ? `${order.user_profiles.first_name} ${order.user_profiles.last_name}` : 'Unknown User',
          amount: order.total_amount,
          status: order.status,
          date: order.created_at
        })),
        topSellingProducts
      }
    };
  } catch (error) {
    return handleApiError(error, 'getDashboardStats');
  }
};

/**
 * Get admin settings
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminSettings = async () => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Get settings from database
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return handleApiError(error, 'getAdminSettings');
  }
};

/**
 * Update admin settings
 * @param {Object} settings - Updated settings
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateAdminSettings = async (settings) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { settings },
      ['settings']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Update settings in database
    const { data, error } = await supabase
      .from('admin_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return handleApiError(error, 'updateAdminSettings');
  }
};

/**
 * Get admin activity log
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminActivity = async (options = {}) => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    const {
      page = 1,
      pageSize = 20
    } = options;

    // Get activity log from database
    let query = supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply pagination
    query = paginate(query, page, pageSize);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        activities: data,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getAdminActivity');
  }
};

/**
 * Get all products (admin)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @param {string} options.sortBy - Field to sort by
 * @param {boolean} options.sortDesc - Sort in descending order
 * @param {string} options.search - Search term
 * @param {string} options.category - Category filter
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminProducts = async (options = {}) => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    const {
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortDesc = true,
      search = '',
      category = ''
    } = options;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (id, url, is_primary),
        product_categories (
          categories (id, name)
        )
      `, { count: 'exact' });

    // Apply search if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // Apply category filter if provided
    if (category) {
      query = query.eq('product_categories.category_id', category);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: !sortDesc });

    // Apply pagination
    query = paginate(query, page, pageSize);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format product data
    const formattedProducts = data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      sku: product.sku,
      stockQuantity: product.stock_quantity,
      categories: product.product_categories.map(pc => ({
        id: pc.categories.id,
        name: pc.categories.name
      })),
      primaryImage: product.product_images.find(img => img.is_primary)?.url ||
                   (product.product_images.length > 0 ? product.product_images[0].url : null),
      images: product.product_images.map(img => ({
        id: img.id,
        url: img.url,
        isPrimary: img.is_primary
      })),
      isActive: product.is_active,
      isFeatured: product.is_featured,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return {
      success: true,
      data: {
        products: formattedProducts,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getAdminProducts');
  }
};

/**
 * Get a product by ID (admin)
 * @param {string} productId - Product ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminProduct = async (productId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { productId },
      ['productId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Get product
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (id, url, is_primary),
        product_variants (id, name, price, sale_price, stock_quantity, attributes),
        product_categories (
          category_id,
          categories (id, name)
        )
      `)
      .eq('id', productId)
      .single();

    if (error) {
      throw error;
    }

    // Format product data
    const formattedProduct = {
      id: data.id,
      name: data.name,
      description: data.description,
      shortDescription: data.short_description,
      price: data.price,
      salePrice: data.sale_price,
      sku: data.sku,
      stockQuantity: data.stock_quantity,
      weight: data.weight,
      dimensions: data.dimensions,
      categories: data.product_categories.map(pc => ({
        id: pc.category_id,
        name: pc.categories.name
      })),
      images: data.product_images.map(img => ({
        id: img.id,
        url: img.url,
        isPrimary: img.is_primary
      })),
      variants: data.product_variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: variant.price,
        salePrice: variant.sale_price,
        stockQuantity: variant.stock_quantity,
        attributes: variant.attributes
      })),
      isActive: data.is_active,
      isFeatured: data.is_featured,
      isNew: data.is_new,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      metaKeywords: data.meta_keywords,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    return {
      success: true,
      data: formattedProduct
    };
  } catch (error) {
    return handleApiError(error, 'getAdminProduct');
  }
};

/**
 * Create a new product (admin)
 * @param {Object} product - Product data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const createProduct = async (product) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        name: product.name,
        price: product.price
      },
      ['name', 'price']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Start a transaction
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        short_description: product.shortDescription,
        price: product.price,
        sale_price: product.salePrice,
        sku: product.sku,
        stock_quantity: product.stockQuantity,
        weight: product.weight,
        dimensions: product.dimensions,
        is_active: product.isActive !== undefined ? product.isActive : true,
        is_featured: product.isFeatured || false,
        is_new: product.isNew || false,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        meta_keywords: product.metaKeywords,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add categories if provided
    if (product.categories && product.categories.length > 0) {
      const categoryLinks = product.categories.map(categoryId => ({
        product_id: data.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('product_categories')
        .insert(categoryLinks);

      if (categoryError) {
        throw categoryError;
      }
    }

    // Add images if provided
    if (product.images && product.images.length > 0) {
      const imageRecords = product.images.map((image, index) => ({
        product_id: data.id,
        url: image.url,
        is_primary: image.isPrimary || index === 0,
        display_order: index + 1
      }));

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageRecords);

      if (imageError) {
        throw imageError;
      }
    }

    // Add variants if provided
    if (product.variants && product.variants.length > 0) {
      const variantRecords = product.variants.map(variant => ({
        product_id: data.id,
        name: variant.name,
        price: variant.price,
        sale_price: variant.salePrice,
        stock_quantity: variant.stockQuantity,
        attributes: variant.attributes
      }));

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantRecords);

      if (variantError) {
        throw variantError;
      }
    }

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        message: 'Product created successfully'
      }
    };
  } catch (error) {
    return handleApiError(error, 'createProduct');
  }
};

/**
 * Update a product (admin)
 * @param {string} productId - Product ID
 * @param {Object} product - Updated product data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateProduct = async (productId, product) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        productId,
        name: product.name,
        price: product.price
      },
      ['productId', 'name', 'price']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Update product
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        short_description: product.shortDescription,
        price: product.price,
        sale_price: product.salePrice,
        sku: product.sku,
        stock_quantity: product.stockQuantity,
        weight: product.weight,
        dimensions: product.dimensions,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        is_new: product.isNew,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        meta_keywords: product.metaKeywords,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update categories if provided
    if (product.categories) {
      // Delete existing category links
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', productId);

      if (deleteError) {
        throw deleteError;
      }

      // Add new category links
      if (product.categories.length > 0) {
        const categoryLinks = product.categories.map(categoryId => ({
          product_id: productId,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('product_categories')
          .insert(categoryLinks);

        if (categoryError) {
          throw categoryError;
        }
      }
    }

    // Update images if provided
    if (product.images) {
      // Delete existing images
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (deleteError) {
        throw deleteError;
      }

      // Add new images
      if (product.images.length > 0) {
        const imageRecords = product.images.map((image, index) => ({
          product_id: productId,
          url: image.url,
          is_primary: image.isPrimary || index === 0,
          display_order: index + 1
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageRecords);

        if (imageError) {
          throw imageError;
        }
      }
    }

    // Update variants if provided
    if (product.variants) {
      // Delete existing variants
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      if (deleteError) {
        throw deleteError;
      }

      // Add new variants
      if (product.variants.length > 0) {
        const variantRecords = product.variants.map(variant => ({
          product_id: productId,
          name: variant.name,
          price: variant.price,
          sale_price: variant.salePrice,
          stock_quantity: variant.stockQuantity,
          attributes: variant.attributes
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantRecords);

        if (variantError) {
          throw variantError;
        }
      }
    }

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        message: 'Product updated successfully'
      }
    };
  } catch (error) {
    return handleApiError(error, 'updateProduct');
  }
};

/**
 * Delete a product (admin)
 * @param {string} productId - Product ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProduct = async (productId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { productId },
      ['productId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Delete product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    return handleApiError(error, 'deleteProduct');
  }
};

/**
 * Get all orders (admin)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @param {string} options.sortBy - Field to sort by
 * @param {boolean} options.sortDesc - Sort in descending order
 * @param {string} options.status - Order status filter
 * @param {string} options.search - Search term
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminOrders = async (options = {}) => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    const {
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortDesc = true,
      status = '',
      search = ''
    } = options;

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        user_profiles (first_name, last_name, email)
      `, { count: 'exact' });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply search if provided
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,user_profiles.first_name.ilike.%${search}%,user_profiles.last_name.ilike.%${search}%,user_profiles.email.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: !sortDesc });

    // Apply pagination
    query = paginate(query, page, pageSize);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format order data
    const formattedOrders = data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      userName: order.user_profiles ? `${order.user_profiles.first_name} ${order.user_profiles.last_name}` : 'Unknown User',
      userEmail: order.user_profiles?.email,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      shippingMethod: order.shipping_method,
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    return {
      success: true,
      data: {
        orders: formattedOrders,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getAdminOrders');
  }
};

/**
 * Get order details (admin)
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminOrderDetails = async (orderId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { orderId },
      ['orderId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        user_profiles (first_name, last_name, email, phone)
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      throw orderError;
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (name, sku, price)
      `)
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    // Format order data
    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      user: {
        firstName: order.user_profiles?.first_name,
        lastName: order.user_profiles?.last_name,
        email: order.user_profiles?.email,
        phone: order.user_profiles?.phone
      },
      items: orderItems.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.products?.name,
        sku: item.products?.sku,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        variantId: item.variant_id,
        variantName: item.variant_name,
        giftBoxId: item.gift_box_id,
        giftBoxType: item.gift_box_type
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shipping_cost,
      discount: order.discount,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      transactionId: order.transaction_id,
      shippingMethod: order.shipping_method,
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };

    return {
      success: true,
      data: formattedOrder
    };
  } catch (error) {
    return handleApiError(error, 'getAdminOrderDetails');
  }
};

/**
 * Update order status (admin)
 * @param {string} orderId - Order ID
 * @param {Object} updates - Updates to apply
 * @param {string} updates.status - Order status
 * @param {string} updates.paymentStatus - Payment status
 * @param {string} updates.notes - Order notes
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateOrderStatus = async (orderId, updates) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { orderId },
      ['orderId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Prepare update data
    const updateData = {};
    if (updates.status) updateData.status = updates.status;
    if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    updateData.updated_at = new Date().toISOString();

    // Update order
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        admin_id: adminCheck.data.adminData.user_id,
        action: 'update_order',
        resource_id: orderId,
        details: {
          updates: updateData
        },
        created_at: new Date().toISOString()
      });

    return {
      success: true,
      data: {
        id: data.id,
        status: data.status,
        paymentStatus: data.payment_status,
        updatedAt: data.updated_at,
        message: 'Order updated successfully'
      }
    };
  } catch (error) {
    return handleApiError(error, 'updateOrderStatus');
  }
};

/**
 * Get all users for admin
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @param {string} options.sortBy - Field to sort by
 * @param {boolean} options.sortDesc - Sort in descending order
 * @param {string} options.search - Search term
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getAdminUsers = async (options = {}) => {
  try {
    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    const {
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortDesc = true,
      search = ''
    } = options;

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        auth_users:user_id (email, created_at, last_sign_in_at)
      `, { count: 'exact' });

    // Apply search if provided
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,auth_users.email.ilike.%${search}%`);
    }

    // Apply sorting
    if (sortBy === 'email') {
      query = query.order('auth_users.email', { ascending: !sortDesc });
    } else if (sortBy === 'created_at') {
      query = query.order('auth_users.created_at', { ascending: !sortDesc });
    } else {
      query = query.order(sortBy, { ascending: !sortDesc });
    }

    // Apply pagination
    query = query.range(from, to);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format user data
    const formattedUsers = data.map(user => ({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.auth_users?.email,
      phone: user.phone,
      createdAt: user.auth_users?.created_at,
      lastSignIn: user.auth_users?.last_sign_in_at,
      avatarUrl: user.avatar_url
    }));

    return {
      success: true,
      data: {
        users: formattedUsers,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    return handleApiError(error, 'getAdminUsers');
  }
};

/**
 * Get user details for admin
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getUserDetails = async (userId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { userId },
      ['userId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        auth_users:user_id (email, created_at, last_sign_in_at, user_metadata)
      `)
      .eq('user_id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get user addresses
    const { data: addresses, error: addressesError } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId);

    if (addressesError) {
      throw addressesError;
    }

    // Get user orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Format user data
    const userData = {
      id: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.auth_users?.email,
      phone: profile.phone,
      birthdate: profile.birthdate,
      createdAt: profile.auth_users?.created_at,
      lastSignIn: profile.auth_users?.last_sign_in_at,
      avatarUrl: profile.avatar_url,
      preferences: profile.preferences,
      addresses: addresses.map(address => ({
        id: address.id,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country,
        phone: address.phone,
        isDefault: address.is_default
      })),
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        amount: order.total_amount,
        status: order.status,
        date: order.created_at
      }))
    };

    return {
      success: true,
      data: userData
    };
  } catch (error) {
    return handleApiError(error, 'getUserDetails');
  }
};

/**
 * Update user profile for admin
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { userId },
      ['userId']
    );

    if (validationError) {
      return validationError;
    }

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Prepare update data
    const updateData = {};
    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    updateData.updated_at = new Date().toISOString();

    // Update user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If email is being updated, update auth user
    if (updates.email) {
      // This would typically be handled by Supabase Auth Admin API
      // For this example, we'll just return a message
      console.log(`Email update for user ${userId} would be processed via Supabase Auth Admin API`);
    }

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        admin_id: adminCheck.data.adminData.user_id,
        action: 'update_user',
        resource_id: userId,
        details: {
          updates: updateData
        },
        created_at: new Date().toISOString()
      });

    return {
      success: true,
      data: {
        id: data.user_id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        updatedAt: data.updated_at,
        message: 'User profile updated successfully'
      }
    };
  } catch (error) {
    return handleApiError(error, 'updateUserProfile');
  }
};

export default {
  checkAdminStatus,
  getDashboardStats,
  getAdminSettings,
  updateAdminSettings,
  getAdminActivity,
  getAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  getAdminOrderDetails,
  updateOrderStatus,
  getAdminUsers,
  getUserDetails,
  updateUserProfile
};
