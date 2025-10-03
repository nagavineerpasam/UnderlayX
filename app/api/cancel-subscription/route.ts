import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { supabase } from "@/lib/supabaseClient";

// Initialize Polar client for server-side operations
const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_SERVER as "sandbox" | "production",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, userId } = body;

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Missing subscriptionId or userId" },
        { status: 400 }
      );
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userProfile || !userProfile.subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Call Polar API to cancel the subscription
    // The webhook will handle the database updates when Polar sends the cancellation event
    await polar.subscriptions.revoke({
        id: subscriptionId,
    });
  

    return NextResponse.json({
      success: true,
      message: "Subscription cancellation initiated.",
    });

  } catch (error) {
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to cancel subscription" 
      },
      { status: 500 }
    );
  }
}
