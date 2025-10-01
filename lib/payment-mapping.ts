// Temporary storage for checkout_id to user_id mapping
// This will be used by the webhook to find the user_id
const paymentMappings = new Map<string, string>();

export function setPaymentMapping(checkoutId: string, userId: string) {
  paymentMappings.set(checkoutId, userId);
  
  // Clean up after 1 hour to prevent memory leaks
  setTimeout(() => {
    paymentMappings.delete(checkoutId);
  }, 60 * 60 * 1000);
}

export function getPaymentMapping(checkoutId: string): string | undefined {
  return paymentMappings.get(checkoutId);
}

export function deletePaymentMapping(checkoutId: string) {
  paymentMappings.delete(checkoutId);
}
