"use client";

import { User } from "@supabase/supabase-js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AvatarFallback } from "./AvatarFallback";
import { getSubscriptionStatus } from "@/lib/subscription";
import { XCircle } from "lucide-react";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

interface UserMenuProps {
  user: User;
  onProfileUpdate?: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  avatar_url: string;
  current_period_start: string | null;
  current_period_end: string | null;
  subscription_status: string | null;
  polar_customer_id: string | null;
  subscription_id: string | null;
}

export function UserMenu({ user, onProfileUpdate }: UserMenuProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: false,
    daysRemaining: 0,
    message: "No subscription found",
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Fetch user profile and subscription status
  const fetchUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        const status = getSubscriptionStatus(profile);
        setSubscriptionStatus(status);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // Set up real-time subscription to profile changes
    if (user) {
      const channel = supabase
        .channel("usermenu-profile-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            // Update local state with new profile data
            const updatedProfile = payload.new as UserProfile;
            setUserProfile(updatedProfile);

            // Recalculate subscription status
            const status = getSubscriptionStatus(updatedProfile);
            setSubscriptionStatus(status);
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleCancelSuccess = () => {
    fetchUserProfile();
    onProfileUpdate?.();
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <Popover>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <div className="relative">
                  {subscriptionStatus.isActive && (
                    <div className="absolute -top-2 -translate-y-0.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none whitespace-nowrap z-30 shadow-lg">
                      Pro
                    </div>
                  )}
                  <div
                    className={`w-8 h-8 relative rounded-full overflow-hidden cursor-pointer ${
                      subscriptionStatus.isActive
                        ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/30"
                        : "border-2 border-white/10"
                    }`}
                  >
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement
                            ?.querySelector(".avatar-fallback")
                            ?.classList.remove("hidden");
                        }}
                      />
                    ) : (
                      <AvatarFallback email={user.email || ""} />
                    )}
                    <div className="avatar-fallback hidden absolute inset-0">
                      <AvatarFallback email={user.email || ""} />
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p className="text-sm">{user.email}</p>
            </TooltipContent>

            <PopoverContent className="w-60 py-2" side="bottom" align="end">
              <div className="px-4 py-2 text-sm border-b border-gray-200 dark:border-white/10">
                <div className="text-gray-700 dark:text-gray-300 truncate">
                  {user.email}
                </div>
                {userProfile && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {subscriptionStatus.isActive ? (
                      <>
                        <div className="text-purple-600 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Pro Subscriber
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {subscriptionStatus.message}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          Free Plan
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {subscriptionStatus.message}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cancel Subscription Option */}
              {subscriptionStatus.isActive && (
                <div className="px-2 py-1">
                  {userProfile?.subscription_id ? (
                    <button
                      onClick={() => setShowCancelDialog(true)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors focus:outline-none focus:ring-0"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel Subscription
                    </button>
                  ) : (
                    <div className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400">
                      Subscription ID missing - Contact support
                    </div>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </Tooltip>
      </TooltipProvider>

      <CancelSubscriptionDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onCancel={handleCancelSuccess}
        subscriptionId={userProfile?.subscription_id || null}
        userId={user.id}
      />
    </>
  );
}
