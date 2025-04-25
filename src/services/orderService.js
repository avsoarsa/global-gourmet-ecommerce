/**
 * Order Service
 * Handles all order-related API calls to Supabase
 */

import { supabase } from '../utils/supabaseClient';
import { clearCart } from './cartService';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';
import { memoize, paginate } from '../utils/performanceUtils';

/**
 * Create a new order
 * @param {Object} order - Order data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Created order
 */
export const createOrder = async (order) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        items: order.items,
        subtotal: order.subtotal,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        shippingAddressId: order.shippingAddressId
      },
      ['items', 'subtotal', 'totalAmount', 'paymentMethod', 'shippingMethod', 'shippingAddressId']
    );

    if (validationError) {
      return validationError;
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create the order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        order_number: orderNumber,
        status: 'pending',
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        tax_amount: order.taxAmount,
        discount_amount: order.discountAmount || 0,
        total_amount: order.totalAmount,
        currency: order.currency || 'USD',
        shipping_address_id: order.shippingAddressId,
        billing_address_id: order.billingAddressId || order.shippingAddressId,
        payment_method: order.paymentMethod,
        payment_status: 'pending',
        shipping_method: order.shippingMethod,
        notes: order.notes,
        gift_message: order.giftMessage,
        is_gift: order.isGift || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add order items
    if (order.items && order.items.length > 0) {
      const orderItems = order.items.map(item => ({
        order_id: data.id,
        product_id: item.productId,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }
    }

    // Clear the cart after successful order creation
    await clearCart();

    // Track purchase event for analytics
    try {
      const { trackPurchase } = await import('./analyticsService');
      await trackPurchase({
        orderId: data.id,
        orderNumber: data.order_number,
        totalAmount: data.total_amount,
        items: order.items
      });
    } catch (analyticsError) {
      console.warn('Failed to track purchase event:', analyticsError);
      // Don't fail the order creation if analytics tracking fails
    }

    return {
      success: true,
      data: {
        id: data.id,
        orderNumber: data.order_number,
        status: data.status,
        subtotal: data.subtotal,
        shippingCost: data.shipping_cost,
        taxAmount: data.tax_amount,
        discountAmount: data.discount_amount,
        totalAmount: data.total_amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        paymentStatus: data.payment_status,
        shippingMethod: data.shipping_method,
        createdAt: data.created_at
      }
    };
  } catch (error) {
    return handleApiError(error, 'createOrder');
  }
};

/**
 * Get user's orders
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Page size
 * @param {string} options.status - Order status filter
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Orders and pagination info
 */
export const getUserOrders = async (options = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status = ''
    } = options;

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

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (
            id,
            name,
            slug,
            product_images (
              id,
              url,
              is_primary
            )
          ),
          variant:product_variants (
            id,
            name,
            weight
          )
        )
      `, { count: 'exact' })
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = paginate(query, page, pageSize);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    const formattedOrders = data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      taxAmount: order.tax_amount,
      discountAmount: order.discount_amount,
      totalAmount: order.total_amount,
      currency: order.currency,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      shippingMethod: order.shipping_method,
      trackingNumber: order.tracking_number,
      createdAt: order.created_at,
      completedAt: order.completed_at,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.product_images?.find(img => img.is_primary)?.url ||
                (item.product.product_images?.length > 0 ? item.product.product_images[0].url : '')
        },
        variantId: item.product_variant_id,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          weight: item.variant.weight
        } : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
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
    return handleApiError(error, 'getUserOrders');
  }
};

/**
 * Get an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Order details
 */
export const getOrderById = async (orderId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { orderId },
      ['orderId']
    );

    if (validationError) {
      return validationError;
    }

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

    // Get the order
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (
            id,
            name,
            slug,
            product_images (
              id,
              url,
              is_primary
            )
          ),
          variant:product_variants (
            id,
            name,
            weight
          )
        ),
        shipping_address:addresses!shipping_address_id (*),
        billing_address:addresses!billing_address_id (*)
      `)
      .eq('id', orderId)
      .eq('user_id', userData.user.id)
      .single();

    if (error) {
      throw error;
    }

    // Get order tracking information
    const { data: tracking, error: trackingError } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: false });

    if (trackingError && trackingError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw trackingError;
    }

    // Format the response to match the expected structure in the frontend
    const formattedOrder = {
      id: data.id,
      orderNumber: data.order_number,
      status: data.status,
      subtotal: data.subtotal,
      shippingCost: data.shipping_cost,
      taxAmount: data.tax_amount,
      discountAmount: data.discount_amount,
      totalAmount: data.total_amount,
      currency: data.currency,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      shippingMethod: data.shipping_method,
      trackingNumber: data.tracking_number,
      notes: data.notes,
      giftMessage: data.gift_message,
      isGift: data.is_gift,
      createdAt: data.created_at,
      completedAt: data.completed_at,
      shippingAddress: data.shipping_address ? {
        id: data.shipping_address.id,
        firstName: data.shipping_address.first_name,
        lastName: data.shipping_address.last_name,
        company: data.shipping_address.company,
        addressLine1: data.shipping_address.address_line1,
        addressLine2: data.shipping_address.address_line2,
        city: data.shipping_address.city,
        state: data.shipping_address.state,
        postalCode: data.shipping_address.postal_code,
        country: data.shipping_address.country,
        phone: data.shipping_address.phone,
        deliveryInstructions: data.shipping_address.delivery_instructions
      } : null,
      billingAddress: data.billing_address ? {
        id: data.billing_address.id,
        firstName: data.billing_address.first_name,
        lastName: data.billing_address.last_name,
        company: data.billing_address.company,
        addressLine1: data.billing_address.address_line1,
        addressLine2: data.billing_address.address_line2,
        city: data.billing_address.city,
        state: data.billing_address.state,
        postalCode: data.billing_address.postal_code,
        country: data.billing_address.country,
        phone: data.billing_address.phone
      } : null,
      items: data.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.product_images?.find(img => img.is_primary)?.url ||
                (item.product.product_images?.length > 0 ? item.product.product_images[0].url : '')
        },
        variantId: item.product_variant_id,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          weight: item.variant.weight
        } : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      tracking: tracking || []
    };

    return {
      success: true,
      data: formattedOrder
    };
  } catch (error) {
    return handleApiError(error, 'getOrderById');
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Cancelled order
 */
export const cancelOrder = async (orderId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { orderId },
      ['orderId']
    );

    if (validationError) {
      return validationError;
    }

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

    // Check if the order belongs to the user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('user_id, status')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (order.user_id !== userData.user.id) {
      return {
        success: false,
        error: 'You do not have permission to cancel this order',
        status: 403
      };
    }

    // Check if the order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      return {
        success: false,
        error: `Cannot cancel order with status: ${order.status}`,
        status: 400
      };
    }

    // Cancel the order
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Track cancellation event for analytics
    try {
      const { trackEvent } = await import('./analyticsService');
      await trackEvent('order_cancelled', {
        orderId: data.id,
        orderNumber: data.order_number
      });
    } catch (analyticsError) {
      console.warn('Failed to track order cancellation event:', analyticsError);
      // Don't fail the order cancellation if analytics tracking fails
    }

    return {
      success: true,
      data: {
        id: data.id,
        orderNumber: data.order_number,
        status: data.status,
        cancelledAt: data.cancelled_at
      }
    };
  } catch (error) {
    return handleApiError(error, 'cancelOrder');
  }
};

