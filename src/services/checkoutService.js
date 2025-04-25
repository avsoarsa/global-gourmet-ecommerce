import { supabase } from '../utils/supabaseClient';
import { getCart, clearCart } from './cartService';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';
import { memoize, paginate } from '../utils/performanceUtils';

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
    const validationError = validateRequiredFields(
      {
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        shippingMethod: checkoutData.shippingMethod
      },
      ['shippingAddress', 'paymentMethod', 'shippingMethod']
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

    // Get current cart
    const { success: cartSuccess, data: cart, error: cartError } = await getCart();

    if (!cartSuccess) {
      return {
        success: false,
        error: cartError || 'Failed to get cart',
        status: 400
      };
    }

    if (!cart.items || cart.items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
        status: 400
      };
    }

    // Use shipping address for billing if not provided
    const billingAddress = checkoutData.billingAddress || checkoutData.shippingAddress;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userData.user.id,
        order_number: orderNumber,
        status: 'pending',
        subtotal: cart.subtotal,
        discount: cart.discount || 0,
        shipping_cost: cart.shipping_cost || 0,
        tax: cart.tax || 0,
        total_amount: cart.total,
        shipping_address: checkoutData.shippingAddress,
        billing_address: billingAddress,
        payment_method: checkoutData.paymentMethod,
        payment_status: 'pending',
        shipping_method: checkoutData.shippingMethod,
        payment_details: checkoutData.paymentDetails || {},
        notes: checkoutData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

    // Clear cart
    await clearCart();

    // Track purchase event for analytics
    try {
      const { trackPurchase } = await import('./analyticsService');
      await trackPurchase({
        orderId: order.id,
        orderNumber: order.order_number,
        revenue: cart.total,
        tax: cart.tax || 0,
        shipping: cart.shipping_cost || 0,
        items: cart.items
      });
    } catch (analyticsError) {
      console.warn('Failed to track purchase event:', analyticsError);
      // Don't fail the order creation if analytics tracking fails
    }

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
    return handleApiError(error, 'createOrder');
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
 * Get an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getOrder = async (orderId) => {
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

    // Format order items to include primary image
    if (data && data.order_items) {
      data.order_items = data.order_items.map(item => {
        if (item.products && item.products.product_images) {
          const primaryImage = item.products.product_images.find(img => img.is_primary);
          item.products.primaryImage = primaryImage ? primaryImage.url :
                                      (item.products.product_images.length > 0 ? item.products.product_images[0].url : null);
        }
        return item;
      });
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return handleApiError(error, 'getOrder');
  }
};

/**
 * Get all orders for the current user
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.status - Filter by status
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getOrders = async (options = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status
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
          total,
          products (
            id,
            name,
            product_images (
              id,
              url,
              is_primary
            )
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

    // Format orders to include primary images
    const formattedOrders = data.map(order => {
      if (order.order_items) {
        order.order_items = order.order_items.map(item => {
          if (item.products && item.products.product_images) {
            const primaryImage = item.products.product_images.find(img => img.is_primary);
            item.products.primaryImage = primaryImage ? primaryImage.url :
                                        (item.products.product_images.length > 0 ? item.products.product_images[0].url : null);
          }
          return item;
        });
      }
      return order;
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / pageSize);

    return {
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          page,
          pageSize,
          totalItems: count,
          totalPages
        }
      }
    };
  } catch (error) {
    return handleApiError(error, 'getOrders');
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
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
      return {
        success: false,
        error: 'Order not found',
        status: 404
      };
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      return {
        success: false,
        error: `Cannot cancel order with status: ${order.status}`,
        status: 400
      };
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_id', userData.user.id)
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
      data
    };
  } catch (error) {
    return handleApiError(error, 'cancelOrder');
  }
};

/**
 * Get available shipping methods
 * @param {Object} options - Options
 * @param {Object} options.address - Shipping address
 * @param {number} options.cartTotal - Cart total amount
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>}
 */
