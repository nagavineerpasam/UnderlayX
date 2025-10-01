
// checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: "http://localhost:3000/confirmation?checkoutId={CHECKOUT_ID}",
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});