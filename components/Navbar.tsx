"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Type,
  Shapes,
  ImageDown,
  LogIn,
  Loader2,
  Menu,
  LucideIcon,
  Github,
  Images,
  Pencil,
} from "lucide-react"; // Add Github, Images, and Pencil import
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { AuthDialog } from "./AuthDialog";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionStatus } from "@/lib/subscription";
import { AvatarFallback } from "./AvatarFallback";
import { KofiButton } from "./KofiButton"; // Add KofiButton import
import { ThemeToggle } from "@/components/ThemeToggle"; // Add ThemeToggle import

// Remove getUserGenerationInfo import

interface NavigationItem {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface UserProfile {
  id: string;
  email: string;
  avatar_url: string;
  current_period_start: string | null;
  current_period_end: string | null;
  subscription_status: string | null;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: false,
    daysRemaining: 0,
    message: "No subscription found",
  });
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch user profile with subscription info
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
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setUser(session?.user ?? null);

          if (session?.user) {
            // Fetch user profile with subscription info
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUserProfile(profile);
              const status = getSubscriptionStatus(profile);
              setSubscriptionStatus(status);
            }
          } else {
            setUserProfile(null);
            setSubscriptionStatus({
              isActive: false,
              daysRemaining: 0,
              message: "No subscription found",
            });
          }
        });
        return () => subscription.unsubscribe();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems: NavigationItem[] = [
    {
      href: "/overlay-image", // Add new route
      icon: Images,
      title: "Smart Image Overlay",
      description: "Blend and overlay images with AI",
    },
    {
      href: "/clone-image",
      icon: ImageDown,
      title: "Clone Image",
      description: "Effortlessly clone and position objects in your image",
    },
    {
      href: "/remove-background",
      icon: ImageDown,
      title: "Remove Image Background",
      description: "Remove the background from your image",
    },
    {
      href: "/change-background",
      icon: ImageDown,
      title: "Change Image Background",
      description: "Easily change the background of your image",
    },
    {
      href: "/draw-behind-image", // Add new route
      icon: Pencil,
      title: "Draw Behind Image",
      description: "Draw behind your images",
    },
    {
      href: "/text-behind-image",
      icon: Type,
      title: "Text Behind Image",
      description: "Add text behind your images",
    },
    {
      href: "/shape-behind-image",
      icon: Shapes,
      title: "Shapes Behind Image",
      description: "Add shapes behind your images",
    },
  ];

  const renderNavigationItems = (isMobile = false) =>
    navigationItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors",
          isMobile && "border-b border-white/10"
        )}
        onClick={(e) => {
          if (item.onClick) {
            item.onClick(e);
          } else {
            setIsOpen(false);
            setIsMobileMenuOpen(false);
          }
        }}
        role="menuitem"
      >
        <item.icon className="w-5 h-5" aria-hidden="true" />
        <div className="flex flex-col text-left">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs text-gray-300">{item.description}</span>
        </div>
      </Link>
    ));

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#1a0b2e] border-b border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            UnderlayX AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Features dropdown first */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-white/80 dark:hover:text-white transition-colors"
                onBlur={(e) => {
                  if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(e.relatedTarget)
                  ) {
                    setIsOpen(false);
                  }
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Open features menu"
              >
                <span>Features</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#1a0b2e] border border-gray-200 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="features-menu"
                >
                  {/* Update the navigation items styles */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex w-full items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors border-b border-gray-100 dark:border-white/10 last:border-0"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Github link second */}
            <a
              href="https://github.com/nagavineerpasam/UnderlayX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Login/User menu third */}
            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative flex items-center z-20" // Added z-20 to ensure button stays above
                >
                  <div className="relative">
                    {subscriptionStatus.isActive && (
                      <div className="absolute -top-2 -translate-y-0.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none whitespace-nowrap z-30 shadow-lg">
                        Pro
                      </div>
                    )}
                    <div
                      className={`w-8 h-8 relative rounded-full overflow-hidden ring-2 ${
                        subscriptionStatus.isActive
                          ? "ring-purple-500 shadow-lg shadow-purple-500/30"
                          : "ring-white/10"
                      }`}
                    >
                      {user.user_metadata.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="User avatar"
                          sizes="32px"
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                      <div className="avatar-fallback hidden">
                        <AvatarFallback email={user.email || ""} />
                      </div>
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 py-2 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 z-50">
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
                              {userProfile.current_period_end && (
                                <div className="text-gray-500 dark:text-gray-400">
                                  Expires:{" "}
                                  {new Date(
                                    userProfile.current_period_end
                                  ).toLocaleDateString()}
                                </div>
                              )}
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
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthDialog(true)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-white/80 dark:hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Theme toggle last */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Updated for theme support */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-gray-500/20 dark:bg-black/95 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#141414] border-t border-gray-200 dark:border-white/10">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex w-full items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/10 
                  text-gray-900 dark:text-white transition-colors 
                  border-b border-gray-200 dark:border-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex flex-col text-left">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {item.description}
                  </span>
                </div>
              </Link>
            ))}

            {/* Rest of mobile menu content with updated theme colors */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      {user.user_metadata.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="User avatar"
                          width={40}
                          height={40}
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
                      <div className="avatar-fallback hidden">
                        <AvatarFallback email={user.email || ""} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>

                  {/* User Subscription Info for Mobile */}
                  {userProfile && (
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                      <div className="flex justify-between items-center mb-2">
                        <span>Status:</span>
                        <span
                          className={`font-medium flex items-center gap-1 ${
                            subscriptionStatus.isActive
                              ? "text-purple-400"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              subscriptionStatus.isActive
                                ? "bg-purple-400"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          {subscriptionStatus.isActive
                            ? "Pro Subscriber"
                            : "Free Plan"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {subscriptionStatus.message}
                      </div>
                      {userProfile.current_period_end &&
                        subscriptionStatus.isActive && (
                          <div className="flex justify-between items-center">
                            <span>Expires:</span>
                            <span className="font-medium">
                              {new Date(
                                userProfile.current_period_end
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-white bg-purple-600 rounded-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </nav>
  );
}
