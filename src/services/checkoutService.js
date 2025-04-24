import { supabase } from '../utils/supabaseClient';
import { getCart, clearCart } from './cartService';

/**
 * Create a new order from the current cart
 * @param {Object} checkoutData - Checkout data
 * @param {Object} checkoutData.shippingAddress - Shipping address
 * @param {Object} checkoutData.billingAddress - Billing address (optional, defaults to shipping address)
 * @param {string} checkoutData.paymentMethod - Payment method
 * @param {string} checkoutData.shippingMethod - Shipping method
 * @param {Object} checkoutData.paymentDetails - Payment details (optional)
 * @param {string} checkoutData.notes - Order notes (optional)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const createOrder = async (checkoutData) => {
  try {
    // Validate required fields
    if (!checkoutData.shippingAddress || !checkoutData.paymentMethod || !checkoutData.shippingMethod) {
      throw new Error('Shipping address, payment method, and shipping method are required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get current cart
    const { success: cartSuccess, data: cart, error: cartError } = await getCart();

    if (!cartSuccess) {
      throw new Error(cartError || 'Failed to get cart');
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Use shipping address for billing if not provided
    const billingAddress = checkoutData.billingAddress || checkoutData.shippingAddress;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userData.user.id,
        status: 'pending',
        subtotal: cart.subtotal,
        discount: cart.discount || 0,
        shipping_cost: cart.shipping_cost || 0,
        tax: cart.tax || 0,
        total: cart.total,
        shipping_address: checkoutData.shippingAddress,
        billing_address: billingAddress,
        payment_method: checkoutData.paymentMethod,
        shipping_method: checkoutData.shippingMethod,
        payment_details: checkoutData.paymentDetails || {},
        notes: checkoutData.notes || '',
        created_at: new Date(),
        updated_at: new Date()
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      created_at: new Date(),
      updated_at: new Date()
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Clear cart
    await clearCart();

    // Get complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            product_images (
              id,
              url,
              is_primary
            )
          ),
          product_variants (
            id,
            name
          )
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return {
      success: true,
      data: completeOrder
    };
  } catch (error) {
    console.error('Create order error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get order
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            product_images (
              id,
              url,
              is_primary
            )
          ),
          product_variants (
            id,
            name
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userData.user.id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Get order error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all orders for the current user
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getOrders = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status
    } = options;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Start building query
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          quantity,
          price,
          total
        )
      `, { count: 'exact' })
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: {
        orders: data,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages
        }
      }
    };
  } catch (error) {
    console.error('Get orders error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const cancelOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get order to check if it can be canceled
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .eq('user_id', userData.user.id)
      .single();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date()
      })
      .eq('id', orderId)
      .eq('user_id', userData.user.id)
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
    console.error('Cancel order error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get available shipping methods
 * @param {Object} address - Shipping address
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>}
 */
export const getShippingMethods = async (address) => {
  try {
    // In a real application, this would call a shipping API
    // For now, we'll return some dummy shipping methods
    const shippingMethods = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Delivery in 5-7 business days',
        price: 5.99,
        estimated_days: 7
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Delivery in 2-3 business days',
        price: 12.99,
        estimated_days: 3
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Delivery next business day',
        price: 19.99,
        estimated_days: 1
      }
    ];

    return {
      success: true,
      data: shippingMethods
    };
  } catch (error) {
    console.error('Get shipping methods error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get available payment methods
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>}
 */
export const getPaymentMethods = async () => {
  try {
    // In a real application, this would call a payment API
    // For now, we'll return some dummy payment methods
    const paymentMethods = [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or American Express',
        icon: 'credit-card'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: 'paypal'
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        description: 'Pay with Apple Pay',
        icon: 'apple-pay'
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        description: 'Pay with Google Pay',
        icon: 'google-pay'
      }
    ];

    return {
      success: true,
      data: paymentMethods
    };
  } catch (error) {
    console.error('Get payment methods error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process payment
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.method - Payment method
 * @param {Object} paymentData.details - Payment details
 * @param {number} paymentData.amount - Payment amount
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const processPayment = async (paymentData) => {
  try {
    // Validate required fields
    if (!paymentData.method || !paymentData.details || !paymentData.amount) {
      throw new Error('Payment method, details, and amount are required');
    }

    // In a real application, this would call a payment API
    // For now, we'll simulate a successful payment
    const paymentResult = {
      id: `payment_${Date.now()}`,
      status: 'succeeded',
      amount: paymentData.amount,
      currency: 'usd',
      method: paymentData.method,
      created_at: new Date()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    console.error('Process payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  getShippingMethods,
  getPaymentMethods,
  processPayment
};
