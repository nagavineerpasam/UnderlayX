"use client";

import { useEditor } from "@/hooks/useEditor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Upload, Save, LogIn, Loader2, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas } from "@/components/Canvas";
import { useIsMobile } from "@/hooks/useIsMobile"; // Add this hook
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { useState, useRef, useEffect } from "react";
import { useEditorPanel } from "@/contexts/EditorPanelContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { isSubscriptionActive } from "@/lib/utils";
import { ProUpgradeButton } from "./ProUpgradeButton"; // Add ProUpgradeButton to imports
import { KofiButton } from './KofiButton';

interface EditorLayoutProps {
  SideNavComponent: React.ComponentType<{ mobile?: boolean }>;
  mode?:
    | "full"
    | "draw-only"
    | "text-only"
    | "shapes-only"
    | "remove-background-only"
    | "change-background-only"
    | "clone-image-only"
    | "overlay-only"; // Add overlay-only
}

interface UserInfo {
  expires_at: string | null;
  free_generations_used: number;
}

// Add the AvatarFallback component at the top level
const AvatarFallback = ({ email }: { email: string }) => {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full bg-gray-500 flex items-center justify-center">
      <span className="text-white text-sm font-medium">{initials}</span>
    </div>
  );
};

export function EditorLayout({
  SideNavComponent,
  mode = "full",
}: EditorLayoutProps) {
  const {
    resetEditor,
    downloadImage,
    isDownloading,
    image,
    isProcessing,
    isConverting,
  } = useEditor();
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isPanelOpen } = useEditorPanel();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUserInfo() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("expires_at, free_generations_used")
            .eq("id", user.id)
            .single();

          if (data) {
            setUserInfo(data);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    }

    fetchUserInfo();
  }, [user]); // Remove showUserMenu dependency, only fetch when user changes

  // Unified state check for all button actions
  const isActionDisabled = isProcessing || isConverting || isDownloading;

  // Modify handleDownload to directly download without quality dialog
  const handleDownload = () => {
    downloadImage(true); // Always download without checking authentication
  };

  // Modify the shouldShowUpgradeButton logic
  const shouldShowUpgradeButton =
    !user ||
    !userInfo?.expires_at || // Show for free plan (no expires_at)
    !isSubscriptionActive(userInfo.expires_at); // Show for expired pro users

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10">
        {/* Adjusted padding for better mobile spacing */}
        <div className="px-3 sm:px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-semibold hidden sm:inline">
                UnderlayX AI
              </span>
              <div className="flex items-center flex-col">
                <Home className="sm:hidden w-5 h-5" />
                <span className="sm:hidden text-xs mt-0.5 text-gray-600 dark:text-gray-400">
                  Home
                </span>
              </div>
            </a>
          </div>

          {/* Updated spacing for mobile buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {" "}
            {/* Reduced gap for mobile */}
            <KofiButton />
            {image.original && (
              <>
                <button
                  onClick={() => resetEditor(true)}
                  disabled={isActionDisabled}
                  className={cn(
                    "flex flex-col items-center px-1 sm:px-2", // Reduced padding for mobile
                    isActionDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={isActionDisabled}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />{" "}
                  {/* Smaller icons on mobile */}
                  <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
                    Upload
                  </span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isActionDisabled}
                  className={cn(
                    "flex flex-col items-center px-1 sm:px-2",
                    isActionDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={isActionDisabled}
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {isDownloading ? "Downloading..." : "Download"}
                  </span>
                </button>
              </>
            )}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* {shouldShowUpgradeButton && <ProUpgradeButton variant="nav" />} */}

              <ThemeToggle />

              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative flex items-center z-20"
                  >
                    <div className="relative pt-2">
                      {" "}
                      {/* Added pt-2 for badge space */}
                      {userInfo?.expires_at &&
                        isSubscriptionActive(userInfo.expires_at) && (
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none whitespace-nowrap z-30">
                            Pro
                          </div>
                        )}
                      <div className="w-8 h-8 relative rounded-full overflow-hidden ring-2 ring-white/10">
                        {user.user_metadata.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="User avatar"
                            sizes="32px"
                            className="cursor-pointer hover:opacity-80 transition-opacity object-cover w-full h-full"
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
                        {userInfo && (
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            {userInfo.expires_at &&
                            isSubscriptionActive(userInfo.expires_at) ? (
                              <>
                                <div className="text-purple-600 font-medium">
                                  Pro Plan Active
                                </div>
                                <div>
                                  Expires:{" "}
                                  {new Date(
                                    userInfo.expires_at
                                  ).toLocaleDateString()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div>Free Plan</div>
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
                  className="flex flex-col items-center px-1 sm:px-2"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
                    Login
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex flex-col h-screen overflow-hidden">
        {/* Changed lg to xl for larger screens only */}
        <div className="hidden xl:block fixed top-16 bottom-0 w-[320px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 z-10">
          <SideNavComponent mobile={false} />
        </div>

        <main
          className={cn(
            "flex-1 relative transition-all duration-300 ease-in-out",
            "px-0 sm:px-4",
            "xl:ml-[320px]",
            "pt-4",
            "overflow-hidden",
            isMobile
              ? isPanelOpen
                ? "pb-[32vh]"
                : "pb-16"
              : isPanelOpen
              ? "pb-[calc(32vh+120px)]"
              : "pb-24 xl:pb-12"
          )}
        >
          {/* Bottom Navigation for mobile, tablet and small desktop */}
          <div className="fixed bottom-0 left-0 right-0 xl:hidden bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 z-20">
            <div className="p-2">
              <SideNavComponent mobile={true} />
            </div>
          </div>

          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              "w-full mx-auto",
              "overflow-hidden",
              "max-w-[min(900px,calc(100vw-2rem))]",
              isMobile
                ? isPanelOpen
                  ? "h-[48vh]"
                  : "h-[75vh]"
                : isPanelOpen
                ? "h-[calc(80vh-9rem)]"
                : "h-[calc(100vh-11rem)]",
              "xl:h-[calc(100vh-8rem)]"
            )}
          >
            <div
              className={cn(
                "relative w-full h-full",
                "flex items-center justify-center",
                "overflow-hidden"
              )}
            >
              <div className="w-full h-full overflow-hidden">
                <Canvas mode={mode} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        returnUrl={
          typeof window !== "undefined" ? window.location.pathname : ""
        }
      />
    </div>
  );
}
