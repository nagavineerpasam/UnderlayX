"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Users, MessageCircle } from "lucide-react";
import { useState } from "react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: () => void;
  subscriptionStatus: {
    isActive: boolean;
    daysRemaining: number;
    message: string;
  };
}

export function PaymentDialog({
  isOpen,
  onClose,
  onPayment,
  subscriptionStatus,
}: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      onPayment();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscriptionStatus.isActive
              ? `Your subscription expires in ${subscriptionStatus.daysRemaining} days`
              : "Get unlimited image generations"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pricing Card */}
          <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Full Access
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-bold text-purple-600">$3</span>
                <span className="text-xl text-gray-500 line-through">$7</span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Per month • Cancel anytime
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  Access to all features
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  Direct creator support
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  Unlimited image generations
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Subscribe Now - $3/month"
              )}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>1000+ users</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>24/7 support</span>
              </div>
            </div>
            <p>Secure payment • Cancel anytime</p>
          </div>

          {/* Creator contact */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="mb-2">Any questions? Write me here:</p>
            <a
              href="mailto:dailifyofficial@gmail.com"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
            >
              dailifyofficial@gmail.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
