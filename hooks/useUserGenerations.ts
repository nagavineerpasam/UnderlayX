"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getUserActiveSubscription, getSubscriptionStatus, getPaymentUrl as getSubscriptionPaymentUrl } from "@/lib/subscription";
import { UserPurchase, UserProfile } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export function useUserGenerations() {
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState<UserPurchase | null>(null);
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
        // Get user profile with subscription info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          setUserProfile(profile);
        }

        // Get active subscription
        const subscription = await getUserActiveSubscription(user.id);
        setUserSubscription(subscription);

        // Calculate subscription status
        const status = getSubscriptionStatus(profile);
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
  }, [user]);

  const canGenerate = () => {
    return subscriptionStatus.isActive;
  };

  const incrementGeneration = async () => {
    // For subscription model, we don't need to track individual generations
    // Just check if subscription is active
    return canGenerate();
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
    incrementGeneration,
    getPaymentUrl,
    // Keep these for backward compatibility but they're not used in subscription model
    userGeneration: null,
    generationsLeft: subscriptionStatus.isActive ? 999 : 0,
  };
}
