"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay: {
      draw: (userId: string, options: any) => void;
    };
  }
}

export function KofiFloatingWidget() {
  useEffect(() => {
    // Load Ko-fi script
    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.async = true;

    script.onload = () => {
      // Initialize the Ko-fi widget after script loads
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw("vineer", {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Support Us",
          "floating-chat.donateButton.background-color": "#8b5cf6", // Purple to match your theme
          "floating-chat.donateButton.text-color": "#fff",
        });
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const existingScript = document.querySelector(
        'script[src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Hide the Ko-fi widget if it exists
      const kofiWidget = document.querySelector("#kofi-overlay-container");
      if (kofiWidget) {
        (kofiWidget as HTMLElement).style.display = "none";
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
}
