import { supabase } from './supabaseClient';
import { UserPurchase, UserProfile } from '@/types';

// Constants
const SUBSCRIPTION_AMOUNT = 3; // $3 per month

export async function getUserActiveSubscription(userId: string): Promise<UserPurchase | null> {
  try {
    const { data, error } = await supabase
      .from('user_purchase')
      .select('*')
      .eq('user_id', userId)
      .eq('subscription_status', 'active')
      .order('purchase_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user active subscription:', error);
    return null;
  }
}

export async function createUserPurchase(
  userId: string,
  amountPaid: number,
  checkoutId: string,
  currentPeriodStart: string,
  currentPeriodEnd: string,
  subscriptionStatus: string,
  metadata?: any
): Promise<UserPurchase> {
  try {
    // Create new purchase record
    const { data, error } = await supabase
      .from('user_purchase')
      .insert({
        user_id: userId,
        amount_paid: amountPaid,
        purchase_date: new Date().toISOString(),
        checkout_id: checkoutId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        subscription_status: subscriptionStatus,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user profile with subscription period info
    const profileUpdated = await updateUserProfileSubscription(userId, currentPeriodStart, currentPeriodEnd, subscriptionStatus);
    
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
  subscriptionStatus: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        subscription_status: subscriptionStatus,
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile subscription:', error);
    return false;
  }
}

export async function cancelUserSubscription(
  userId: string,
  checkoutId: string,
  cancellationReason?: string,
  cancellationComment?: string
): Promise<void> {
  try {
    // Update the subscription status to cancelled
    const { error } = await supabase
      .from('user_purchase')
      .update({
        subscription_status: 'cancelled',
        metadata: {
          cancellation_reason: cancellationReason,
          cancellation_comment: cancellationComment,
          cancelled_at: new Date().toISOString(),
        }
      })
      .eq('user_id', userId)
      .eq('checkout_id', checkoutId);

    if (error) throw error;

    // Update user profile to remove subscription info
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        current_period_start: null,
        current_period_end: null,
        subscription_status: 'cancelled',
      })
      .eq('id', userId);

    if (profileError) throw profileError;
  } catch (error) {
    console.error('Error cancelling user subscription:', error);
    throw error; // Re-throw the error so webhook knows it failed
  }
}

export function isSubscriptionActive(subscription: UserPurchase | null): boolean {
  if (!subscription || !subscription.current_period_end) return false;
  
  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);
  
  // Allow access if status is 'active' OR if cancelled but period hasn't ended yet
  const isStatusValid = subscription.subscription_status === 'active' || 
                       (subscription.subscription_status === 'canceled' && now < periodEnd);
  
  return isStatusValid && now < periodEnd;
}

export function getSubscriptionStatus(userProfile: UserProfile | null): {
  isActive: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!userProfile || !userProfile.current_period_end) {
    return {
      isActive: false,
      daysRemaining: 0,
      message: "No active subscription found"
    };
  }

  const now = new Date();
  const periodEnd = new Date(userProfile.current_period_end);
  const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Check if period has ended
  if (now >= periodEnd) {
    return {
      isActive: false,
      daysRemaining: 0,
      message: "Your subscription has expired"
    };
  }

  // Check subscription status
  const validStatuses = ['active', 'trialing'];
  const isStatusValid = userProfile.subscription_status && validStatuses.includes(userProfile.subscription_status);
  
  if (!isStatusValid) {
    // If cancelled but period hasn't ended, show cancellation message
    if (userProfile.subscription_status === 'canceled') {
      return {
        isActive: true, // Still allow access until period ends
        daysRemaining: Math.max(0, daysRemaining),
        message: `Your subscription is cancelled but active until ${periodEnd.toLocaleDateString()}`
      };
    }
    
    return {
      isActive: false,
      daysRemaining: 0,
      message: "Your subscription is inactive"
    };
  }

  return {
    isActive: true,
    daysRemaining: Math.max(0, daysRemaining),
    message: "Subscription active"
  };
}

export function getPaymentUrl(userId: string, userEmail: string): string {
  console.log(userId, userEmail);
  const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID || "123";
  return `/checkout?products=${productId}&customerEmail=${userEmail}&customerExternalId=${userId}`;
}
