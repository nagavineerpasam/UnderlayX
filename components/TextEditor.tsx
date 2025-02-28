"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor } from "@/hooks/useEditor";
import { FontWeight } from "@/constants/fonts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowEffect } from "@/types/editor";
import { useDebounce } from "@/hooks/useDebounce";
import { ColorInput } from "./ColorInput";
import { cn } from "@/lib/utils";
import { FontSelector } from "./FontSelector";
import { Bold } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper function for smooth scrolling
const scrollToElement = (element: HTMLElement | null) => {
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function TextEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { textSets, updateTextSet, removeTextSet } = useEditor();
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
    {}
  );
  const [fontSearch, setFontSearch] = useState("");

  const debouncedUpdateText = useDebounce((id: number, updates: any) => {
    updateTextSet(id, updates);
  }, 16);

  const handlePositionChange = useCallback(
    (id: number, type: "horizontal" | "vertical", value: number) => {
      const textSet = textSets.find((set) => set.id === id);
      if (!textSet) return;

      updateTextSet(id, {
        position: {
          vertical:
            type === "vertical"
              ? Math.round(value * 10) / 10
              : textSet.position.vertical,
          horizontal:
            type === "horizontal"
              ? Math.round(value * 10) / 10
              : textSet.position.horizontal,
        },
      });
    },
    [textSets, updateTextSet]
  );

  // Auto-scroll to new text layer
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const lastElement = container.lastElementChild;
      scrollToElement(lastElement as HTMLElement);
    }
  }, [textSets.length]);

  // Auto-open new accordions
  useEffect(() => {
    const newOpenState: Record<number, boolean> = {};
    textSets.forEach((set) => {
      newOpenState[set.id] = openAccordions[set.id] !== false;
    });
    setOpenAccordions(newOpenState);
  }, [textSets.length]);

  const toggleAccordion = (id: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {textSets.map((textSet) => (
        <div
          key={textSet.id}
          className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 p-4 space-y-4"
        >
          {/* Text Input */}
          <Input
            id={`text-input-${textSet.id}`}
            name={`text-input-${textSet.id}`}
            value={textSet.text}
            onChange={(e) =>
              updateTextSet(textSet.id, { text: e.target.value })
            }
            className={cn(
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white",
              "text-base sm:text-base"
            )}
            placeholder="Enter text..."
            autoComplete="off"
            spellCheck="false"
            style={{ fontSize: "16px" }}
          />

          {/* Font Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor={`font-family-${textSet.id}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Font
              </Label>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  textSet.fontWeight === "700" &&
                    "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                )}
                onClick={() =>
                  updateTextSet(textSet.id, {
                    fontWeight: textSet.fontWeight === "400" ? "700" : "400",
                  })
                }
                title="Toggle Bold"
              >
                <Bold
                  className={cn(
                    "h-4 w-4",
                    textSet.fontWeight === "700" &&
                      "text-purple-600 dark:text-purple-400"
                  )}
                />
              </Button>
            </div>

            <FontSelector
              value={textSet.fontFamily}
              onValueChange={(value) =>
                updateTextSet(textSet.id, { fontFamily: value })
              }
            />
          </div>

          {/* Text Placement Toggle */}
          <div className="py-2 border-t border-b border-gray-100 dark:border-gray-800 my-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Behind
                </span>
                <Switch
                  id={`text-placement-${textSet.id}`}
                  checked={textSet.placement === "foreground"}
                  onCheckedChange={(checked) =>
                    updateTextSet(textSet.id, {
                      placement: checked ? "foreground" : "background",
                    })
                  }
                  className="data-[state=checked]:bg-purple-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Front
                </span>
              </div>
            </div>
          </div>

          {/* Text Size */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Text Size
              </Label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {textSet.fontSize}px
              </span>
            </div>
            <Slider
              min={12}
              max={2000}
              value={[textSet.fontSize]}
              onValueChange={([value]) =>
                updateTextSet(textSet.id, { fontSize: value })
              }
            />
          </div>

          {/* Color */}
          <div className="pt-1">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Color
            </Label>
            <ColorInput
              id={`text-color-${textSet.id}`}
              value={textSet.color}
              onChange={(value) => updateTextSet(textSet.id, { color: value })}
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Opacity
              </Label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(textSet.opacity * 100)}%
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[textSet.opacity]}
              onValueChange={([value]) =>
                updateTextSet(textSet.id, { opacity: value })
              }
            />
          </div>

          {/* Position Controls */}
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Horizontal Position
                </Label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {textSet.position.horizontal}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={0.1}
                value={[textSet.position.horizontal]}
                onValueChange={([value]) =>
                  handlePositionChange(textSet.id, "horizontal", value)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vertical Position
                </Label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {textSet.position.vertical}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={0.1}
                value={[textSet.position.vertical]}
                onValueChange={([value]) =>
                  handlePositionChange(textSet.id, "vertical", value)
                }
              />
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rotation
              </Label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {textSet.rotation}°
              </span>
            </div>
            <Slider
              min={-180}
              max={180}
              value={[textSet.rotation]}
              onValueChange={([value]) =>
                updateTextSet(textSet.id, { rotation: value })
              }
            />
          </div>

          {/* Glow Effect Controls */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Glow
              </Label>
              <Switch
                checked={textSet.glow?.enabled ?? false}
                onCheckedChange={(checked) => {
                  const newGlow: GlowEffect = {
                    enabled: checked,
                    color: textSet.glow?.color || "#ffffff",
                    intensity: textSet.glow?.intensity || 20,
                  };
                  updateTextSet(textSet.id, { glow: newGlow });
                }}
              />
            </div>

            {textSet.glow?.enabled && (
              <>
                {/* Glow Color */}
                <div className="pt-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Glow Color
                  </Label>
                  <ColorInput
                    id={`text-glow-${textSet.id}`}
                    value={textSet.glow.color}
                    onChange={(value) => {
                      const newGlow: GlowEffect = {
                        ...textSet.glow!,
                        color: value,
                      };
                      updateTextSet(textSet.id, { glow: newGlow });
                    }}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Glow Intensity
                    </Label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {textSet.glow.intensity}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={50}
                    value={[textSet.glow.intensity]}
                    onValueChange={([value]) => {
                      const newGlow: GlowEffect = {
                        ...textSet.glow!,
                        intensity: value,
                      };
                      updateTextSet(textSet.id, { glow: newGlow });
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={() => removeTextSet(textSet.id)}
            className="w-full p-2 mt-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20"
          >
            Delete Layer
          </button>
        </div>
      ))}
    </div>
  );
}
