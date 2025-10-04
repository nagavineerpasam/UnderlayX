"use client";

import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  subscriptionId: string | null;
  userId: string;
}

export function CancelSubscriptionDialog({
  isOpen,
  onClose,
  onCancel,
  subscriptionId,
  userId,
}: CancelSubscriptionDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const isCancellingRef = useRef(false);
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    if (!subscriptionId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No subscription found to cancel",
      });
      return;
    }

    try {
      isCancellingRef.current = true;
      setIsCancelling(true);

      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });

      onCancel();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
      });
    } finally {
      isCancellingRef.current = false;
      setIsCancelling(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if we're not in the middle of cancelling
    if (!open && !isCancellingRef.current) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className={isCancelling ? "pointer-events-none" : ""}>
        {isCancelling && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span className="text-sm font-medium">
                Cancelling subscription...
              </span>
            </div>
          </div>
        )}
        <AlertDialogHeader className="relative">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="absolute right-0 top-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
          <AlertDialogTitle className="flex items-center gap-2 pr-8">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Cancel Subscription
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure? You won't be able to generate images after canceling
            your subscription.
            <br />
            <br />
            This action cannot be undone. You will lose access to all premium
            features immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isCancelling}
            onClick={isCancelling ? (e) => e.preventDefault() : undefined}
          >
            Keep Subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!isCancellingRef.current) {
                handleCancelSubscription();
              }
            }}
            disabled={isCancelling}
            className={`bg-red-600 hover:bg-red-700 focus:ring-red-600 ${
              isCancelling ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling Subscription...
              </>
            ) : (
              "Yes, Cancel Subscription"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
