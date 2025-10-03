
// checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/confirmation?checkout_id={CHECKOUT_ID}`,
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});