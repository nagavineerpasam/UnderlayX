export interface UserProfile {
  id: string;
  email: string;
  avatar_url: string;
  current_period_start: string | null;
  current_period_end: string | null;
  subscription_status: string | null;
  polar_customer_id: string | null;
  subscription_id: string | null;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  amount_paid: number;
  purchase_date: string;
  current_period_start: string | null;
  current_period_end: string | null;
  subscription_status: string | null;
  polar_customer_id: string | null;
  subscription_id: string | null;
  metadata: any | null;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  amount_paid: number;
  payment_type: 'PAYPAL' | 'PAYU';
  purchase_date: string;
  currency: string;
}

// Keep UserGeneration for backward compatibility, but mark as deprecated
export interface UserGeneration {
  id: string;
  user_id: string;
  generations: number;
  amount_paid: number;
  purchase_date: string;
  active: boolean;
  checkout_id: string | null;
}
