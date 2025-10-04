"use client";

import { useEditor } from "@/hooks/useEditor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Upload, Save, LogIn, Loader2, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas } from "@/components/Canvas";
import { useIsMobile } from "@/hooks/useIsMobile"; // Add this hook
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { useState, useRef, useEffect } from "react";
import { useEditorPanel } from "@/contexts/EditorPanelContext";
import { KofiButton } from "./KofiButton";
import { SupportDialog, shouldShowSupportDialog } from "./SupportDialog";
import { useToast } from "@/hooks/use-toast";
import { KofiFloatingWidget } from "./KofiFloatingWidget";
import { KofiPaymentDialog } from "./KofiPaymentDialog";
import { UserMenu } from "./UserMenu";

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
  const { isPanelOpen } = useEditorPanel();
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showKofiPayment, setShowKofiPayment] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    // This function is now handled by the UserMenu component
  };

  // Unified state check for all button actions
  const isActionDisabled = isProcessing || isConverting || isDownloading;

  // Modify handleDownload to show toast and support dialog after download
  const handleDownload = async () => {
    try {
      await downloadImage(true); // Always download without checking authentication

      // Show success toast
      toast({
        title: "Image downloaded! 🎉",
        description: "Your amazing creation has been downloaded successfully.",
        duration: 3000,
      });

      // Show support dialog if conditions are met
      // COMMENTED OUT: Ko-fi support dialog after download
      // if (shouldShowSupportDialog()) {
      //   // Small delay to let the toast show first
      //   setTimeout(() => {
      //     setShowSupportDialog(true);
      //   }, 500);
      // }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description:
          "There was an error downloading your image. Please try again.",
      });
    }
  };

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
                  onClick={() => {
                    resetEditor(true); // Force reset the editor first
                    const fileInput = document.getElementById(
                      "canvas-upload"
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
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
              <div className="flex flex-col items-center px-1 sm:px-2">
                <ThemeToggle />
                <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
                  Theme
                </span>
              </div>

              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              ) : user ? (
                <UserMenu user={user} onProfileUpdate={fetchUserProfile} />
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="flex flex-col items-center px-1 sm:px-2"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
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
        <div className="hidden xl:block fixed top-16 bottom-0 w-[380px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 z-10">
          <SideNavComponent mobile={false} />
        </div>

        <main
          className={cn(
            "flex-1 relative transition-all duration-300 ease-in-out",
            "px-0 sm:px-4",
            "xl:ml-[380px]",
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

      <SupportDialog
        isOpen={showSupportDialog}
        onClose={() => setShowSupportDialog(false)}
        onOpenKofiPayment={() => setShowKofiPayment(true)}
      />

      <KofiPaymentDialog
        isOpen={showKofiPayment}
        onClose={() => setShowKofiPayment(false)}
      />

      {/* Ko-fi floating widget - Commented for future use */}
      {/* <KofiFloatingWidget /> */}
    </div>
  );
}
