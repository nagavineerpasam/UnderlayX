"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useEditor } from "@/hooks/useEditor";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "foreground" | "background" | "both";

const defaultEnhancements = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  fade: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0, // Add default value
  blacks: 0, // Add default value
} as const;

export function TuneImageEditor() {
  const [activeTab, setActiveTab] = useState<TabType>("background");
  const {
    foregroundEnhancements,
    backgroundEnhancements,
    updateForegroundEnhancements,
    updateBackgroundEnhancements,
  } = useEditor();

  const handleReset = () => {
    updateForegroundEnhancements({ ...defaultEnhancements });
    updateBackgroundEnhancements({ ...defaultEnhancements });
  };

  const renderEnhancementControls = (type: TabType) => {
    const enhancements =
      type === "foreground" ? foregroundEnhancements : backgroundEnhancements;
    const updateEnhancements =
      type === "foreground"
        ? updateForegroundEnhancements
        : updateBackgroundEnhancements;

    // For "both" tab, we'll use background enhancements as the display values
    // but apply changes to both when updating
    const displayEnhancements =
      type === "both" ? backgroundEnhancements : enhancements;
    const handleBothUpdate = (newEnhancements: typeof defaultEnhancements) => {
      updateForegroundEnhancements(newEnhancements);
      updateBackgroundEnhancements(newEnhancements);
    };
    const handleUpdate =
      type === "both" ? handleBothUpdate : updateEnhancements;

    return (
      <div className="space-y-2 lg:space-y-2">
        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Brightness
          </label>
          <Slider
            value={[displayEnhancements.brightness]}
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                brightness: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {displayEnhancements.brightness}%
          </div>
        </div>

        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Contrast
          </label>
          <Slider
            value={[displayEnhancements.contrast]}
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                contrast: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {displayEnhancements.contrast}%
          </div>
        </div>

        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Saturation
          </label>
          <Slider
            value={[displayEnhancements.saturation]}
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                saturation: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {displayEnhancements.saturation}%
          </div>
        </div>

        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Fade
          </label>
          <Slider
            value={[displayEnhancements.fade]}
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                fade: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {displayEnhancements.fade}%
          </div>
        </div>

        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Blur
          </label>
          <Slider
            value={[displayEnhancements.blur || 0]} // Add null check
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                blur: value,
              })
            }
            min={0}
            max={20}
            step={0.1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {(displayEnhancements.blur || 0).toFixed(1)}px
          </div>
        </div>

        <div className="space-y-2 lg:space-y-2">
          <label className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
            Blacks
          </label>
          <Slider
            value={[displayEnhancements.blacks || 0]} // Add null check
            onValueChange={([value]) =>
              handleUpdate({
                ...displayEnhancements,
                blacks: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {displayEnhancements.blacks || 0}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2 lg:space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Image Adjustments
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex space-x-1 lg:space-x-2 border-b dark:border-white/10">
        <button
          onClick={() => setActiveTab("background")}
          className={cn(
            "px-2 lg:px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "background"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          )}
        >
          Background
        </button>
        <button
          onClick={() => setActiveTab("foreground")}
          className={cn(
            "px-2 lg:px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "foreground"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          )}
        >
          Foreground
        </button>
        <button
          onClick={() => setActiveTab("both")}
          className={cn(
            "px-3 lg:px-5 py-2 text-sm font-medium transition-colors relative",
            activeTab === "both"
              ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/20"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          )}
        >
          Both
          {activeTab === "both" && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === "both" && (
          <div className="mb-2 p-2 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              ✨ Editing both background and foreground simultaneously
            </p>
          </div>
        )}
        {renderEnhancementControls(activeTab)}
      </div>
    </div>
  );
}
