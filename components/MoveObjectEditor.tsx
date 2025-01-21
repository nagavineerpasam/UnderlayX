    'use client';

import { useEditor } from '@/hooks/useEditor';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';

export function MoveObjectEditor() {
  const { image, movableObject, updateMovableObject, handleObjectSegmentation, isProcessing } = useEditor();
  const [isMoveEnabled, setIsMoveEnabled] = useState(false);

  const handleEnableMove = async () => {
    if (!image.original) return;

    // Convert base64 back to File object
    const response = await fetch(image.original);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    await handleObjectSegmentation(file);
    setIsMoveEnabled(true);
  };

  if (!isMoveEnabled) {
    return (
      <div className="p-4 flex flex-col items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="enable-move"
            disabled={isProcessing}
            onCheckedChange={(checked) => {
              if (checked) handleEnableMove();
            }}
          />
          <Label htmlFor="enable-move" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable Move Feature
          </Label>
        </div>
        <p className="text-center text-gray-500 text-xs">
          Note: Enabling this feature will process your image to allow object movement
        </p>
      </div>
    );
  }

  if (!movableObject.url && image.original) {
    return (
      <div className="p-4 flex flex-col items-center gap-4">
        <p className="text-center text-gray-500">
          Processing your image...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Position X</Label>
        <Slider
          value={[movableObject.position.x]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([x]) => updateMovableObject({
            position: { ...movableObject.position, x }
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Position Y</Label>
        <Slider
          value={[movableObject.position.y]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([y]) => updateMovableObject({
            position: { ...movableObject.position, y }
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Scale</Label>
        <Slider
          value={[movableObject.scale]}
          min={50}
          max={150}
          step={1}
          onValueChange={([value]) => updateMovableObject({ scale: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Rotation</Label>
        <Slider
          value={[movableObject.rotation]}
          min={-180}
          max={180}
          step={1}
          onValueChange={([value]) => updateMovableObject({ rotation: value })}
        />
      </div>
    </div>
  );
}
