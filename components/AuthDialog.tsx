"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast, useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function AuthDialog({ isOpen, onClose, returnUrl }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const redirectUrl = returnUrl
        ? `${window.location.origin}${returnUrl}`
        : `${window.location.origin}/custom-editor`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: redirectUrl,
        },
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error signing in" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md pt-8 w-[95%] text-center">
        <DialogHeader className="flex flex-col items-center justify-center space-y-2">
          <DialogTitle asChild>
            <h2 className="text-2xl font-bold text-center">
              Sign in to continue creations
            </h2>
          </DialogTitle>
          <p className="text-sm text-muted-foreground opacity-70 text-center">
            Access all premium AI features
          </p>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-2 mt-6">
          <form action={handleSignIn} className="flex-1">
            <Button
              type="submit"
              className="w-full rounded-full font-semibold flex items-center justify-center gap-2 text-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
