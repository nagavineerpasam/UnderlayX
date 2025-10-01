"use client";

import { useCallback } from "react";
import { useEditor } from "@/hooks/useEditor";
import { Upload } from "lucide-react";
import { CanvasPreview } from "./CanvasPreview";
import { convertHeicToJpeg } from "@/lib/image-utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { PaymentDialog } from "./PaymentDialog";
import { useState, useRef, useEffect } from "react"; // Add useRef, useCallback, useEffect
import { useAuth } from "@/hooks/useAuth";
import { useUserGenerations } from "@/hooks/useUserGenerations";
import { AuthDialog } from "./AuthDialog";
import { cn } from "@/lib/utils";
import { useEditorPanel } from "@/contexts/EditorPanelContext";
import { useIsMobile } from "@/hooks/useIsMobile"; // Add this import
import { useToast } from "@/hooks/use-toast";

interface CanvasProps {
  shouldAutoUpload?: boolean;
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

export function Canvas({ shouldAutoUpload, mode = "full" }: CanvasProps) {
  const {
    image,
    isProcessing,
    isConverting,
    handleImageUpload,
    processingMessage,
    textSets,
    setProcessingMessage,
    setIsProcessing,
    setIsConverting,
  } = useEditor();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Add this ref
  const [hasTriedAutoUpload, setHasTriedAutoUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const {
    subscriptionStatus,
    canGenerate,
    incrementGeneration,
    getPaymentUrl,
  } = useUserGenerations();
  const { isPanelOpen } = useEditorPanel();
  const isMobile = useIsMobile(); // Add this hook
  const { toast } = useToast();

  // Add this function inside the Canvas component
  const preloadFonts = useCallback(async (fontFamily: string) => {
    try {
      await document.fonts.load(`400 16px "${fontFamily}"`);
      await document.fonts.load(`700 16px "${fontFamily}"`);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to preload font" });
    }
  }, []);

  const handleFileProcess = async (file: File) => {
    // Check if user can generate (has active subscription)
    if (user && !canGenerate()) {
      setShowPaymentDialog(true);
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingMessage("✨ Our AI is working its magic on your photo...");

      await handleImageUpload(file);

      // Increment generation count after successful processing
      if (user) {
        await incrementGeneration();
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Always show toast on error
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });

      console.error("Error in handleFileProcess:", error);
    } finally {
      setIsProcessing(false);
      setProcessingMessage(""); // Clear any processing message
    }
  };

  const handleConvertConfirm = async () => {
    if (!pendingFile) return;

    // Check if user is authenticated before processing converted file
    if (!user) {
      setShowConvertDialog(false);
      setShowAuthDialog(true);
      setPendingFile(null);
      return;
    }

    try {
      setShowConvertDialog(false);
      setIsConverting(true); // Set converting state first
      setProcessingMessage("Converting image format...");

      const convertedFile = await convertHeicToJpeg(pendingFile);
      await handleFileProcess(convertedFile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error processing image. Please try again.",
      });
    } finally {
      setPendingFile(null);
      setIsConverting(false); // Reset converting state
    }
  };

  const handleConvertCancel = () => {
    setShowConvertDialog(false);
    setPendingFile(null);
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePayment = () => {
    const paymentUrl = getPaymentUrl();
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // Check if user is authenticated before processing file
      if (!user) {
        setShowAuthDialog(true);
        e.target.value = ""; // Clear the file input
        return;
      }

      const file = e.target.files[0];
      e.target.value = "";

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image.webp",
        "image.webp",
        "image.heic",
        "image/heic",
        "image.heif",
        "image/heif",
      ];
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      // Set processing state immediately
      setIsProcessing(true);
      setProcessingMessage("🚀 Getting ready to make your photo amazing...");

      try {
        // Check if it's HEIC/HEIF first
        if (
          fileType.includes("heic") ||
          fileType.includes("heif") ||
          fileName.endsWith(".heic") ||
          fileName.endsWith(".heif")
        ) {
          setPendingFile(file);
          setShowConvertDialog(true);
          return;
        }

        // For other image types
        if (validTypes.includes(fileType)) {
          await handleFileProcess(file);
        } else {
          alert(
            "Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)"
          );
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process image. Please try again.",
        });
      } finally {
        setIsProcessing(false);
        setProcessingMessage("");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated before processing file
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    const file = e.dataTransfer.files[0];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // Check if it's HEIC/HEIF first
    if (
      fileType.includes("heic") ||
      fileType.includes("heif") ||
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif")
    ) {
      setPendingFile(file);
      setShowConvertDialog(true);
      return;
    }

    // For other image types
    const validTypes = ["image/jpeg", "image/png", "image.webp", "image/webp"];
    if (validTypes.includes(fileType)) {
      await handleFileProcess(file);
    } else {
      alert("Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getLoadingMessage = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center gap-2">
          <span className="animate-pulse">✨</span>
          <p className="text-white text-sm font-bold">
            {processingMessage || "Processing with Premium AI ✨"}
          </p>
          <span className="animate-pulse">✨</span>
        </div>
      );
    }
    return <p className="text-white text-sm font-bold">Loading image...</p>;
  };

