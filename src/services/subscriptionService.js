/**
 * Subscription Service
 * Handles all subscription-related API calls to Supabase
 */

import { supabase } from '../utils/supabaseClient';

/**
 * Get all subscription plans
 * @returns {Promise<Array>} - List of subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('discount_percentage', { ascending: false });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    const formattedPlans = data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      frequency: plan.frequency,
      discountPercentage: plan.discount_percentage
    }));

    return formattedPlans;
  } catch (error) {
    console.error('Error in getSubscriptionPlans:', error);
    throw error;
  }
};

/**
 * Get a subscription plan by ID
 * @param {string} planId - Plan ID
 * @returns {Promise<Object>} - Subscription plan details
 */
export const getSubscriptionPlanById = async (planId) => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      frequency: data.frequency,
      discountPercentage: data.discount_percentage
    };
  } catch (error) {
    console.error('Error in getSubscriptionPlanById:', error);
    throw error;
  }
};

/**
 * Create a new subscription
 * @param {Object} subscription - Subscription data
 * @returns {Promise<Object>} - Created subscription
 */
export const createSubscription = async (subscription) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to create a subscription');
    }

    // Calculate next billing date based on frequency
    const nextBillingDate = calculateNextBillingDate(subscription.planId);

    // Create the subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        subscription_plan_id: subscription.planId,
        status: 'active',
        next_billing_date: nextBillingDate,
        shipping_address_id: subscription.shippingAddressId,
        payment_method_id: subscription.paymentMethodId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }

    // Add subscription items
    if (subscription.items && subscription.items.length > 0) {
      const itemPromises = subscription.items.map(item => {
        return supabase
          .from('subscription_items')
          .insert({
            subscription_id: data.id,
            product_id: item.productId,
            product_variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price
          });
      });

      await Promise.all(itemPromises);
    }

    // Return the created subscription
    return {
      id: data.id,
      planId: data.subscription_plan_id,
      status: data.status,
      nextBillingDate: data.next_billing_date,
      shippingAddressId: data.shipping_address_id,
      paymentMethodId: data.payment_method_id,
      items: subscription.items || []
    };
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw error;
  }
};

/**
 * Get user's subscriptions
 * @returns {Promise<Array>} - List of user's subscriptions
 */
export const getUserSubscriptions = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      return [];
    }

    // Get the user's subscriptions
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans (*),
        items:subscription_items (
          *,
          product:products (*),
          variant:product_variants (*)
        ),
        shipping_address:addresses (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return data.map(subscription => ({
      id: subscription.id,
      planId: subscription.subscription_plan_id,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        frequency: subscription.plan.frequency,
        discountPercentage: subscription.plan.discount_percentage
      },
      status: subscription.status,
      nextBillingDate: subscription.next_billing_date,
      lastBillingDate: subscription.last_billing_date,
      shippingAddressId: subscription.shipping_address_id,
      shippingAddress: subscription.shipping_address ? {
        id: subscription.shipping_address.id,
        firstName: subscription.shipping_address.first_name,
        lastName: subscription.shipping_address.last_name,
        addressLine1: subscription.shipping_address.address_line1,
        addressLine2: subscription.shipping_address.address_line2,
        city: subscription.shipping_address.city,
        state: subscription.shipping_address.state,
        postalCode: subscription.shipping_address.postal_code,
        country: subscription.shipping_address.country,
        phone: subscription.shipping_address.phone
      } : null,
      paymentMethodId: subscription.payment_method_id,
      items: subscription.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.product_images?.[0]?.image_url || '',
          price: item.product.price
        },
        variantId: item.product_variant_id,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          weight: item.variant.weight,
          price: item.variant.price
        } : null,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: subscription.created_at
    }));
  } catch (error) {
    console.error('Error in getUserSubscriptions:', error);
    throw error;
  }
};

/**
 * Get a subscription by ID
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} - Subscription details
 */
