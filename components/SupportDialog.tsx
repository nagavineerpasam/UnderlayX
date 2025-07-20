import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, X, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKofiPayment: () => void;
}

const SUPPORT_DIALOG_KEY = "supportDialog";
const SUPPORT_DIALOG_TIMESTAMP_KEY = "supportDialogTimestamp";
const ALREADY_DONATED_KEY = "alreadyDonated";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export function SupportDialog({
  isOpen,
  onClose,
  onOpenKofiPayment,
}: SupportDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [alreadyDonated, setAlreadyDonated] = useState(false);
  const isMobile = useIsMobile();

  const handleSupport = () => {
    // Store preferences if checked
    if (dontShowAgain) {
      localStorage.setItem(SUPPORT_DIALOG_KEY, "true");
      localStorage.setItem(SUPPORT_DIALOG_TIMESTAMP_KEY, Date.now().toString());
    }
    if (alreadyDonated) {
      localStorage.setItem(ALREADY_DONATED_KEY, "true");
    }

    // Close this dialog first
    onClose();

    if (isMobile) {
      // On mobile, redirect to Ko-fi page
      window.open(
        "https://ko-fi.com/I2I819Y9PU",
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      // On desktop, open Ko-fi payment dialog
      onOpenKofiPayment();
    }
  };

  const handleClose = () => {
    // Store preferences if checked
    if (dontShowAgain) {
      localStorage.setItem(SUPPORT_DIALOG_KEY, "true");
      localStorage.setItem(SUPPORT_DIALOG_TIMESTAMP_KEY, Date.now().toString());
    }
    if (alreadyDonated) {
      localStorage.setItem(ALREADY_DONATED_KEY, "true");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
              <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Hey there, amazing creator! 🎨
          </DialogTitle>

          <div className="text-gray-700 dark:text-gray-300 space-y-3 text-sm leading-relaxed">
            <p>
              <strong>I hope you loved your creation!</strong> I decided to make
              UnderlayX completely
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {" "}
                free and open-source
              </span>{" "}
              because I believe creativity should be accessible to everyone.
            </p>

            <p>
              Since there are no ads or premium plans, your support helps me:
            </p>

            <div className="text-left space-y-1 text-xs bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Add exciting new AI features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Keep servers running smoothly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Maintain this tool forever</span>
              </div>
            </div>

            <p className="text-purple-600 dark:text-purple-400 font-medium">
              Even a small tip means the world to me! ☕✨
            </p>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex gap-2">
            <Button
              onClick={handleSupport}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Support This Project
            </Button>

            <Button
              onClick={handleClose}
              variant="outline"
              className="px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Options for dialog preferences */}
          <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Checkbox
                id="alreadyDonated"
                checked={alreadyDonated}
                onCheckedChange={(checked) =>
                  setAlreadyDonated(checked === true)
                }
                className="w-4 h-4 data-[state=checked]:bg-green-500 border-green-300"
              />
              <label
                htmlFor="alreadyDonated"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none font-medium flex items-center gap-1"
              >
                I have donated already 😊
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="dontShow"
                checked={dontShowAgain}
                onCheckedChange={(checked) =>
                  setDontShowAgain(checked === true)
                }
                className="w-4 h-4 data-[state=checked]:bg-gray-500 border-gray-300"
              />
              <label
                htmlFor="dontShow"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
              >
                Don't show for a month
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to check if dialog should be shown
export function shouldShowSupportDialog(): boolean {
  try {
    const alreadyDonated = localStorage.getItem(ALREADY_DONATED_KEY);
    const dontShow = localStorage.getItem(SUPPORT_DIALOG_KEY);
    const timestamp = localStorage.getItem(SUPPORT_DIALOG_TIMESTAMP_KEY);

    // If user marked as already donated, never show dialog again
    if (alreadyDonated === "true") {
      return false;
    }

    if (dontShow !== "true") {
      return true; // Never opted out, always show
    }

    if (!timestamp) {
      return true; // No timestamp, show dialog
    }

    const storedTime = parseInt(timestamp);
    const now = Date.now();
    const timeDiff = now - storedTime;

    return timeDiff > ONE_MONTH_MS; // Show if more than a month has passed
  } catch (error) {
    console.error("Error checking support dialog preference:", error);
    return true; // Default to showing if there's an error
  }
}
