'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useEditor } from '@/hooks/useEditor';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'foreground' | 'background';

const defaultEnhancements = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  fade: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0,    // Add default value
  blacks: 0   // Add default value
} as const;

export function TuneImageEditor() {
  const [activeTab, setActiveTab] = useState<TabType>('background');
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
    const enhancements = type === 'foreground' ? foregroundEnhancements : backgroundEnhancements;
    const updateEnhancements = type === 'foreground' ? updateForegroundEnhancements : updateBackgroundEnhancements;

    return (
      <div className="space-y-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            value={[enhancements.brightness]}
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                brightness: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">{enhancements.brightness}%</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            value={[enhancements.contrast]}
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                contrast: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">{enhancements.contrast}%</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            value={[enhancements.saturation]}
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                saturation: value,
              })
            }
            min={0}
            max={200}
            step={1}
          />
          <div className="text-xs text-gray-500">{enhancements.saturation}%</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fade</label>
          <Slider
            value={[enhancements.fade]}
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                fade: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-gray-500">{enhancements.fade}%</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blur</label>
          <Slider
            value={[enhancements.blur || 0]} // Add null check
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                blur: value,
              })
            }
            min={0}
            max={20}
            step={0.1}
          />
          <div className="text-xs text-gray-500">{(enhancements.blur || 0).toFixed(1)}px</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blacks</label>
          <Slider
            value={[enhancements.blacks || 0]} // Add null check
            onValueChange={([value]) =>
              updateEnhancements({
                ...enhancements,
                blacks: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-gray-500">{enhancements.blacks || 0}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Image Adjustments</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex space-x-2 border-b dark:border-white/10">
        <button
          onClick={() => setActiveTab('background')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'background'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          )}
        >
          Background
        </button>
        <button
          onClick={() => setActiveTab('foreground')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'foreground'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          )}
        >
          Foreground
        </button>
      </div>

      <div className="pt-2">
        {renderEnhancementControls(activeTab)}
      </div>
    </div>
  );
}
