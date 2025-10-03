import { supabase } from './supabaseClient';
import { UserPurchase, UserProfile } from '@/types';
export async function getUserActiveSubscription(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('subscription_status', 'active')
      .maybeSingle();
    
    if (error) {
      return null;
    }
    
    return data;
  } catch (error) {
    return null;
  }
}

export async function createUserPurchase(
  userId: string,
  amountPaid: number,
  currentPeriodStart: string,
  currentPeriodEnd: string,
  subscriptionStatus: string,
  polarCustomerId: string,
  subscriptionId: string,
  metadata?: any
): Promise<UserPurchase> {
  try {
    // Create admin client for server-side operations
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create new purchase record using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('user_purchase')
      .insert({
        user_id: userId,
        amount_paid: amountPaid,
        purchase_date: new Date().toISOString(),
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        subscription_status: subscriptionStatus,
        polar_customer_id: polarCustomerId,
        subscription_id: subscriptionId,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user profile with subscription period info
    const profileUpdated = await updateUserProfileSubscription(userId, currentPeriodStart, currentPeriodEnd, subscriptionStatus, polarCustomerId, subscriptionId);
    
    if (!profileUpdated) {
      throw new Error('Failed to update user profile with subscription info');
    }

    return data;
  } catch (error) {
    console.error('Error creating user purchase:', error);
    throw error; // Re-throw the error so webhook knows it failed
  }
}

export async function updateUserProfileSubscription(
  userId: string,
  currentPeriodStart: string,
  currentPeriodEnd: string,
  subscriptionStatus: string,
  polarCustomerId: string,
  subscriptionId: string
): Promise<boolean> {
  try {
    // Create admin client for server-side operations
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        subscription_status: subscriptionStatus,
        polar_customer_id: polarCustomerId,
        subscription_id: subscriptionId,
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}

export async function cancelUserSubscription(
  userId: string,
  amountPaid: number,
  currentPeriodStart: string | null,
  currentPeriodEnd: string | null,
  subscriptionStatus: string,
  polarCustomerId: string,
  subscriptionId: string,
  metadata?: any
): Promise<UserPurchase> {
  try {
    // Create admin client for server-side operations
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create a new entry in user_purchase table to record the cancellation action
    const { data: userPurchase, error } = await supabaseAdmin
      .from('user_purchase')
      .insert({
        user_id: userId,
        amount_paid: amountPaid,
        purchase_date: new Date().toISOString(),
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        subscription_status: subscriptionStatus,
        polar_customer_id: polarCustomerId,
        subscription_id: subscriptionId,
        metadata: metadata // Store the complete Polar payload
      })
      .select()
      .single();

    if (error) throw error;

    // Update user profile to reflect cancellation
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        current_period_start: null,
        current_period_end: null,
        subscription_status: subscriptionStatus,
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    return userPurchase;
  } catch (error) {
    throw error; // Re-throw the error so webhook knows it failed
  }
}

export function isSubscriptionActive(subscription: UserProfile | null): boolean {
  if (!subscription) return false;
  
  // Simple check: only "active" status means subscribed
  return subscription.subscription_status === 'active';
}

export function getSubscriptionStatus(userProfile: UserProfile | null): {
  isActive: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!userProfile) {
    return {
      isActive: false,
      daysRemaining: 0,
      message: "No subscription found"
    };
  }

  // Simple check: only "active" status means subscribed
  if (userProfile.subscription_status === 'active') {
    return {
      isActive: true,
      daysRemaining: 0, // No longer tracking days
      message: "Subscription active"
    };
  }

  // All other statuses mean not subscribed
  return {
    isActive: false,
    daysRemaining: 0,
    message: "Subscription inactive"
  };
}

export function getPaymentUrl(userId: string, userEmail: string): string {
  const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID || "123";
  return `/checkout?products=${productId}&customerEmail=${userEmail}&customerExternalId=${userId}`;
}
