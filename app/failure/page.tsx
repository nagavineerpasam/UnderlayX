"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    // Go back to the editor to try payment again
    router.push("/custom-editor");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Animation */}
        <div className="relative mb-8">
          <div
            className={`w-24 h-24 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-all duration-1000 ${
              isAnimating ? "scale-110" : "scale-100"
            }`}
          >
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Something went wrong with your payment.
          </p>
          {error && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Error: {error}
            </p>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What can you do?
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <span>Check your payment method and try again</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <span>Ensure you have sufficient funds</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <span>Contact support if the issue persists</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}
