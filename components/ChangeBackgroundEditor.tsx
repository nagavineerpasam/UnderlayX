"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { uploadFile } from "@/lib/upload"; // Add this import
import { useToast } from "@/hooks/use-toast"; // Add this import

const PRESET_COLORS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFA500", // Orange
  "#800080", // Purple
  "#FFC0CB", // Pink
  "#4A90E2", // Sky Blue
  "#50E3C2", // Mint
  "#F5A623", // Gold
  "#D0021B", // Dark Red
];

export function ChangeBackgroundEditor() {
  const {
    changeBackground,
    resetBackground,
    hasChangedBackground,
    foregroundPosition,
    updateForegroundPosition,
    isProcessing,
    setBackgroundColor,
    backgroundColor,
    foregroundSize,
    updateForegroundSize,
    image,
    backgroundOpacity,
    updateBackgroundOpacity,
  } = useEditor();

  const [hexValue, setHexValue] = useState(backgroundColor || "");
  const { toast } = useToast();

  // Update hex value when backgroundColor changes
  useEffect(() => {
    setHexValue(backgroundColor || "");
  }, [backgroundColor]);

  const handleColorSelect = (color: string | null) => {
    setBackgroundColor(color);
    setHexValue(color || "");
  };

  const handleHexInput = (value: string) => {
    setHexValue(value);
    // Only update the background color if it's a valid hex code
    if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      setBackgroundColor(value);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setHexValue(color);
    setBackgroundColor(color);
  };

  const handleBackgroundUpload = async () => {
    try {
      await changeBackground(); // Remove the arguments as we'll handle file upload inside changeBackground
    } catch (error) {
      console.error("Error uploading background:", error);
      toast({
        variant: "destructive",
        title: "Failed to upload background",
        description: "Please try again with a different image.",
      });
    }
  };

  // Modify the getDisplayMode function to separate image and color modes
  const getDisplayMode = () => {
    if (hasChangedBackground && image.background) return "IMAGE_MODE";
    return "COLOR_MODE"; // Always show color options
  };

  return (
    <div className="space-y-6">
      {/* Color Picker Section - Always visible unless in IMAGE_MODE */}
      {getDisplayMode() !== "IMAGE_MODE" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color</label>
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={hexValue}
                  onChange={handleColorPickerChange}
                  className="w-10 h-10 p-1 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                />
              </div>
              <Input
                value={hexValue}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#000000"
                className="flex-1"
                maxLength={7}
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preset Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "w-8 h-8 rounded-md border-2 transition-all",
                    backgroundColor === color
                      ? "border-blue-500 scale-110"
                      : "border-gray-200 dark:border-gray-700 hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Section - Only show if no background image is set */}
      {!hasChangedBackground && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-2 text-gray-500">
                or
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              🖼️ Want something more exciting? Upload your own background image!
            </p>
            <Button
              onClick={handleBackgroundUpload}
              className="w-full"
              variant="default"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing
                ? "✨ Working magic..."
                : "📷 Upload Your Background"}
            </Button>
          </div>
        </>
      )}

      {/* Controls Section - Show when either background is changed or color is selected */}
      {(hasChangedBackground || backgroundColor) && (
        <div className="space-y-4">
          {/* Background Opacity Control */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Background Opacity</label>
            <Slider
              value={[backgroundOpacity]}
              onValueChange={([value]) => updateBackgroundOpacity(value)}
              min={0}
              max={100}
              step={1}
            />
          </div> */}

          {/* Foreground Size Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              📏 Make Your Image Bigger/Smaller
            </label>
            <Slider
              value={[foregroundSize]}
              onValueChange={([value]) => updateForegroundSize(value)}
              min={10}
              max={200}
              step={1}
            />
          </div>

          {/* Position controls */}
          <div className="space-y-2">
            <label className="text-sm font-medium">↔️ Move Left/Right</label>
            <Slider
              value={[foregroundPosition.x]}
              onValueChange={([value]) =>
                updateForegroundPosition({ x: value, y: foregroundPosition.y })
              }
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">↕️ Move Up/Down</label>
            <Slider
              value={[foregroundPosition.y]}
              onValueChange={([value]) =>
                updateForegroundPosition({ x: foregroundPosition.x, y: value })
              }
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Reset button */}
          <div className="mt-6">
            <Button
              onClick={resetBackground}
              variant="outline"
              className="w-full"
            >
              🔄 Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
