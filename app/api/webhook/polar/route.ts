import { Webhooks } from "@polar-sh/nextjs";
import { createUserPurchase, cancelUserSubscription } from "@/lib/subscription";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionActive: async (payload) => {
    console.log("Subscription active:", payload);
    try {
      // Access the subscription data from the payload
      const subscription = payload.data;
      const subscriptionId = subscription.id; // Extract subscription ID for future cancellation
      const checkoutId = subscription.checkoutId;
      const amount = subscription.amount;
      const customerId = subscription.customerId;
      const productId = subscription.productId;
      const status = subscription.status;
      const currentPeriodStart = subscription.currentPeriodStart;
      const currentPeriodEnd = subscription.currentPeriodEnd;
      const subscriptionStatus = subscription.status;
      
      // Get user ID from customer.externalId (passed via externalCustomerId in checkout)
      const userId = subscription.customer?.externalId;
    
      
      if (!checkoutId) {
        console.error("No checkout_id in subscription payload:", payload);
        return;
      }
      
      if (!userId) {
        console.error("No user_id found in customer.external_id for checkout:", checkoutId);
        return;
      }
      
      if (!currentPeriodStart || !currentPeriodEnd) {
        console.error("Missing subscription period data:", { currentPeriodStart, currentPeriodEnd });
        return;
      }
      
      const subscriptionAmount = amount / 100;
      
      // Create user purchase record with subscription data
      const userPurchase = await createUserPurchase(
        userId,
        subscriptionAmount,
        new Date(currentPeriodStart).toISOString().split('T')[0],
        new Date(currentPeriodEnd).toISOString().split('T')[0],
        subscriptionStatus,
        customerId, 
        subscriptionId,
        payload
      );
      
    } catch (error) {
      console.error("Subscription activation error:", error);
      throw error; // This will make Polar retry the webhook
    }
  },
  onSubscriptionRevoked: async (payload) => {
    try {
      // Access the subscription data from the payload
      const subscription = payload.data;
      const checkoutId = subscription.checkoutId;
      const userId = subscription.customer?.externalId;
      
      if (!userId || !checkoutId) {
        console.error("Missing user_id or checkout_id for cancellation:", { userId, checkoutId });
        return;
      }
      
      // Extract subscription data from payload
      const subscriptionData = payload.data;
      const subscriptionId = subscriptionData.id;
      const polarCustomerId = subscriptionData.customerId;
      const subscriptionStatus = subscriptionData.status;
      const currentPeriodStart = subscriptionData.currentPeriodStart;
      const currentPeriodEnd = subscriptionData.currentPeriodEnd;
      
      // Convert amount from cents to dollars (Polar sends amount in cents)
      const subscriptionAmount = subscriptionData.amount ? subscriptionData.amount / 100 : 0;
      
      // Cancel the user subscription
      await cancelUserSubscription(
        userId,
        subscriptionAmount,
        currentPeriodStart ? new Date(currentPeriodStart).toISOString().split('T')[0] : null,
        currentPeriodEnd ? new Date(currentPeriodEnd).toISOString().split('T')[0] : null,
        subscriptionStatus,
        polarCustomerId,
        subscriptionId,
        payload // Pass the complete payload as metadata
      );
      
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      throw error;
    }
  },
});

