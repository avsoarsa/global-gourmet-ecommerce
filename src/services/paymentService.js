/**
 * Payment Service
 * Handles payment processing and integration with payment gateways
 */

import { supabase } from '../utils/supabaseClient';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';

/**
 * Process a payment
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.orderId - Order ID
 * @param {string} paymentData.paymentMethod - Payment method (credit_card, paypal, etc.)
 * @param {Object} paymentData.paymentDetails - Payment details
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const processPayment = async (paymentData) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { 
        orderId: paymentData.orderId,
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: paymentData.paymentDetails
      },
      ['orderId', 'paymentMethod', 'paymentDetails']
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
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', paymentData.orderId)
      .eq('user_id', userData.user.id)
      .single();

    if (orderError) {
      throw orderError;
    }

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return {
        success: false,
        error: 'Order is already paid',
        status: 400
      };
    }

    // Process payment based on payment method
    let paymentResult;
    switch (paymentData.paymentMethod) {
      case 'credit_card':
        paymentResult = await processCreditCardPayment(order, paymentData.paymentDetails);
        break;
      case 'paypal':
        paymentResult = await processPayPalPayment(order, paymentData.paymentDetails);
        break;
      case 'cod':
        paymentResult = await processCashOnDeliveryPayment(order);
        break;
      default:
        return {
          success: false,
          error: `Unsupported payment method: ${paymentData.paymentMethod}`,
          status: 400
        };
    }

    if (!paymentResult.success) {
      return paymentResult;
    }

    // Update order with payment information
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentResult.data.status,
        transaction_id: paymentResult.data.transactionId,
        payment_details: paymentResult.data.details,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentData.orderId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: paymentData.orderId,
        user_id: userData.user.id,
        amount: order.total_amount,
        currency: order.currency || 'USD',
        payment_method: paymentData.paymentMethod,
        status: paymentResult.data.status,
        transaction_id: paymentResult.data.transactionId,
        payment_details: paymentResult.data.details,
        created_at: new Date().toISOString()
      });

    if (paymentError) {
      throw paymentError;
    }

    // Track payment event for analytics
    try {
      const { trackEvent } = await import('./analyticsService');
      await trackEvent('payment_processed', {
        orderId: order.id,
        orderNumber: order.order_number,
        amount: order.total_amount,
        paymentMethod: paymentData.paymentMethod,
        status: paymentResult.data.status
      });
    } catch (analyticsError) {
      console.warn('Failed to track payment event:', analyticsError);
      // Don't fail the payment if analytics tracking fails
    }

    return {
      success: true,
      data: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        paymentStatus: updatedOrder.payment_status,
        transactionId: updatedOrder.transaction_id
      }
    };
  } catch (error) {
    return handleApiError(error, 'processPayment');
  }
};

/**
 * Process a credit card payment
 * @param {Object} order - Order data
 * @param {Object} paymentDetails - Credit card details
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processCreditCardPayment = async (order, paymentDetails) => {
  try {
    // Validate credit card details
    const validationError = validateRequiredFields(
      { 
        cardNumber: paymentDetails.cardNumber,
        expiryMonth: paymentDetails.expiryMonth,
        expiryYear: paymentDetails.expiryYear,
        cvv: paymentDetails.cvv,
        cardholderName: paymentDetails.cardholderName
      },
      ['cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'cardholderName']
    );
    
    if (validationError) {
      return validationError;
    }

    // In a real implementation, this would integrate with a payment gateway
    // For now, we'll simulate a successful payment
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a transaction ID
    const transactionId = `cc_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    return {
      success: true,
      data: {
        status: 'paid',
        transactionId,
        details: {
          cardType: getCardType(paymentDetails.cardNumber),
          last4: paymentDetails.cardNumber.slice(-4),
          expiryMonth: paymentDetails.expiryMonth,
          expiryYear: paymentDetails.expiryYear
        }
      }
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
 * Process a PayPal payment
 * @param {Object} order - Order data
 * @param {Object} paymentDetails - PayPal details
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processPayPalPayment = async (order, paymentDetails) => {
  try {
    // Validate PayPal details
    const validationError = validateRequiredFields(
      { 
        paypalToken: paymentDetails.paypalToken
      },
      ['paypalToken']
    );
    
    if (validationError) {
      return validationError;
    }

    // In a real implementation, this would integrate with PayPal API
    // For now, we'll simulate a successful payment
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a transaction ID
    const transactionId = `pp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    return {
      success: true,
      data: {
        status: 'paid',
        transactionId,
        details: {
          paypalEmail: paymentDetails.paypalEmail || 'customer@example.com'
        }
      }
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
 * Process a cash on delivery payment
 * @param {Object} order - Order data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
const processCashOnDeliveryPayment = async (order) => {
  try {
    // No validation needed for COD
    
    // Generate a transaction ID
    const transactionId = `cod_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    return {
      success: true,
      data: {
        status: 'pending', // COD payments are pending until delivery
        transactionId,
        details: {
          paymentMethod: 'Cash on Delivery',
          amountDue: order.total_amount
        }
      }
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
 * Get saved payment methods for the current user
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getSavedPaymentMethods = async () => {
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

    // Get saved payment methods
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format payment methods
    const formattedPaymentMethods = data.map(method => ({
      id: method.id,
      type: method.type,
      isDefault: method.is_default,
      details: method.details,
      createdAt: method.created_at
    }));

    return {
      success: true,
      data: formattedPaymentMethods
    };
  } catch (error) {
    return handleApiError(error, 'getSavedPaymentMethods');
  }
};

/**
 * Save a payment method
 * @param {Object} paymentMethod - Payment method data
 * @param {string} paymentMethod.type - Payment method type (credit_card, paypal)
 * @param {Object} paymentMethod.details - Payment method details
 * @param {boolean} paymentMethod.isDefault - Whether this is the default payment method
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const savePaymentMethod = async (paymentMethod) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { 
        type: paymentMethod.type,
        details: paymentMethod.details
      },
      ['type', 'details']
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

    // If this is the default payment method, unset any existing default
    if (paymentMethod.isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.user.id)
        .eq('is_default', true);

      if (updateError) {
        throw updateError;
      }
    }

    // Save payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userData.user.id,
        type: paymentMethod.type,
        details: paymentMethod.details,
        is_default: paymentMethod.isDefault || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        id: data.id,
        type: data.type,
        isDefault: data.is_default,
        details: data.details,
        createdAt: data.created_at
      }
    };
  } catch (error) {
    return handleApiError(error, 'savePaymentMethod');
  }
};

/**
 * Delete a payment method
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { paymentMethodId },
      ['paymentMethodId']
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

    // Check if payment method belongs to user
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('user_id, is_default')
      .eq('id', paymentMethodId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (paymentMethod.user_id !== userData.user.id) {
      return {
        success: false,
        error: 'You do not have permission to delete this payment method',
        status: 403
      };
    }

    // Delete payment method
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId);

    if (error) {
      throw error;
    }

    // If this was the default payment method, set another one as default
    if (paymentMethod.is_default) {
      const { data: methods, error: methodsError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (methodsError) {
        throw methodsError;
      }

      if (methods.length > 0) {
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', methods[0].id);

        if (updateError) {
          throw updateError;
        }
      }
    }

    return {
      success: true
    };
  } catch (error) {
    return handleApiError(error, 'deletePaymentMethod');
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
  processPayment,
  getSavedPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod
};
