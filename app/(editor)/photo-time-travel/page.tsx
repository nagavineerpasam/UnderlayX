"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, RotateCcw, Sparkles, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PhotoTimeTravel() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [timeValue, setTimeValue] = useState(12); // 0-23 (24-hour format, default 12 PM)
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert time value to readable format - 100% accurate
  const getTimeDisplay = (value: number) => {
    const hour = value;
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  // Get time period based on value - 100% accurate time mapping
  const getTimePeriod = (value: number) => {
    // Handle 24-hour format properly
    if (value >= 0 && value < 6) return "night"; // 12 AM - 6 AM: Night
    if (value >= 6 && value < 9) return "dawn"; // 6 AM - 9 AM: Dawn
    if (value >= 9 && value < 12) return "morning"; // 9 AM - 12 PM: Morning
    if (value >= 12 && value < 15) return "noon"; // 12 PM - 3 PM: Noon
    if (value >= 15 && value < 18) return "afternoon"; // 3 PM - 6 PM: Afternoon
    if (value >= 18 && value < 21) return "evening"; // 6 PM - 9 PM: Evening
    if (value >= 21 && value <= 23) return "night"; // 9 PM - 12 AM: Night
    return "morning"; // Fallback
  };

  // Get appropriate icon based on time
  const getTimeIcon = (value: number) => {
    const period = getTimePeriod(value);
    if (period === "night" || period === "dawn") {
      return <Moon className="w-6 h-6" />;
    }
    return <Sun className="w-6 h-6" />;
  };

  useEffect(() => {
    if (image) {
      applyTimeEffect();
    }
  }, [image, timeValue, showStars]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setIsProcessing(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const applyTimeEffect = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to fit within the container while maintaining aspect ratio
    const containerMaxWidth = 800; // Max width for the preview container
    const containerMaxHeight = 600; // Max height for the preview container
    let width = image.width;
    let height = image.height;

    // Calculate scale to fit within container while maintaining aspect ratio
    const scaleX = containerMaxWidth / width;
    const scaleY = containerMaxHeight / height;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

    width = width * scale;
    height = height * scale;

    canvas.width = width;
    canvas.height = height;

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw original image
    ctx.drawImage(image, 0, 0, width, height);

    // Get image data for pixel manipulation
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Apply time-specific effects based on precise time value
    const timePeriod = getTimePeriod(timeValue);
    applyPreciseTimeEffect(data, ctx, width, height, timeValue, timePeriod);

    ctx.putImageData(imageData, 0, 0);

    // Apply gradient overlays
    applyGradientOverlay(ctx, width, height, timeValue, timePeriod);
  };

  const applyPreciseTimeEffect = (
    data: Uint8ClampedArray,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeValue: number,
    timePeriod: string
  ) => {
    // Calculate precise time-based parameters for 24-hour format
    const timeProgress = timeValue / 23; // 0 to 1 from 12 AM to 11 PM
    const normalizedTime = Math.max(0, Math.min(1, timeProgress));

    // Calculate sun position (0 = below horizon, 1 = zenith)
    const sunPosition = Math.sin(normalizedTime * Math.PI);

    // Calculate temperature (cooler at night, warmer during day)
    const temperature = 0.3 + 0.7 * sunPosition;

    // Calculate brightness multiplier - more realistic for different times
    let brightness = 1;
    if (timeValue >= 6 && timeValue < 9) {
      brightness = 0.6 + 0.4 * ((timeValue - 6) / 3); // Dawn: gradually brightening
    } else if (timeValue >= 9 && timeValue < 15) {
      brightness = 1; // Morning to noon: full brightness
    } else if (timeValue >= 15 && timeValue < 18) {
      brightness = 0.9; // Afternoon: slightly dimmer
    } else if (timeValue >= 18 && timeValue < 21) {
      brightness = 0.5; // Evening: much dimmer for true 8 PM
    } else {
      brightness = 0.3; // Night: very dim
    }

    // Calculate contrast multiplier - more realistic
    let contrast = 1;
    if (timeValue >= 12 && timeValue < 15) {
      contrast = 1.2; // Noon: high contrast
    } else if (timeValue >= 6 && timeValue < 12) {
      contrast = 1.1; // Morning: good contrast
    } else if (timeValue >= 15 && timeValue < 18) {
      contrast = 1.0; // Afternoon: normal contrast
    } else if (timeValue >= 18 && timeValue < 21) {
      contrast = 0.9; // Evening: softer contrast
    } else {
      contrast = 0.7; // Night: low contrast
    }

    // Calculate color temperature shifts - more accurate for 24-hour cycle
    let warmShift = 0;
    let coolShift = 0;

    if (timeValue >= 6 && timeValue < 12) {
      // Morning: gradually warming up
      warmShift = (timeValue - 6) / 6;
      coolShift = 1 - warmShift;
    } else if (timeValue >= 12 && timeValue < 15) {
      // Noon: peak warmth
      warmShift = 1;
      coolShift = 0;
    } else if (timeValue >= 15 && timeValue < 18) {
      // Afternoon: still warm but less intense
      warmShift = 0.7;
      coolShift = 0.3;
    } else if (timeValue >= 18 && timeValue < 21) {
      // Evening: more cool tones for true 8 PM
      warmShift = 0.2;
      coolShift = 0.8;
    } else {
      // Night and dawn: cool tones
      warmShift = 0;
      coolShift = 1;
    }

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      r *= brightness;
      g *= brightness;
      b *= brightness;

      // Apply color temperature
      if (warmShift > 0) {
        r = r * (1 + warmShift * 0.3);
        g = g * (1 + warmShift * 0.1);
        b = b * (1 - warmShift * 0.2);
      }

      if (coolShift > 0) {
        r = r * (1 - coolShift * 0.2);
        g = g * (1 + coolShift * 0.1);
        b = b * (1 + coolShift * 0.3);
      }

      // Apply contrast
      r = (r - 128) * contrast + 128;
      g = (g - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;

      // Apply time-specific adjustments
      if (timePeriod === "dawn") {
        // Soft, cool morning light
        r = r * 0.9 + 20;
        g = g * 1.1 + 15;
        b = b * 1.2 + 25;
      } else if (timePeriod === "morning") {
        // Fresh, bright morning light
        r = r * 1.05 + 10;
        g = g * 1.1 + 15;
        b = b * 1.15 + 20;
      } else if (timePeriod === "noon") {
        // Harsh, bright midday light
        r = r * 1.2 + 30;
        g = g * 1.15 + 20;
        b = b * 1.05 + 5;
      } else if (timePeriod === "afternoon") {
        // Natural afternoon light - not too warm, more balanced
        r = r * 1.08 + 15;
        g = g * 1.05 + 10;
        b = b * 1.02 + 5;
      } else if (timePeriod === "evening") {
        // True 8 PM evening - darker, more purple/blue tones
        r = r * 0.95 + 10;
        g = g * 0.9 + 5;
        b = b * 1.1 + 15;
      } else if (timePeriod === "night") {
        // Cool, dark night light
        r = r * 0.4 - 20;
        g = g * 0.45 - 10;
        b = b * 0.7 + 20;
      }

      // Ensure minimum visibility for night
      if (timePeriod === "night") {
        const minVisibility = 15;
        r = Math.max(minVisibility, r);
        g = Math.max(minVisibility, g);
        b = Math.max(minVisibility + 20, b);
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, Math.round(r)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    }
  };

  const applyGradientOverlay = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeValue: number,
    timePeriod: string
  ) => {
    ctx.globalCompositeOperation = "overlay";

    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    // Calculate precise gradient based on time for 24-hour format
    const timeProgress = timeValue / 23;
    const normalizedTime = Math.max(0, Math.min(1, timeProgress));
    const sunPosition = Math.sin(normalizedTime * Math.PI);

    if (timePeriod === "dawn") {
      gradient.addColorStop(0, "rgba(255, 240, 180, 0.4)");
      gradient.addColorStop(0.3, "rgba(200, 220, 255, 0.3)");
      gradient.addColorStop(0.7, "rgba(150, 200, 255, 0.2)");
      gradient.addColorStop(1, "rgba(100, 150, 200, 0.1)");
    } else if (timePeriod === "morning") {
      gradient.addColorStop(0, "rgba(255, 250, 200, 0.3)");
      gradient.addColorStop(0.5, "rgba(200, 230, 255, 0.2)");
      gradient.addColorStop(1, "rgba(150, 200, 255, 0.1)");
    } else if (timePeriod === "noon") {
      gradient.addColorStop(0, "rgba(255, 255, 220, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
    } else if (timePeriod === "afternoon") {
      // Natural afternoon - subtle warm tones, not Mexican orange
      gradient.addColorStop(0, "rgba(255, 245, 220, 0.2)");
      gradient.addColorStop(0.5, "rgba(255, 240, 200, 0.15)");
      gradient.addColorStop(1, "rgba(255, 235, 180, 0.1)");
    } else if (timePeriod === "evening") {
      // True 8 PM evening - darker sky with purple/blue tones
      gradient.addColorStop(0, "rgba(80, 60, 120, 0.4)");
      gradient.addColorStop(0.3, "rgba(60, 80, 140, 0.3)");
      gradient.addColorStop(0.7, "rgba(40, 60, 100, 0.25)");
      gradient.addColorStop(1, "rgba(20, 30, 60, 0.2)");
    } else if (timePeriod === "night") {
      gradient.addColorStop(0, "rgba(50, 50, 150, 0.6)");
      gradient.addColorStop(0.3, "rgba(25, 25, 100, 0.5)");
      gradient.addColorStop(0.7, "rgba(10, 10, 50, 0.4)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");

      // Add stars for night only if enabled
      if (showStars) {
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * (height * 0.4);
          const size = Math.random() * 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "overlay";
      }
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      // Create a high-resolution canvas for better quality
      const originalCanvas = canvasRef.current;
      const scaleFactor = 2; // 2x resolution for better quality

      const highResCanvas = document.createElement("canvas");
      const highResCtx = highResCanvas.getContext("2d");
      if (!highResCtx) return;

      // Set high resolution dimensions
      highResCanvas.width = originalCanvas.width * scaleFactor;
      highResCanvas.height = originalCanvas.height * scaleFactor;

      // Enable high-quality rendering for the high-res canvas
      highResCtx.imageSmoothingEnabled = true;
      highResCtx.imageSmoothingQuality = "high";

      // Scale up the context for crisp rendering
      highResCtx.scale(scaleFactor, scaleFactor);

      // Draw the original canvas onto the high-res canvas
      highResCtx.drawImage(originalCanvas, 0, 0);

      // Convert to blob with maximum PNG quality
      highResCanvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `photo-${getTimeDisplay(timeValue).replace(
            /[:\s]/g,
            "-"
          )}-${Date.now()}.png`;
          link.href = url;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();

          // Cleanup after a short delay
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 1000);
        },
        "image/png",
        1.0 // Maximum PNG quality
      );
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to download image. Please try again.");
    }
  };

  const resetEditor = () => {
    setImage(null);
    setTimeValue(12); // 12 PM (noon) as default
    setShowStars(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Header */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-white/10 sticky top-0 z-40">
          <div className="px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="text-xl font-light tracking-wide text-slate-800 dark:text-white hover:opacity-70 transition-opacity"
              >
                UnderlayX
              </a>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
              <h1 className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wider uppercase">
                Photo Time Travel
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {!image ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">
                  Transform Through Time
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-light text-lg max-w-md mx-auto">
                  Upload a photo and experience it across different times of day
                </p>
              </div>

              <div
                className={cn(
                  "group border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all duration-300 w-full max-w-2xl",
                  isDragging
                    ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-zinc-900/50 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:scale-[1.01]"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-20 h-20 mx-auto mb-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                <p className="text-xl font-light text-slate-700 dark:text-slate-300 mb-2">
                  Drop your image here
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
                  JPG, PNG, and other formats supported
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)]">
              {/* Image Preview - Takes up 2/3 of the space */}
              <div className="lg:col-span-2 flex flex-col h-full">
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-white/10 flex-1 flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
                  />
                </div>
              </div>

              {/* Controls - Takes up 1/3 of the space */}
              <div className="flex flex-col h-full space-y-6">
                {/* Time Slider */}
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                      Time of Day
                    </h3>
                    <div className="flex items-center gap-2">
                      {getTimeIcon(timeValue)}
                      <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {getTimeDisplay(timeValue)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="23"
                        value={timeValue}
                        onChange={(e) => setTimeValue(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                            (timeValue / 23) * 100
                          }%, #e2e8f0 ${
                            (timeValue / 23) * 100
                          }%, #e2e8f0 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                        {getTimePeriod(timeValue)} Light
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stars Option for Night */}
                {getTimePeriod(timeValue) === "night" && (
                  <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Add Stars
                        </span>
                      </div>
                      <button
                        onClick={() => setShowStars(!showStars)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all duration-200",
                          showStars
                            ? "bg-blue-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200",
                            showStars ? "translate-x-6" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="w-full bg-slate-800 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white dark:text-slate-900 font-medium py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 hover:scale-105 disabled:scale-100"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </button>
                  <button
                    onClick={resetEditor}
                    className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Upload New
                  </button>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 flex items-center gap-4 shadow-2xl">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300"></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Processing image...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
