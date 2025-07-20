"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coffee } from "lucide-react";

interface KofiPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KofiPaymentDialog({ isOpen, onClose }: KofiPaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white justify-center">
            <Coffee className="w-5 h-5 text-purple-600" />
            Support UnderlayX AI
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/vineer/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: "none",
              width: "100%",
              height: "100%",
              minHeight: "400px",
              background: "#f9f9f9",
            }}
            title="Support vineer on Ko-fi"
            className="rounded-md"
          />
        </div>

        <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure payment powered by Ko-fi • Your support helps keep UnderlayX
            free ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
