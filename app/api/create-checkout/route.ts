import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: process.env.POLAR_SERVER as "sandbox" | "production",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing userId or userEmail" },
        { status: 400 }
      );
    }

    const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID not configured" },
        { status: 500 }
      );
    }

    // Create checkout session using Polar SDK
    const result = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: userId,
      customerEmail: userEmail,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/confirmation?checkout_id={CHECKOUT_ID}`,
    });

    console.log("Checkout created:", result);

    // Return the checkout URL
    // add these to url: x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=YOUR_TOKEN
    return NextResponse.json({
      checkoutUrl: `${result.url}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`,
      checkoutId: result.id,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    
    // Handle specific Polar API errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
