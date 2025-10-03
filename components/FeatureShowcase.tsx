"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Add Images Behind Main Image",
    beforeImage: "/personbefore.jpg",
    afterImage: "/personafter.jpg",
    beforeAlt: "Original image without logos",
    afterAlt: "Image with logos added behind",
  },
  {
    title: "Add Text Behind Image",
    beforeImage: "/povbefore.jpg",
    afterImage: "/povafter.jpg",
    beforeAlt: "Original image without text",
    afterAlt: "Image with text added behind",
  },
  {
    title: "Remove & Customize Background",
    beforeImage: "/shirtbefore.jpg",
    afterImage: "/shirtafter.jpg",
    beforeAlt: "Original image with background",
    afterAlt: "Image with customized background",
  },
  {
    title: "Add Logos Behind Image",
    beforeImage: "/socialbefore.jpg",
    afterImage: "/socialafter.jpg",
    beforeAlt: "Original image without logos",
    afterAlt: "Image with logos added behind",
  },
  {
    title: "Clone Objects in Image",
    beforeImage: "/applebefore.jpg",
    afterImage: "/appleafter.jpeg",
    beforeAlt: "Original image without cloning",
    afterAlt: "Image with cloned objects",
  },
  {
    title: "Draw Behind Images in Your Photos",
    beforeImage: "/drawbefore.jpg",
    afterImage: "/drawafter.jpeg",
    beforeAlt: "Original main image",
    afterAlt: "Main image with background drawings",
  },
];

interface FeatureShowcaseProps {
  compact?: boolean;
  limited?: boolean; // Add this prop
}

export function FeatureShowcase({
  compact = false,
  limited = false,
}: FeatureShowcaseProps) {
  // Only take first 3 features if limited is true
  const displayFeatures = limited ? features.slice(0, 3) : features;

  return (
    <section
      className={cn("py-1", !compact && "py-8 px-4")}
      aria-label="Feature examples"
    >
      <div className={cn("mx-auto", !compact && "max-w-7xl")}>
        <div
          className={cn(
            "grid gap-3",
            compact
              ? "grid-cols-3" // Always 3 columns for compact mode
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          )}
        >
          {displayFeatures.map((feature, index) => (
            <ComparisonSlider
              key={index}
              beforeImage={feature.beforeImage}
              afterImage={feature.afterImage}
              beforeAlt={feature.beforeAlt}
              afterAlt={feature.afterAlt}
              title={feature.title}
              compact={compact}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  title,
  compact = false,
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isResizing || !containerRef.current) return;

    event.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in event ? event.touches[0].clientX : event.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    requestAnimationFrame(() => {
      setPosition(Math.min(Math.max(position, 0), 100));
    });
  };

  useEffect(() => {
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMove, { passive: false });
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      document.body.style.userSelect = "";
    }

    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="space-y-1">
      {" "}
      {/* Reduced spacing */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full rounded-md overflow-hidden cursor-col-resize select-none", // Removed border
          compact
            ? "aspect-[3/2]" // Changed aspect ratio to be wider than tall
            : "aspect-[3/4]"
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      >
        <div className="absolute inset-0 will-change-transform">
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-0 will-change-transform"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            draggable={false}
          />
        </div>
        <div className="absolute inset-y-0" style={{ left: `${position}%` }}>
          <div className="absolute inset-y-0 -ml-px w-1 bg-white/80" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="text-gray-600 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p
        className={cn(
          "text-center text-gray-900 dark:text-gray-400 font-medium",
          compact
            ? "text-[8px] truncate" // Even smaller text and ensure it doesn't wrap
            : "text-sm"
        )}
      >
        {title}
      </p>
    </div>
  );
}