  // Inside useEffect where you handle text changes
  useEffect(() => {
    const loadFonts = async () => {
      const fontPromises = textSets.map((textSet) =>
        preloadFonts(textSet.fontFamily)
      );
      await Promise.all(fontPromises);
    };

    loadFonts();
  }, [textSets, preloadFonts]);

  useEffect(() => {
    const handleAutoUpload = () => {
      if (
        shouldAutoUpload &&
        !hasTriedAutoUpload &&
        fileInputRef.current &&
        !image.original
      ) {
        setHasTriedAutoUpload(true);
        fileInputRef.current.click();
      }
    };

    // Small delay to ensure proper initialization
    const timeoutId = setTimeout(handleAutoUpload, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Cleanup function for file input and auto-upload state
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setHasTriedAutoUpload(false);
      setPendingFile(null);
      setShowConvertDialog(false);
      setShowAuthDialog(false);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          "p-4 sm:p-6",
          isMobile && "mt-2",
          isPanelOpen && isMobile && "mb-4"
        )}
      >
        {!image.original ? (
          <div className="h-full flex items-center justify-center">
            {" "}
            {/* Modified this line */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={cn(
                "transition-all duration-300",
                "relative flex items-center justify-center",
                "w-full", // Added this
                isMobile ? "h-full" : "h-[600px]" // Increased height from 380px to 600px
              )}
            >
              <input
                ref={fileInputRef}
                id="canvas-upload"
                type="file"
                onChange={onFileChange}
                accept="image/jpeg,image/png,image.webp,image.heic,image.heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
                className="hidden"
                disabled={isConverting || isProcessing}
              />
              {isMobile ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {isConverting
                      ? "Converting image..."
                      : user
                      ? "Upload an image to get started"
                      : "Sign in to upload and edit images"}
                  </p>
                  <label
                    htmlFor="canvas-upload"
                    className={cn(
                      "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors",
                      (isConverting || isProcessing) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    onClick={(e) =>
                      (isConverting || isProcessing) && e.preventDefault()
                    }
                  >
                    <Upload className="w-5 h-5" />
                    <span>{isConverting ? "Converting..." : "Upload"}</span>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="canvas-upload"
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center gap-3",
                    "border-2 border-dashed border-purple-500/50 dark:border-purple-400/30", // Changed this line
                    "rounded-lg", // Smaller border radius
                    "transition-all bg-white/50 dark:bg-zinc-900/50",
                    "hover:bg-gray-50/80 dark:hover:bg-zinc-800/50",
                    "hover:border-purple-500 dark:hover:border-purple-400", // Added this line for hover effect
                    "backdrop-blur-sm",
                    "cursor-pointer",
                    (isConverting || isProcessing) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) =>
                    (isConverting || isProcessing) && e.preventDefault()
                  }
                >
                  <div className="flex items-center gap-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 rounded-full shadow-sm transition-colors">
                    <Upload className="w-5 h-5 text-white" />
                    <span className="text-sm font-medium text-white">
                      {isConverting ? "Converting..." : "Select an image"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user
                      ? "Drag and drop an image here or click to select a file"
                      : "Sign in to upload and edit images"}
                  </p>
                </label>
              )}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative w-full h-full",
              "max-w-5xl",
              "flex items-center justify-center",
              !user && "pt-10"
            )}
          >
            {(isProcessing || isConverting) && (
              <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  {getLoadingMessage()}
                </div>
              </div>
            )}

            {image.original && (
              <div className="w-full h-full">
                <CanvasPreview />
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConvertDialog}
        onClose={handleConvertCancel}
        onConfirm={handleConvertConfirm}
        title="Convert Image Format"
        description="This image is in HEIC/HEIF format. To ensure compatibility, it needs to be converted to JPEG. Would you like to proceed with the conversion?"
      />

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPayment={handlePayment}
        subscriptionStatus={subscriptionStatus}
      />
    </>
  );
}