/**
 * Generate a unique order number
 * @returns {string} - Order number
 */
const generateOrderNumber = () => {
  const prefix = 'GG';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Track an order by order number
 * @param {string} orderNumber - Order number
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Order tracking information
 */
export const trackOrder = async (orderNumber) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { orderNumber },
      ['orderNumber']
    );

    if (validationError) {
      return validationError;
    }

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

    // Get order by order number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('user_id', userData.user.id)
      .single();

    if (orderError) {
      throw orderError;
    }

    // Get tracking information
    const { data: tracking, error: trackingError } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', order.id)
      .order('timestamp', { ascending: false });

    if (trackingError && trackingError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw trackingError;
    }

    // Get estimated delivery date
    let estimatedDelivery = null;
    if (order.shipping_method === 'standard') {
      // Standard shipping: 3-5 business days
      const orderDate = new Date(order.created_at);
      estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(orderDate.getDate() + 5);
    } else if (order.shipping_method === 'express') {
      // Express shipping: 1-2 business days
      const orderDate = new Date(order.created_at);
      estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(orderDate.getDate() + 2);
    }

    return {
      success: true,
      data: {
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          createdAt: order.created_at,
          shippingMethod: order.shipping_method,
          trackingNumber: order.tracking_number
        },
        tracking: tracking || [],
        estimatedDelivery: estimatedDelivery ? estimatedDelivery.toISOString() : null
      }
    };
  } catch (error) {
    return handleApiError(error, 'trackOrder');
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder
};
