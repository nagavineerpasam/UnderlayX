"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Check, Zap, Users, Shield } from "lucide-react";

interface TransformationPageProps {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}

export function TransformationPage({
  title,
  description,
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: TransformationPageProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const bgColor = theme === "dark" ? "bg-[#0A0A0A]" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textColorMuted = theme === "dark" ? "text-white/70" : "text-gray-600";

  // Dynamic content based on the tool type
  const getToolSpecificContent = () => {
    if (title.includes("Text Behind")) {
      return {
        features: [
          "Add text behind any object in your image",
          "Professional text behind image effects",
          "Customizable fonts, colors, and styles",
          "Works with any image format",
          "Real-time preview and editing",
        ],
        howTo: [
          "Upload your image to our free text behind image editor",
          "Add your desired text and position it",
          "Our AI automatically detects objects and places text behind them",
          "Customize text style, color, and effects",
          "Download your transformed image instantly",
        ],
      };
    } else if (title.includes("Remove Background")) {
      return {
        features: [
          "AI-powered background removal technology",
          "Precise edge detection for clean cutouts",
          "Works with portraits, products, and objects",
          "Create transparent PNG images",
          "Batch processing for multiple images",
        ],
        howTo: [
          "Upload your image to our free background remover",
          "Our AI automatically detects the subject",
          "Remove background with one click",
          "Fine-tune edges if needed",
          "Download as PNG with transparent background",
        ],
      };
    } else if (title.includes("Change Background")) {
      return {
        features: [
          "Replace backgrounds with AI precision",
          "Customize background colors and patterns",
          "Professional background replacement",
          "Blend subjects naturally with new backgrounds",
          "Library of preset backgrounds",
        ],
        howTo: [
          "Upload your image to our background changer",
          "Choose a new background or upload your own",
          "Our AI seamlessly replaces the old background",
          "Adjust colors and lighting for perfect blend",
          "Download your customized image",
        ],
      };
    }
    return {
      features: [
        "Professional AI-powered image editing",
        "Easy-to-use interface",
        "High-quality results",
        "Multiple format support",
        "Real-time processing",
      ],
      howTo: [
        "Upload your image",
        "Apply transformations",
        "Preview results",
        "Download edited image",
      ],
    };
  };

  const toolContent = getToolSpecificContent();

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col p-4`}>
      <nav className="w-full max-w-7xl mx-auto py-2 md:py-4">
        <Link
          href="/"
          className={cn(
            "text-xl font-bold text-purple-600",
            "hover:opacity-80 transition-opacity"
          )}
        >
          UnderlayX AI
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center pt-4 md:pt-0">
        <h1
          className={cn("text-4xl md:text-5xl font-bold mb-4 text-purple-600")}
        >
          {title}
        </h1>

        <p className={`${textColorMuted} text-lg mb-8 max-w-2xl`}>
          {description}
        </p>

        <div className="space-y-4 mb-12">
          <button
            onClick={() => router.push("/custom-editor")}
            className={cn(
              "px-8 py-3 text-xl font-semibold text-white",
              "bg-purple-600 hover:bg-purple-700",
              "rounded-lg shadow-lg",
              "transform transition-all duration-200",
              "hover:scale-105 hover:shadow-xl",
              "active:scale-95"
            )}
          >
            Create now
          </button>
        </div>

        {/* Before/After Images */}
        <div className="flex items-center gap-8 mb-16">
          <div className="text-center">
            <Image
              src={beforeImage}
              alt={beforeAlt}
              width={250}
              height={333}
              className="rounded-lg shadow-lg"
              priority
            />
            <p className={`${textColorMuted} mt-2 font-medium text-sm`}>
              Original Image
            </p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-500"
          >
            <path d="M14 9l6 6-6 6" />
            <path d="M4 4v7a4 4 0 0 0 4 4h11" />
          </svg>

          <div className="text-center">
            <Image
              src={afterImage}
              alt={afterAlt}
              width={250}
              height={333}
              className="rounded-lg shadow-lg"
              priority
            />
            <p className={`${textColorMuted} mt-2 font-medium text-sm`}>
              Transformed Image
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-3xl mb-16">
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {toolContent.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className={`${textColorMuted} text-sm`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-3xl mb-16">
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            How It Works
          </h2>
          <div className="space-y-4">
            {toolContent.howTo.map((step, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className={`${textColorMuted} text-sm`}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="w-full max-w-3xl mb-16">
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            Why Choose UnderlayX AI?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-purple-600 mt-1" />
              <div className="text-left">
                <h3 className={`font-semibold ${textColor} mb-1`}>
                  Lightning Fast
                </h3>
                <p className={`${textColorMuted} text-sm`}>
                  Process images in seconds with our optimized AI algorithms
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-purple-600 mt-1" />
              <div className="text-left">
                <h3 className={`font-semibold ${textColor} mb-1`}>
                  Privacy First
                </h3>
                <p className={`${textColorMuted} text-sm`}>
                  Your images are processed securely and never stored
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-purple-600 mt-1" />
              <div className="text-left">
                <h3 className={`font-semibold ${textColor} mb-1`}>
                  Professional Quality
                </h3>
                <p className={`${textColorMuted} text-sm`}>
                  AI-powered results that match expensive software
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push("/custom-editor")}
            className={cn(
              "px-8 py-3 text-xl font-semibold text-white",
              "bg-gradient-to-r from-purple-600 to-pink-600",
              "hover:from-purple-700 hover:to-pink-700",
              "rounded-lg shadow-lg",
              "transform transition-all duration-200",
              "hover:scale-105 hover:shadow-xl",
              "active:scale-95"
            )}
          >
            Start Editing Now - It's Free!
          </button>
        </div>
      </main>
    </div>
  );
}
