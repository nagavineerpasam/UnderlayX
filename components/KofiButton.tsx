"use client";

import { Coffee } from "lucide-react";

export function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/I2I819Y9PU"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:flex flex-col items-center px-1 sm:px-2"
    >
      <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-[10px] sm:text-xs mt-0.5 text-gray-600 dark:text-gray-400">
        Support
      </span>
    </a>
  );
}
