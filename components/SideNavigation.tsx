"use client";

import React, { JSX } from "react";
import {
  Type,
  Shapes,
  Plus,
  ImageIcon,
  Image,
  Copy,
  Images,
  Pencil,
  Scissors,
  Box,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { TextEditor } from "./TextEditor";
import { ShapeEditor } from "./ShapeEditor";
import { RemoveBackgroundEditor } from "./RemoveBackgroundEditor";
import { useEditor } from "@/hooks/useEditor";
import { ChangeBackgroundEditor } from "./ChangeBackgroundEditor";
import { CloneImageEditor } from "./CloneImageEditor";
import { useEditorPanel } from "@/contexts/EditorPanelContext";
import { ImageEditor } from "./ImageEditor";
import { DrawingEditor } from "./DrawingEditor";
import { CutoutEditor } from "./CutoutEditor";
import { TuneImageEditor } from "./TuneImageEditor";

type TabType =
  | "text"
  | "shapes"
  | "remove-background"
  | "change-background"
  | "clone-image"
  | "images"
  | "draw"
  | "cutout"
  | "tune-image"
  | null;

interface SideNavigationProps {
  mobile?: boolean;
  mode?:
    | "full"
    | "text-only"
    | "shapes-only"
    | "remove-background-only"
    | "change-background-only"
    | "clone-image-only"
    | "draw-only"
    | "overlay-only";
}

export function SideNavigation({
  mobile = false,
  mode = "full",
}: SideNavigationProps) {
  // Update the getInitialTab function to return the correct type
  const getInitialTab = (): TabType => {
    switch (mode) {
      case "text-only":
        return "text";
      case "shapes-only":
        return "shapes";
      case "remove-background-only":
        return "remove-background";
      case "change-background-only":
        return "change-background";
      case "clone-image-only":
        return "clone-image";
      case "draw-only":
        return "draw";
      case "overlay-only":
        return "images";
      default:
        return null;
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());
  const {
    image,
    isProcessing,
    isConverting,
    addTextSet,
    addShapeSet,
    isBackgroundRemoved,
  } = useEditor();
  const canAddLayers =
    !!image.original &&
    !!image.background &&
    !isProcessing &&
    !isConverting &&
    !isBackgroundRemoved; // Add this condition
  const { setIsPanelOpen } = useEditorPanel();

  // Get appropriate message based on active tab
  const getUploadMessage = () => {
    if (!image.original) {
      switch (activeTab) {
        case "text":
          return "Please upload an image first to add text behind objects";
        case "shapes":
          return "Please upload an image first to add shapes behind objects";
        case "remove-background":
          return "Please upload an image first to remove the background";
        case "change-background":
          return "Please upload an image first to change the background";
        case "clone-image":
          return "Please upload an image first to use the clone feature";
        case "draw":
          return "Please upload an image first to use the draw feature";
        default:
          return "Please upload an image first";
      }
    }
    return null;
  };

  const showTextButton = mode === "full" || mode === "text-only";
  const showShapesButton = mode === "full" || mode === "shapes-only";
  const showRemoveBackground =
    mode === "full" || mode === "remove-background-only";
  const showChangeBackground =
    mode === "full" || mode === "change-background-only";
  const showCloneImage = mode === "full" || mode === "clone-image-only";
  const showSmartOverlay = mode === "full" || mode === "overlay-only"; // Add this line - only show in full mode
  const showDrawButton = mode === "full" || mode === "draw-only"; // Add this line

  // Add effect to handle body class for mobile slide up
  useEffect(() => {
    setIsPanelOpen(mobile && activeTab !== null);
  }, [mobile, activeTab, setIsPanelOpen]);

  // If we're in remove-background-only mode, set it as initial active tab
  useEffect(() => {
    if (mode === "remove-background-only") {
      setActiveTab("remove-background");
    } else if (mode === "change-background-only") {
      setActiveTab("change-background");
    } else if (mode === "clone-image-only") {
      setActiveTab("clone-image");
    } else if (mode === "draw-only") {
      setActiveTab("draw");
    }
  }, [mode]);

  // Helper function to determine if we should show the "Add" button
  const shouldShowAddButton = (activeTab: string) => {
    return activeTab !== "remove-background" && canAddLayers;
  };

  // Add this new function to determine if a tab should be disabled
  const isTabDisabled = (tabName: TabType) => {
    if (!image.original || isProcessing || isConverting) return true;
    if (isBackgroundRemoved && tabName !== "change-background") return true;
    return false;
  };

  // Update the button rendering to use the new isTabDisabled function
  const renderTabButton = (
    tabName: TabType,
    icon: JSX.Element,
    label: string
  ) => (
    <button
      onClick={() => setActiveTab(activeTab === tabName ? null : tabName)}
      className={cn(
        mobile ? "flex-1 p-2" : "p-3",
        "rounded-lg flex flex-col items-center gap-0.5",
        "transition-all duration-200 ease-in-out transform",
        "hover:scale-105",
        activeTab === tabName
          ? "bg-gradient-to-br from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400 shadow-lg backdrop-blur-sm"
          : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400",
        isTabDisabled(tabName) &&
          "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      disabled={isTabDisabled(tabName)}
    >
      <div
        className={cn(
          "transition-transform duration-200",
          activeTab === tabName && "transform scale-110"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          mobile ? "text-[10px]" : "text-xs",
          "font-medium transition-colors"
        )}
      >
        {label}
      </span>
    </button>
  );

  const changeBackgroundButton =
    showChangeBackground &&
    renderTabButton(
      "change-background" as TabType,
      <Image className={mobile ? "w-4 h-4" : "w-5 h-5"} />,
      "Change BG"
    );

  // Add clone image button
  const cloneImageButton =
    showCloneImage &&
    renderTabButton(
      "clone-image" as TabType,
      <Copy className={mobile ? "w-4 h-4" : "w-5 h-5"} />,
      "Clone Image"
    );

  // Add cutout button
  const cutoutButton = renderTabButton(
    "cutout",
    <Box className={mobile ? "w-4 h-4" : "w-5 h-5"} />,
    "Outline"
  );

  // Add tuneImage button
  const tuneImageButton = renderTabButton(
    "tune-image",
    <Sliders className={mobile ? "w-4 h-4" : "w-5 h-5"} />,
    "Tune Image"
  );

  const renderMobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 p-1.5 z-50 overflow-x-auto">
      <div className="flex gap-2 min-w-fit px-2 pb-safe">
        {" "}
        {/* Added pb-safe for iPhone X+ */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 snap-x snap-mandatory">
          {showRemoveBackground &&
            renderTabButton(
              "remove-background",
              <ImageIcon className="w-4 h-4" />,
              "Remove BG"
            )}
          {changeBackgroundButton}
          {tuneImageButton}
          {cloneImageButton}
          {cutoutButton}
          {showSmartOverlay &&
            renderTabButton(
              "images",
              <Images className="w-4 h-4" />,
              "Smart Overlay"
            )}
          {showTextButton &&
            renderTabButton("text", <Type className="w-4 h-4" />, "Text")}
          {showShapesButton &&
            renderTabButton("shapes", <Shapes className="w-4 h-4" />, "Shapes")}
          {showDrawButton &&
            renderTabButton("draw", <Pencil className="w-4 h-4" />, "Draw")}
        </div>
      </div>
    </div>
  );

  const renderDesktopNavigation = () => (
    <div className="w-[80px] border-r border-gray-200 dark:border-white/10 flex flex-col gap-1 p-2 h-full overflow-y-auto">
      <div className="flex flex-col gap-1 min-h-min">
        {showRemoveBackground &&
          renderTabButton(
            "remove-background",
            <ImageIcon className="w-5 h-5" />,
            "Remove BG"
          )}
        {changeBackgroundButton}
        {tuneImageButton}
        {cloneImageButton}
        {showSmartOverlay &&
          renderTabButton(
            "images",
            <Images className="w-5 h-5" />,
            "Smart Overlay"
          )}
        {cutoutButton}
        {showTextButton &&
          renderTabButton("text", <Type className="w-5 h-5" />, "Text")}
        {showShapesButton &&
          renderTabButton("shapes", <Shapes className="w-5 h-5" />, "Shapes")}
        {showDrawButton &&
          renderTabButton("draw", <Pencil className="w-5 h-5" />, "Draw")}
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        {renderMobileNavigation()}

        {/* Mobile Slide-up Editor Panel */}
        {activeTab && (
          <div
            className={cn(
              "fixed inset-x-0 bottom-[56px] bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 rounded-t-xl z-40 flex flex-col shadow-2xl",
              "transition-all duration-300 ease-in-out",
              "max-h-[40vh] overflow-y-auto" // Increased height and added overflow
            )}
          >
            {/* Handle for dragging */}
            <div className="w-full flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>

            <div className="sticky top-0 bg-white dark:bg-zinc-950 p-2.5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              {activeTab === "text" || activeTab === "shapes" ? (
                <button
                  onClick={() =>
                    activeTab === "text" ? addTextSet() : addShapeSet("square")
                  }
                  disabled={!canAddLayers}
                  className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {activeTab === "text" ? "Text" : "Shape"}</span>
                </button>
              ) : (
                <h3 className="text-lg font-semibold truncate">
                  {activeTab === "remove-background" ? "Remove Background" : ""}
                  {activeTab === "change-background" ? "Change Background" : ""}
                  {activeTab === "clone-image" ? "Clone Image" : ""}
                  {activeTab === "images" ? "Smart Overlay" : ""}
                  {activeTab === "cutout" ? "Object Outline" : ""}
                  {activeTab === "tune-image" ? "Tune Image" : ""}
                  {activeTab === "draw" ? "Draw" : ""}
                </h3>
              )}

              {/* Add close button */}
              <button
                onClick={() => setActiveTab(null)}
                className="ml-3 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white text-right"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-3 p-3 pb-12 [&_*]:text-sm [&_input]:h-8 [&_button]:h-8 [&_select]:h-8">
                {/* Increased bottom padding to pb-12 */}
                {/* This wrapper adds mobile-optimized styles to all child elements */}
                {getUploadMessage() ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-gray-400 text-sm">
                      {getUploadMessage()}
                    </p>
                  </div>
                ) : (
                  <>
                    {activeTab === "text" && <TextEditor />}
                    {activeTab === "shapes" && <ShapeEditor />}
                    {activeTab === "remove-background" && (
                      <RemoveBackgroundEditor />
                    )}
                    {activeTab === "change-background" && (
                      <ChangeBackgroundEditor />
                    )}
                    {activeTab === "clone-image" && <CloneImageEditor />}
                    {activeTab === "images" && <ImageEditor />}
                    {activeTab === "draw" && <DrawingEditor />}
                    {activeTab === "cutout" && <CutoutEditor />}
                    {activeTab === "tune-image" && <TuneImageEditor />}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 bottom-0 flex h-[calc(100vh-4rem)] z-50",
        "transition-all duration-300 ease-in-out",
        "border-r border-t border-gray-200/50 dark:border-white/5",
        "backdrop-blur-xl",
        activeTab ? "w-[380px]" : "w-[80px]"
      )}
    >
      {/* Side Navigation Bar */}
      <div className="flex h-full bg-white dark:bg-zinc-950">
        {/* Increase the width of the navigation buttons */}
        {renderDesktopNavigation()}

        {/* Editor Content with border */}
        {activeTab && (
          <div className="w-[380px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-zinc-950 p-4 border-b border-gray-200 dark:border-white/10 z-10">
              {(activeTab === "text" || activeTab === "shapes") &&
              canAddLayers ? (
                <button
                  onClick={() =>
                    activeTab === "text" ? addTextSet() : addShapeSet("square")
                  }
                  disabled={!canAddLayers}
                  className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {activeTab === "text" ? "Text" : "Shape"}</span>
                </button>
              ) : (
                <h3 className="text-lg font-semibold">
                  {activeTab === "remove-background"
                    ? "Remove Background"
                    : activeTab === "images"
                    ? "Smart overlay"
                    : activeTab === "change-background"
                    ? "Change Background"
                    : activeTab === "clone-image"
                    ? "Clone Image"
                    : activeTab === "text"
                    ? "Add Text"
                    : activeTab === "draw"
                    ? "Draw"
                    : activeTab === "cutout"
                    ? "Outline"
                    : activeTab === "tune-image"
                    ? "Tune Image"
                    : "Add Shapes"}
                </h3>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 h-full">
              {getUploadMessage() ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-gray-400 mb-4">{getUploadMessage()}</p>
                </div>
              ) : (
                <>
                  {activeTab === "text" && <TextEditor />}
                  {activeTab === "shapes" && <ShapeEditor />}
                  {activeTab === "remove-background" && (
                    <RemoveBackgroundEditor />
                  )}
                  {activeTab === "change-background" && (
                    <ChangeBackgroundEditor />
                  )}
                  {activeTab === "clone-image" && <CloneImageEditor />}
                  {activeTab === "images" && <ImageEditor />}
                  {activeTab === "draw" && <DrawingEditor />}
                  {activeTab === "cutout" && <CutoutEditor />}
                  {activeTab === "tune-image" && <TuneImageEditor />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
