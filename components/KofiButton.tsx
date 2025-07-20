"use client";

import { Coffee } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface KofiButtonProps {
  onClick?: () => void;
}

export function KofiButton({ onClick }: KofiButtonProps) {
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (isMobile) {
      // On mobile, redirect to Ko-fi page
      window.open(
        "https://ko-fi.com/I2I819Y9PU",
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      // On desktop, use the provided onClick (opens dialog)
      onClick?.();
    }
  };

  // If onClick is provided, use button, otherwise use link for backwards compatibility
  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center px-1 sm:px-2 hover:opacity-80 transition-opacity"
      >
        <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
          Support
        </span>
      </button>
    );
  }

  return (
    <a
      href="https://ko-fi.com/I2I819Y9PU"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center px-1 sm:px-2"
    >
      <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
        Support
      </span>
    </a>
  );
}
