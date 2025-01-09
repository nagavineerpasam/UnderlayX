'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { useEditor } from '@/hooks/useEditor';
import { Loader2, RotateCcw, Download, Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BackgroundUpload } from './BackgroundUpload';
import { ForegroundControls } from './ForegroundControls';

export function ImageEditor() {
  const { 
    image, 
    isProcessing, 
    isDownloading, 
    downloadImage, 
    resetEditor,
    isConverting 
  } = useEditor();

  // Add check for fully processed image
  const isImageReady = image.original && image.foreground && !isProcessing && !isConverting;

  // Prevent right-click on canvas
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Add this helper component for responsive buttons
  const ActionButton = ({ icon: Icon, label, ...props }) => (
    <button
      {...props}
      className="px-3 lg:px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 h-[42px]"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );

  // Update the DownloadButton component
  const DownloadButton = () => (
    <ActionButton
      icon={Download}
      label="Download"
      onClick={downloadImage}
      disabled={!isImageReady || isDownloading}
    />
  );

  return (
    <div className="relative h-[calc(100vh-100px)]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex flex-col h-[55vh]">
          {/* <h2 className="text-gray-800 dark:text-white/80 font-medium text-xs mb-2">Preview</h2> */}
          <div className="relative bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden flex-1" onContextMenu={handleContextMenu}>
            <Canvas />
          </div>
          {/* Only show buttons when image is ready */}
          {image.original && (
            <div className={cn(
              "flex flex-col gap-4",
              !isImageReady && "opacity-50 pointer-events-none"
            )}>
              {isImageReady && (
                <>
                  {/* Mobile Layout Controls */}
                  <div className="flex gap-2 w-full overflow-hidden">
                    <div className="flex-1">
                      <label
                        htmlFor="background-upload"
                        className="px-3 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 h-[42px] cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </label>
                    </div>
                    <div className="flex-1">
                      <DownloadButton />
                    </div>
                    <ActionButton
                      icon={RotateCcw}
                      label="Reset"
                      onClick={() => resetEditor(false)}
                      disabled={!isImageReady || isDownloading}
                      className="flex-1"
                    />
                  </div>

                  {/* Foreground Controls in a separate row */}
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                    <ForegroundControls />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="p-4"> {/* Add padding wrapper */}
              <EditorTools />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full lg:mr-[500px]">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1">
              <div className="relative h-[calc(100%-50px)] bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_rgba(0,0,0,0.3)] overflow-hidden" onContextMenu={handleContextMenu}>
                <Canvas />
              </div>
            </div>
            {/* Only show buttons when image is ready */}
            {image.original && (
              <div className={cn(
                "flex flex-col gap-4",
                !isImageReady && "opacity-50 pointer-events-none"
              )}>
                {isImageReady && (
                  <>
                    {/* Desktop Layout Controls */}
                    <div className="hidden lg:flex gap-3">
                      <div className="flex-1">
                        <BackgroundUpload />
                      </div>
                      <div className="flex-1">
                        <DownloadButton />
                      </div>
                      <button
                        onClick={() => resetEditor(false)}
                        disabled={!isImageReady || isDownloading}
                        className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 h-[42px] w-[100px]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* Foreground Controls in a separate row */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <ForegroundControls />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="fixed top-[84px] bottom-[20px] right-[20px] w-[480px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="h-full overflow-y-auto no-scrollbar p-4">
            <div className="space-y-4 [&_input]:bg-gray-100 dark:[&_input]:bg-zinc-800 [&_label]:text-gray-700 dark:[&_label]:text-gray-200">
              <EditorTools />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}