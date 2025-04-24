/**
 * Order Service
 * Handles all order-related API calls to Supabase
 */

import { supabase } from '../utils/supabaseClient';
import { clearCart } from './cartService';

/**
 * Create a new order
 * @param {Object} order - Order data
 * @returns {Promise<Object>} - Created order
 */
export const createOrder = async (order) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
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
        billing_address_id: order.billingAddressId,
        payment_method: order.paymentMethod,
        payment_status: 'pending',
        shipping_method: order.shippingMethod,
        notes: order.notes,
        gift_message: order.giftMessage,
        is_gift: order.isGift || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // Add order items
    if (order.items && order.items.length > 0) {
      const itemPromises = order.items.map(item => {
        return supabase
          .from('order_items')
          .insert({
            order_id: data.id,
            product_id: item.productId,
            product_variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          });
      });

      await Promise.all(itemPromises);
    }

    // Clear the cart after successful order creation
    await clearCart();

    // Return the created order
    return {
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
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

/**
 * Get user's orders
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of orders to return
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - Orders and total count
 */
export const getUserOrders = async (options = {}) => {
  try {
    const { limit = 10, offset = 0 } = options;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      return { orders: [], total: 0 };
    }

    // Get the user's orders
    const { data, error, count } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (*),
          variant:product_variants (*)
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching user orders:', error);
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
          image: item.product.product_images?.[0]?.image_url || ''
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
      orders: formattedOrders,
      total: count
    };
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    throw error;
  }
};

/**
 * Get an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Order details
 */
export const getOrderById = async (orderId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to view order details');
    }

    // Get the order
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (*),
          variant:product_variants (*)
        ),
        shipping_address:addresses!shipping_address_id (*),
        billing_address:addresses!billing_address_id (*)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return {
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
          image: item.product.product_images?.[0]?.image_url || ''
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
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Cancelled order
 */
export const cancelOrder = async (orderId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to cancel an order');
    }

    // Check if the order belongs to the user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('user_id, status')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching order for cancellation:', fetchError);
      throw fetchError;
    }

    if (order.user_id !== user.id) {
      throw new Error('You do not have permission to cancel this order');
    }

    // Check if the order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Cancel the order
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }

    // Return the cancelled order
    return {
      id: data.id,
      orderNumber: data.order_number,
      status: data.status,
      cancelledAt: data.cancelled_at
    };
  } catch (error) {
    console.error('Error in cancelOrder:', error);
    throw error;
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

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
};
