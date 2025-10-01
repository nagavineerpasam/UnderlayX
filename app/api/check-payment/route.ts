import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get("checkoutId");

    if (!checkoutId) {
      return NextResponse.json(
        { error: "Missing checkoutId parameter" },
        { status: 400 }
      );
    }

    // Get checkout details from Polar
    const result = await polar.checkouts.get({
      id: checkoutId,
    });

    console.log(`Payment check for checkout ${checkoutId}:`, {
      status: result.status,
      id: result.id,
      createdAt: result.createdAt,
    });

    // Return the checkout status and details
    return NextResponse.json({
      checkoutId: result.id,
      status: result.status,
      createdAt: result.createdAt,
      modifiedAt: result.modifiedAt,
      paymentProcessor: result.paymentProcessor,
      customFieldData: result.customFieldData,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    
    // Handle specific Polar API errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Checkout not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
