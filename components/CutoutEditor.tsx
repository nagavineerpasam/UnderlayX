'use client';

import { useEditor } from '@/hooks/useEditor';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function CutoutEditor() {
  const { cutout, setCutoutEnabled, updateCutout } = useEditor();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="cutout-switch">Enable Outline Effect</Label>
        <Switch
          id="cutout-switch"
          checked={cutout.enabled}
          onCheckedChange={setCutoutEnabled}
        />
      </div>

      {cutout.enabled && (
        <>
          <div className="space-y-2">
            <Label>Width</Label>
            <Slider
              value={[cutout.width]}
              onValueChange={([value]) => updateCutout({ width: value })}
              min={1}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Intensity</Label>
            <Slider
              value={[cutout.intensity]}
              onValueChange={([value]) => updateCutout({ intensity: value })}
              min={1}
              max={100}  // Changed from 500 to 100 for better control
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={cutout.color}
                onChange={(e) => updateCutout({ color: e.target.value })}
                className="w-10 h-10 p-1 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
