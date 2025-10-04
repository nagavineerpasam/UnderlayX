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
} from "lucide-react"; // Add Github, Images, Pencil, and XCircle import
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { AuthDialog } from "./AuthDialog";
import { UserMenu } from "./UserMenu";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchUserProfile = async () => {
    // This function is now handled by the UserMenu component
  };

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
              <UserMenu user={user} onProfileUpdate={fetchUserProfile} />
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
                    <UserMenu user={user} onProfileUpdate={fetchUserProfile} />
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
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
