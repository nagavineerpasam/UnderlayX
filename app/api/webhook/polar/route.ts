import { Webhooks } from "@polar-sh/nextjs";
import { createUserPurchase, cancelUserSubscription } from "@/lib/subscription";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionActive: async (payload) => {
    console.log("Subscription activated:", payload);
    
    try {
      // Access the subscription data from the payload
      const subscription = payload.data;
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
      
      console.log(`Subscription details:`, {
        checkoutId,
        amount,
        customerId,
        productId,
        status,
        userId,
        currentPeriodStart,
        currentPeriodEnd
      });
      
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
      
      const subscriptionAmount = 3.00;
      
      // Create user purchase record with subscription data
      const userPurchase = await createUserPurchase(
        userId,
        subscriptionAmount,
        String(checkoutId),
        new Date(currentPeriodStart).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        new Date(currentPeriodEnd).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        subscriptionStatus,
        {
          polar_customer_id: customerId,
          polar_product_id: productId,
          original_amount: amount / 100, // Store original amount for reference
          webhook_received_at: new Date().toISOString()
        }
      );
      
      console.log(`✅ User subscription created: User ${userId}, Checkout ${checkoutId}, Amount $${subscriptionAmount}, Period: ${currentPeriodStart} to ${currentPeriodEnd}, Purchase ID: ${userPurchase.id}`);
    } catch (error) {
      console.error("Subscription activation error:", error);
      throw error; // This will make Polar retry the webhook
    }
  },
  onSubscriptionCanceled: async (payload) => {
    console.log("Subscription canceled:", payload);
    
    try {
      // Access the subscription data from the payload
      const subscription = payload.data;
      const checkoutId = subscription.checkoutId;
      const userId = subscription.customer?.externalId;
      const customerId = subscription.customerId;
      const cancellationReason = subscription.customerCancellationReason;
      const cancellationComment = subscription.customerCancellationComment;
      
      console.log(`❌ Subscription canceled:`, {
        userId,
        checkoutId,
        customerId,
        cancellationReason,
        cancellationComment
      });
      
      if (!userId || !checkoutId) {
        console.error("Missing user_id or checkout_id for cancellation:", { userId, checkoutId });
        return;
      }
      
      // Cancel the user subscription
      await cancelUserSubscription(
        userId,
        String(checkoutId),
        cancellationReason || undefined,
        cancellationComment || undefined
      );
      
      console.log(`✅ User subscription cancelled: User ${userId}, Checkout ${checkoutId}`);
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      throw error; // This will make Polar retry the webhook
    }
  },
});