export const getSubscriptionById = async (subscriptionId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to view subscription details');
    }

    // Get the subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans (*),
        items:subscription_items (
          *,
          product:products (*),
          variant:product_variants (*)
        ),
        shipping_address:addresses (*)
      `)
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return {
      id: data.id,
      planId: data.subscription_plan_id,
      plan: {
        id: data.plan.id,
        name: data.plan.name,
        frequency: data.plan.frequency,
        discountPercentage: data.plan.discount_percentage
      },
      status: data.status,
      nextBillingDate: data.next_billing_date,
      lastBillingDate: data.last_billing_date,
      shippingAddressId: data.shipping_address_id,
      shippingAddress: data.shipping_address ? {
        id: data.shipping_address.id,
        firstName: data.shipping_address.first_name,
        lastName: data.shipping_address.last_name,
        addressLine1: data.shipping_address.address_line1,
        addressLine2: data.shipping_address.address_line2,
        city: data.shipping_address.city,
        state: data.shipping_address.state,
        postalCode: data.shipping_address.postal_code,
        country: data.shipping_address.country,
        phone: data.shipping_address.phone
      } : null,
      paymentMethodId: data.payment_method_id,
      items: data.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.product_images?.[0]?.image_url || '',
          price: item.product.price
        },
        variantId: item.product_variant_id,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          weight: item.variant.weight,
          price: item.variant.price
        } : null,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in getSubscriptionById:', error);
    throw error;
  }
};

/**
 * Update a subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated subscription
 */
export const updateSubscription = async (subscriptionId, updates) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to update a subscription');
    }

    // Check if the subscription belongs to the user
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('id', subscriptionId)
      .single();

    if (fetchError) {
      console.error('Error fetching subscription for update:', fetchError);
      throw fetchError;
    }

    if (subscription.user_id !== user.id) {
      throw new Error('You do not have permission to update this subscription');
    }

    // Prepare update data
    const updateData = {};
    
    if (updates.planId) {
      updateData.subscription_plan_id = updates.planId;
      // Recalculate next billing date if plan changes
      updateData.next_billing_date = calculateNextBillingDate(updates.planId);
    }
    
    if (updates.status) {
      updateData.status = updates.status;
      
      // Set paused_at or cancelled_at if status changes
      if (updates.status === 'paused') {
        updateData.paused_at = new Date().toISOString();
      } else if (updates.status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
    }
    
    if (updates.shippingAddressId) {
      updateData.shipping_address_id = updates.shippingAddressId;
    }
    
    if (updates.paymentMethodId) {
      updateData.payment_method_id = updates.paymentMethodId;
    }

    // Update the subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    // Update subscription items if provided
    if (updates.items) {
      // First, delete all existing items
      await supabase
        .from('subscription_items')
        .delete()
        .eq('subscription_id', subscriptionId);

      // Then, add the new items
      const itemPromises = updates.items.map(item => {
        return supabase
          .from('subscription_items')
          .insert({
            subscription_id: subscriptionId,
            product_id: item.productId,
            product_variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price
          });
      });

      await Promise.all(itemPromises);
    }

    // Return the updated subscription
    return {
      id: data.id,
      planId: data.subscription_plan_id,
      status: data.status,
      nextBillingDate: data.next_billing_date,
      lastBillingDate: data.last_billing_date,
      shippingAddressId: data.shipping_address_id,
      paymentMethodId: data.payment_method_id,
      items: updates.items || []
    };
  } catch (error) {
    console.error('Error in updateSubscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} - Cancelled subscription
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    return await updateSubscription(subscriptionId, { status: 'cancelled' });
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw error;
  }
};

/**
 * Pause a subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} - Paused subscription
 */
export const pauseSubscription = async (subscriptionId) => {
  try {
    return await updateSubscription(subscriptionId, { status: 'paused' });
  } catch (error) {
    console.error('Error in pauseSubscription:', error);
    throw error;
  }
};

/**
 * Resume a subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} - Resumed subscription
 */
export const resumeSubscription = async (subscriptionId) => {
  try {
    return await updateSubscription(subscriptionId, { status: 'active' });
  } catch (error) {
    console.error('Error in resumeSubscription:', error);
    throw error;
  }
};

/**
 * Calculate the next billing date based on subscription plan frequency
 * @param {string} planId - Subscription plan ID
 * @returns {string} - Next billing date in ISO format
 */
const calculateNextBillingDate = async (planId) => {
  try {
    // Get the plan frequency
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('frequency')
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan frequency:', error);
      throw error;
    }

    const frequency = data.frequency;
    const now = new Date();
    let nextBillingDate = new Date();

    // Calculate next billing date based on frequency
    switch (frequency) {
      case 'weekly':
        nextBillingDate.setDate(now.getDate() + 7);
        break;
      case 'biweekly':
        nextBillingDate.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        nextBillingDate.setMonth(now.getMonth() + 1);
        break;
      case 'bimonthly':
        nextBillingDate.setMonth(now.getMonth() + 2);
        break;
      case 'quarterly':
        nextBillingDate.setMonth(now.getMonth() + 3);
        break;
      default:
        nextBillingDate.setMonth(now.getMonth() + 1);
    }

    return nextBillingDate.toISOString();
  } catch (error) {
    console.error('Error in calculateNextBillingDate:', error);
    // Default to 1 month from now if there's an error
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    return nextBillingDate.toISOString();
  }
};

export default {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
};