export const getShippingMethods = async (options = {}) => {
  try {
    const { address, cartTotal = 0 } = options;

    // In a real application, this would call a shipping API
    // For now, we'll return some dummy shipping methods
    const allShippingMethods = [
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
      },
      {
        id: 'free',
        name: 'Free Shipping',
        description: 'Delivery in 7-10 business days',
        price: 0,
        estimated_days: 10,
        minimum_order: 50 // Minimum order amount for free shipping
      }
    ];

    // Filter shipping methods based on cart total
    const availableShippingMethods = allShippingMethods.filter(method => {
      if (method.id === 'free') {
        return cartTotal >= method.minimum_order;
      }
      return true;
    });

    // If address is provided, we could filter based on location
    // For example, some shipping methods might not be available in certain regions
    if (address) {
      // In a real application, this would check if the shipping method is available for the address
      // For now, we'll just return all available methods
    }

    return {
      success: true,
      data: availableShippingMethods
    };
  } catch (error) {
    return handleApiError(error, 'getShippingMethods');
  }
};

/**
 * Get available payment methods
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>}
 */
export const getPaymentMethods = async () => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    // Define standard payment methods
    const standardPaymentMethods = [
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
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: 'cash'
      }
    ];

    // If user is logged in, get saved payment methods
    if (userData.user) {
      try {
        const { data: savedMethods, error: savedMethodsError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', userData.user.id);

        if (savedMethodsError) {
          throw savedMethodsError;
        }

        // Format saved payment methods
        const formattedSavedMethods = savedMethods.map(method => {
          if (method.type === 'credit_card') {
            return {
              id: `saved_${method.id}`,
              type: 'saved_card',
              name: `${method.details.cardType.toUpperCase()} ending in ${method.details.last4}`,
              description: `Expires ${method.details.expiryMonth}/${method.details.expiryYear}`,
              icon: method.details.cardType.toLowerCase(),
              isDefault: method.is_default,
              savedMethodId: method.id,
              details: method.details
            };
          } else if (method.type === 'paypal') {
            return {
              id: `saved_${method.id}`,
              type: 'saved_paypal',
              name: 'PayPal',
              description: method.details.paypalEmail,
              icon: 'paypal',
              isDefault: method.is_default,
              savedMethodId: method.id,
              details: method.details
            };
          }
          return null;
        }).filter(Boolean);

        // Add saved methods to the beginning of the list
        return {
          success: true,
          data: [...formattedSavedMethods, ...standardPaymentMethods]
        };
      } catch (error) {
        console.warn('Error fetching saved payment methods:', error);
        // Continue with standard payment methods if there's an error
      }
    }

    return {
      success: true,
      data: standardPaymentMethods
    };
  } catch (error) {
    return handleApiError(error, 'getPaymentMethods');
  }
};

