'use client';

import { useEditor } from '@/hooks/useEditor';
import { Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';

export function BackgroundUpload() {
  const { image, setCustomBackground } = useEditor();
  const isImageProcessed = !!image.foreground;

  useEffect(() => {
    return () => {
      // Check if URL exists before revoking
      const customBg = image.customBackground;
      if (customBg) {
        URL.revokeObjectURL(customBg);
      }
    };
  }, [image.customBackground]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await setCustomBackground(file);
    }
  };

  if (!isImageProcessed) return null;

  return (
    <div className="flex-1">
      <input
        type="file"
        id="background-upload"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="background-upload"
        className="w-full px-3 lg:px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer h-[42px]"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="hidden lg:inline">Change Background</span>
      </label>
    </div>
  );
}
