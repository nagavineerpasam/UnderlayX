"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ImageIcon,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/hooks/useEditor";
import { TuneImageEditor } from "@/components/TuneImageEditor";
import { CanvasPreview } from "@/components/CanvasPreview";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { useToast } from "@/hooks/use-toast";
import { convertHeicToJpeg } from "@/lib/image-utils";
import { Navbar } from "@/components/Navbar";

export default function PhotoEditor() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    image,
    isProcessing: editorProcessing,
    isConverting,
    handleImageUpload,
    processingMessage,
    removeBackground,
    resetEditor,
    downloadImage,
    isDownloading,
  } = useEditor();

  const handleFileSelect = async (file: File) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!file || !file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select a valid image file.",
      });
      return;
    }

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

    // Process the file
    await processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);

      // Upload and process the image
      await handleImageUpload(file);

      // Set processing to false after upload completes
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handleConvertConfirm = async () => {
    if (!pendingFile) return;

    try {
      setShowConvertDialog(false);
      const convertedFile = await convertHeicToJpeg(pendingFile);
      await processFile(convertedFile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error processing image. Please try again.",
      });
    } finally {
      setPendingFile(null);
    }
  };

  const handleConvertCancel = () => {
    setShowConvertDialog(false);
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownload = async () => {
    try {
      await downloadImage(true);
      toast({
        title: "Image downloaded! 🎉",
        description: "Your amazing creation has been downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description:
          "There was an error downloading your image. Please try again.",
      });
    }
  };

  const resetEditorState = () => {
    resetEditor(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        {/* Navbar */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-4 pt-20">
          {!image.original ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] lg:min-h-[70vh]">
              <div className="text-center mb-10">
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 tracking-tight">
                  Make Your Photos <br />
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400">
                      "Go Viral"
                    </span>
                    {/* Curved underline */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-purple-600 dark:text-purple-400"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 8C50 2 150 2 190 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-light text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  Upload your photo and fine-tune every detail with
                  professional-grade controls. Adjust brightness, contrast,
                  saturation and more for both background and foreground - turn
                  boring photos into
                  <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {" "}
                    VIRAL MASTERPIECES
                  </span>
                  !
                </p>
              </div>

              <div
                className={cn(
                  "group border-2 border-dashed rounded-2xl p-8 lg:p-16 text-center cursor-pointer transition-all duration-300 w-full max-w-3xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
                  isDragging
                    ? "border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 scale-[1.02] shadow-xl"
                    : "hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] hover:shadow-lg"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="relative mb-6">
                  <Upload className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <p className="text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Drop your image here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-4">
                  JPG, PNG, WEBP, HEIC formats supported
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-powered photo editing tools included</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image.webp,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 lg:gap-6 h-[calc(100vh-7rem)]">
              {/* Image Preview - Full width on mobile, 3/5 on desktop (reduced from 3/4) */}
              <div className="lg:col-span-3 order-1 lg:order-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                  <div className="aspect-square lg:aspect-auto lg:h-[calc(100vh-11rem)] flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full max-w-full max-h-full">
                      <CanvasPreview />
                      {(editorProcessing || isProcessing || isConverting) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl z-10">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse">✨</span>
                              <p className="text-white text-sm font-bold">
                                {processingMessage ||
                                  "Processing with Premium AI ✨"}
                              </p>
                              <span className="animate-pulse">✨</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls - Full width on mobile, 2/5 on desktop (increased from 1/4) */}
              <div className="lg:col-span-2 order-2 lg:order-2 flex flex-col h-full">
                {/* Action Buttons - Horizontal layout to save space */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || editorProcessing || isProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-600 text-white font-medium py-2.5 px-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 disabled:scale-100"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isDownloading ? "Downloading..." : "Download"}
                    </span>
                    <span className="sm:hidden">
                      {isDownloading ? "..." : "↓"}
                    </span>
                  </button>
                  <button
                    onClick={resetEditorState}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload New</span>
                    <span className="sm:hidden">↑</span>
                  </button>
                </div>

                {/* Image Adjustments */}
                <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg border border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 tracking-wide uppercase">
                      Image Adjustments
                    </h3>
                  </div>
                  <TuneImageEditor />
                </div>
              </div>
            </div>
          )}

          {/* Convert Dialog */}
          {showConvertDialog && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Convert Image Format
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  This image is in HEIC/HEIF format. To ensure compatibility, it
                  needs to be converted to JPEG. Would you like to proceed with
                  the conversion?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleConvertCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConvertConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    Convert & Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Auth Dialog */}
          <AuthDialog
            isOpen={showAuthDialog}
            onClose={() => setShowAuthDialog(false)}
            returnUrl="/photo-editor"
          />
        </div>
      </div>
    </>
  );
}