/**
 * Process payment
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.method - Payment method
 * @param {Object} paymentData.details - Payment details
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.orderId - Order ID
 * @param {boolean} paymentData.savePaymentMethod - Whether to save the payment method
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const processPayment = async (paymentData) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        method: paymentData.method,
        details: paymentData.details,
        amount: paymentData.amount,
        orderId: paymentData.orderId
      },
      ['method', 'details', 'amount', 'orderId']
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

    // Process payment based on method
    let paymentResult;

    switch (paymentData.method) {
      case 'credit_card':
        paymentResult = await processCreditCardPayment(paymentData);
        break;
      case 'paypal':
        paymentResult = await processPayPalPayment(paymentData);
        break;
      case 'apple_pay':
        paymentResult = await processApplePayPayment(paymentData);
        break;
      case 'google_pay':
        paymentResult = await processGooglePayPayment(paymentData);
        break;
      case 'cod':
        paymentResult = await processCashOnDeliveryPayment(paymentData);
        break;
      default:
        if (paymentData.method.startsWith('saved_')) {
          paymentResult = await processSavedPaymentMethod(paymentData);
        } else {
          return {
            success: false,
            error: `Unsupported payment method: ${paymentData.method}`,
            status: 400
          };
        }
    }

    if (!paymentResult.success) {
      return paymentResult;
    }

    // Save payment method if requested
    if (paymentData.savePaymentMethod &&
        (paymentData.method === 'credit_card' || paymentData.method === 'paypal')) {
      try {
        await savePaymentMethod(paymentData);
      } catch (saveError) {
        console.warn('Failed to save payment method:', saveError);
        // Don't fail the payment if saving the method fails
      }
    }

    // Update order with payment information
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentResult.data.status,
        transaction_id: paymentResult.data.id,
        payment_details: paymentResult.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentData.orderId)
      .eq('user_id', userData.user.id);

    if (updateError) {
      throw updateError;
    }

    // Create payment record
    const { error: paymentRecordError } = await supabase
      .from('payments')
      .insert({
        order_id: paymentData.orderId,
        user_id: userData.user.id,
        amount: paymentData.amount,
        currency: 'usd',
        payment_method: paymentData.method,
        status: paymentResult.data.status,
        transaction_id: paymentResult.data.id,
        payment_details: paymentResult.data,
        created_at: new Date().toISOString()
      });

    if (paymentRecordError) {
      throw paymentRecordError;
    }

    // Track payment event for analytics
    try {
      const { trackEvent } = await import('./analyticsService');
      await trackEvent('payment_processed', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        status: paymentResult.data.status
      });
    } catch (analyticsError) {
      console.warn('Failed to track payment event:', analyticsError);
      // Don't fail the payment if analytics tracking fails
    }

    return {
      success: true,
      data: paymentResult.data
    };
  } catch (error) {
    return handleApiError(error, 'processPayment');
  }
};

/**
 * Process credit card payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processCreditCardPayment = async (paymentData) => {
  try {
    // Validate credit card details
    const { details } = paymentData;
    const validationError = validateRequiredFields(
      {
        cardNumber: details.cardNumber,
        expiryMonth: details.expiryMonth,
        expiryYear: details.expiryYear,
        cvv: details.cvv,
        cardholderName: details.cardholderName
      },
      ['cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'cardholderName']
    );

    if (validationError) {
      return validationError;
    }

    // In a real application, this would call a payment gateway API
    // For now, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentResult = {
      id: `cc_${Date.now()}`,
      status: 'succeeded',
      amount: paymentData.amount,
      currency: 'usd',
      method: 'credit_card',
      cardType: getCardType(details.cardNumber),
      last4: details.cardNumber.slice(-4),
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process credit card payment',
      status: 500
    };
  }
};

/**
 * Process PayPal payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processPayPalPayment = async (paymentData) => {
  try {
    // In a real application, this would call the PayPal API
    // For now, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentResult = {
      id: `pp_${Date.now()}`,
      status: 'succeeded',
      amount: paymentData.amount,
      currency: 'usd',
      method: 'paypal',
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process PayPal payment',
      status: 500
    };
  }
};

/**
 * Process Apple Pay payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processApplePayPayment = async (paymentData) => {
  try {
    // In a real application, this would call the Apple Pay API
    // For now, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentResult = {
      id: `ap_${Date.now()}`,
      status: 'succeeded',
      amount: paymentData.amount,
      currency: 'usd',
      method: 'apple_pay',
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process Apple Pay payment',
      status: 500
    };
  }
};

/**
 * Process Google Pay payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processGooglePayPayment = async (paymentData) => {
  try {
    // In a real application, this would call the Google Pay API
    // For now, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentResult = {
      id: `gp_${Date.now()}`,
      status: 'succeeded',
      amount: paymentData.amount,
      currency: 'usd',
      method: 'google_pay',
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process Google Pay payment',
      status: 500
    };
  }
};

/**
 * Process Cash on Delivery payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processCashOnDeliveryPayment = async (paymentData) => {
  try {
    // For COD, we just create a pending payment
    const paymentResult = {
      id: `cod_${Date.now()}`,
      status: 'pending', // COD payments are pending until delivery
      amount: paymentData.amount,
      currency: 'usd',
      method: 'cod',
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: paymentResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process Cash on Delivery payment',
      status: 500
    };
  }
};

/**
 * Process saved payment method
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processSavedPaymentMethod = async (paymentData) => {
  try {
    // Get saved payment method ID
    const savedMethodId = paymentData.details.savedMethodId;

    if (!savedMethodId) {
      return {
        success: false,
        error: 'Saved payment method ID is required',
        status: 400
      };
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

    // Get saved payment method
    const { data: savedMethod, error: savedMethodError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', savedMethodId)
      .eq('user_id', userData.user.id)
      .single();

    if (savedMethodError) {
      throw savedMethodError;
    }

    // Process payment based on saved method type
    if (savedMethod.type === 'credit_card') {
      // In a real application, this would use the saved card token to charge the card
      // For now, we'll simulate a successful payment

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentResult = {
        id: `saved_cc_${Date.now()}`,
        status: 'succeeded',
        amount: paymentData.amount,
        currency: 'usd',
        method: 'credit_card',
        cardType: savedMethod.details.cardType,
        last4: savedMethod.details.last4,
        created_at: new Date().toISOString()
      };

      return {
        success: true,
        data: paymentResult
      };
    } else if (savedMethod.type === 'paypal') {
      // In a real application, this would use the saved PayPal token to charge the account
      // For now, we'll simulate a successful payment

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentResult = {
        id: `saved_pp_${Date.now()}`,
        status: 'succeeded',
        amount: paymentData.amount,
        currency: 'usd',
        method: 'paypal',
        paypalEmail: savedMethod.details.paypalEmail,
        created_at: new Date().toISOString()
      };

      return {
        success: true,
        data: paymentResult
      };
    } else {
      return {
        success: false,
        error: `Unsupported saved payment method type: ${savedMethod.type}`,
        status: 400
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process saved payment method',
      status: 500
    };
  }
};

/**
 * Save payment method
 * @param {Object} paymentData - Payment data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const savePaymentMethod = async (paymentData) => {
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

    // Prepare payment method data
    let paymentMethodData = {
      user_id: userData.user.id,
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (paymentData.method === 'credit_card') {
      const { details } = paymentData;
      paymentMethodData = {
        ...paymentMethodData,
        type: 'credit_card',
        details: {
          cardType: getCardType(details.cardNumber),
          last4: details.cardNumber.slice(-4),
          expiryMonth: details.expiryMonth,
          expiryYear: details.expiryYear,
          cardholderName: details.cardholderName
        }
      };
    } else if (paymentData.method === 'paypal') {
      paymentMethodData = {
        ...paymentMethodData,
        type: 'paypal',
        details: {
          paypalEmail: paymentData.details.paypalEmail || 'user@example.com'
        }
      };
    } else {
      return {
        success: false,
        error: `Cannot save payment method of type: ${paymentData.method}`,
        status: 400
      };
    }

    // Update existing payment methods to not be default
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userData.user.id)
      .eq('is_default', true);

    if (updateError) {
      throw updateError;
    }

    // Save new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethodData)
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
    console.error('Save payment method error:', error);
    return {
      success: false,
      error: error.message || 'Failed to save payment method',
      status: 500
    };
  }
};

/**
 * Get card type from card number
 * @param {string} cardNumber - Credit card number
 * @returns {string} - Card type
 */
const getCardType = (cardNumber) => {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');

  // Visa
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }

  // Mastercard
  if (/^5[1-5]/.test(cleanNumber)) {
    return 'mastercard';
  }

  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }

  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return 'discover';
  }

  return 'unknown';
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
