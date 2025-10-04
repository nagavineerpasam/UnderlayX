"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getUserActiveSubscription, getSubscriptionStatus, getPaymentUrl as getSubscriptionPaymentUrl } from "@/lib/subscription";
import { UserPurchase, UserProfile } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export function useUserGenerations() {
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: false,
    daysRemaining: 0,
    message: "No subscription found"
  });

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!user) {
        setUserSubscription(null);
        setUserProfile(null);
        setSubscriptionStatus({
          isActive: false,
          daysRemaining: 0,
          message: "No subscription found"
        });
        setIsLoading(false);
        return;
      }

      try {
        // Get active subscription (now returns profile data directly)
        const subscription = await getUserActiveSubscription(user.id);
        setUserSubscription(subscription);
        setUserProfile(subscription); // Same data, so set both

        // Calculate subscription status
        const status = getSubscriptionStatus(subscription);
        setSubscriptionStatus(status);
      } catch (error) {
        console.error("Error fetching user subscription:", error);
        setUserSubscription(null);
        setUserProfile(null);
        setSubscriptionStatus({
          isActive: false,
          daysRemaining: 0,
          message: "Error loading subscription"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSubscription();

    // Set up real-time subscription to profile changes
    if (user) {
      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            // Update local state with new profile data
            const updatedProfile = payload.new as UserProfile;
            setUserProfile(updatedProfile);
            setUserSubscription(updatedProfile);
            
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

  const canGenerate = () => {
    return subscriptionStatus.isActive;
  };

  const getPaymentUrl = () => {
    if (!user) return "";
    return getSubscriptionPaymentUrl(user.id, user.email || "");
  };

  return {
    userSubscription,
    userProfile,
    subscriptionStatus,
    isLoading,
    canGenerate,
    getPaymentUrl,
    // Keep these for backward compatibility but they're not used in subscription model
    userGeneration: null,
    generationsLeft: subscriptionStatus.isActive ? 999 : 0,
  };
}
