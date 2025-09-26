"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "@/components/ui/button";

export function RemoveBackgroundEditor() {
  const { removeBackground, resetBackground, hasTransparentBackground } =
    useEditor();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        ✂️ Cut out your subject from the background with AI precision!
      </p>
      <div className="space-y-2">
        <Button
          onClick={removeBackground}
          className="w-full"
          variant={hasTransparentBackground ? "secondary" : "default"}
        >
          {hasTransparentBackground
            ? "✅ Background Removed!"
            : "✂️ Cut Out Background"}
        </Button>
        <Button
          onClick={resetBackground}
          variant="outline"
          className="w-full"
          disabled={!hasTransparentBackground}
        >
          🔄 Put Background Back
        </Button>
      </div>
    </div>
  );
}
