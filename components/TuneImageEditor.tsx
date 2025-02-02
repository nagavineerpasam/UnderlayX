'use client';

import { Slider } from '@/components/ui/slider';
import { useEditor } from '@/hooks/useEditor';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox'; // Add this import

export function TuneImageEditor() {
  const { 
    imageEnhancements, 
    updateImageEnhancements,
    applyToBackground,
    applyToForeground,
    setApplyToBackground,
    setApplyToForeground 
  } = useEditor();

  const resetEnhancements = () => {
    updateImageEnhancements({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      fade: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      sharpness: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Image Adjustments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetEnhancements}
          className="h-8 px-2"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex items-center space-x-4 border-b pb-4 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="apply-bg"
            checked={applyToBackground}
            onCheckedChange={(checked) => setApplyToBackground(checked as boolean)}
          />
          <label 
            htmlFor="apply-bg" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Apply to Background
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="apply-fg"
            checked={applyToForeground}
            onCheckedChange={(checked) => setApplyToForeground(checked as boolean)}
          />
          <label 
            htmlFor="apply-fg" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Apply to Foreground
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            value={[imageEnhancements.brightness]}
            onValueChange={([value]) =>
              updateImageEnhancements({
                ...imageEnhancements,
                brightness: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">
            {imageEnhancements.brightness}%
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            value={[imageEnhancements.contrast]}
            onValueChange={([value]) =>
              updateImageEnhancements({
                ...imageEnhancements,
                contrast: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">
            {imageEnhancements.contrast}%
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            value={[imageEnhancements.saturation]}
            onValueChange={([value]) =>
              updateImageEnhancements({
                ...imageEnhancements,
                saturation: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">
            {imageEnhancements.saturation}%
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fade</label>
          <Slider
            value={[imageEnhancements.fade]}
            onValueChange={([value]) =>
              updateImageEnhancements({
                ...imageEnhancements,
                fade: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-gray-500">
            {imageEnhancements.fade}%
          </div>
        </div>
      </div>
    </div>
  );
}
