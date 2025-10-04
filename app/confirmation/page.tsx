"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface PaymentStatus {
  checkoutId: string;
  status: "open" | "expired" | "confirmed" | "failed" | "succeeded";
  createdAt: string;
  modifiedAt: string;
  paymentProcessor: string;
  customFieldData: any;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkPaymentStatus = async (retry = false) => {
    if (!checkoutId) {
      setCheckError("No checkout ID found");
      setIsCheckingPayment(false);
      return;
    }

    try {
      setIsCheckingPayment(true);
      setCheckError(null);

      const response = await fetch(
        `/api/check-payment?checkoutId=${checkoutId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check payment status");
      }

      setPaymentStatus(data);

      // If payment succeeded, stop checking
      if (data.status === "succeeded") {
        setIsCheckingPayment(false);
        // Start confirmation animation
        setTimeout(() => setIsAnimating(false), 1000);
        // Redirect after showing confirmation
        setTimeout(() => router.push("/custom-editor"), 3000);
      } else if (data.status === "failed") {
        setIsCheckingPayment(false);
        setCheckError("Payment failed. Please try again.");
      } else if (data.status === "open" || data.status === "confirmed") {
        // Payment is still processing, retry after delay
        if (retryCount < 10) {
          // Max 10 retries
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            checkPaymentStatus(true);
          }, 2000);
        } else {
          setCheckError(
            "Payment is taking longer than expected. Please refresh the page."
          );
          setIsCheckingPayment(false);
        }
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      setCheckError(
        error instanceof Error
          ? error.message
          : "Failed to check payment status"
      );
      setIsCheckingPayment(false);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [checkoutId]);

  const handleRetry = () => {
    setRetryCount(0);
    checkPaymentStatus();
  };

  const handleContinue = () => {
    router.push("/custom-editor");
  };

  // Show loading state while checking payment
  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Confirming Payment
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Please wait while we confirm your subscription...
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Checking... (Attempt {retryCount}/10)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (checkError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Payment Confirmation Issue
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {checkError}
            </p>
            {checkoutId && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Checkout ID: {checkoutId}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show confirmation success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Confirmation Success Animation */}
        <div className="relative mb-8">
          <div
            className={`w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-all duration-1000 ${
              isAnimating ? "scale-110" : "scale-100"
            }`}
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          {/* Sparkle effects */}
          {isAnimating && (
            <>
              <div className="absolute -top-2 -right-2 animate-ping">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-ping delay-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="absolute top-1/2 -right-4 animate-ping delay-700">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </>
          )}
        </div>

        {/* Confirmation Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Payment Confirmed!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your subscription is now active. Welcome to Pro!
          </p>
          {checkoutId && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Checkout ID: {checkoutId}
            </p>
          )}
        </div>

        {/* Features Preview */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What's included:
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Unlimited image generations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Access to all features</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Direct creator support</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleContinue}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Start Creating
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
          Redirecting automatically in a few seconds...
        </p>
      </div>
    </div>
  );
}
