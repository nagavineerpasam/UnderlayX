'use client';

import { useEditor } from '@/hooks/useEditor';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function ForegroundControls() {
  const { foregroundPosition, updateForegroundPosition, image } = useEditor();

  if (!image.foreground) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Adjust Foreground Position</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-600 dark:text-gray-400">Horizontal</Label>
          <Slider
            min={-200}
            max={200}
            step={5}
            value={[foregroundPosition.x]}
            onValueChange={([value]) => updateForegroundPosition({ ...foregroundPosition, x: value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-gray-600 dark:text-gray-400">Vertical</Label>
          <Slider
            min={-200}
            max={200}
            step={5}
            value={[foregroundPosition.y]}
            onValueChange={([value]) => updateForegroundPosition({ ...foregroundPosition, y: value })}
          />
        </div>
      </div>
    </div>
  );
}
