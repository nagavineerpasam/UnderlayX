"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { Pricing } from "@/components/Pricing";
import { useAuth } from "@/hooks/useAuth";
import {
  ImageOff,
  Layers,
  Settings as Adjustments,
  Layout as Overlay,
  Type,
  Star as Sticker,
  Square as Shapes,
  Copy,
  Wand2 as Wand,
  SlidersHorizontal as Filter,
  Download,
  Eye,
  Image,
  PaintBucket as Paint,
} from "lucide-react";

const tools = [
  { Icon: ImageOff, name: "Remove Background" },
  { Icon: Layers, name: "Customize Background" },
  { Icon: Adjustments, name: "Tune Image" },
  { Icon: Overlay, name: "Overlay Images" },
  { Icon: Type, name: "Add Text Behind" },
  { Icon: Sticker, name: "Add Logo Behind" },
  { Icon: Shapes, name: "Add Shapes" },
  { Icon: Copy, name: "Image Clone" },
  { Icon: Wand, name: "AI Detection" },
  { Icon: Filter, name: "Apply Effects" },
  { Icon: Download, name: "Export HD" },
  { Icon: Eye, name: "Toggle Overlays" },
  { Icon: Paint, name: "Object Outline" },
  { Icon: Image, name: "Image Enhance" },
];

const FeatureCard = ({ tool: { Icon, name } }) => (
  <div
    className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl backdrop-blur-sm 
      transform transition-all duration-200 
      hover:bg-gray-900/70 hover:scale-105 
      hover:shadow-lg hover:shadow-purple-500/20
      group"
  >
    <Icon className="w-5 h-5 mb-2 text-purple-500 
      transition-transform duration-200 
      group-hover:scale-110 
      group-hover:text-purple-400" 
    />
    <span className="text-xs text-gray-300 text-center
      transition-colors duration-200
      group-hover:text-white"
    >
      {name}
    </span>
  </div>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const { user } = useAuth();

  useEffect(() => {
    if (section === "pricing") {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [section]);

  return (
    <div
      className="min-h-screen relative flex flex-col"
      role="region"
      aria-label="Home page content"
    >
      {/* Simplified Gradient Background */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0A0A0A] to-[#0A0A0A]" />
      </div>

      {/* Content Container */}
      <div ref={scrollRef} className="relative z-10 flex-grow">
        <Navbar />

        <main 
          className="pt-16 md:pt-10 w-full h-[100dvh]" // Add h-[100dvh] for dynamic viewport height
          role="main" 
          aria-label="Main content"
        >
          {/* Hero Section */}
          <section className="w-full px-4 h-full flex flex-col justify-center">
            <div className="max-w-4xl mx-auto text-center w-full">
              {/* Adjust spacing for mobile */}
              <p className="text-gray-400 mb-4 md:mb-6">
                50+ Powerful Image Editing Tools in One App
              </p>
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                One Powerful Tool for
                <br />
                Effortless Image Editing
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Everything you need to remove backgrounds, edit photos, and
                magically place text and logos behind objects—fast and easy.
              </p>

              {/* Create Now Button */}
              <div className="flex justify-center mb-8 md:mb-12">
                <Link
                  href="/custom-editor"
                  onClick={() => setIsLoading(true)}
                  className="inline-flex items-center px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xl font-semibold transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Now"
                  )}
                </Link>
              </div>

              {/* Static Functionality Grid / Mobile Carousel */}
              <div className="w-full max-w-5xl mx-auto -mx-4 md:mx-0">
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 px-4">
                  {tools.map((tool, index) => (
                    <FeatureCard key={index} tool={tool} />
                  ))}
                </div>

                {/* Mobile Carousel - Adjusted for better vertical positioning */}
                <div className="md:hidden w-full overflow-hidden">
                  <div 
                    className="flex animate-carousel px-4"
                    style={{
                      width: 'max-content',
                      animationDuration: '30s',
                    }}
                  >
                    {/* First set */}
                    {tools.map((tool, index) => (
                      <div key={index} className="w-[140px] flex-none mx-1.5"> {/* Reduced size and margin */}
                        <FeatureCard tool={tool} />
                      </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {tools.map((tool, index) => (
                      <div key={`dup-${index}`} className="w-[140px] flex-none mx-1.5">
                        <FeatureCard tool={tool} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Move other sections outside of the 100vh container */}
          <div className="relative">
            {/* Feature Showcase Section */}
            <section className="px-4 py-16 md:py-24">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Unlimited Possibilities
                </h2>
                <p className="text-gray-400 text-base md:text-lg">
                  Create stunning visuals with our powerful editing tools
                </p>
              </div>
              <FeatureShowcase />
            </section>

            <Features />
            <UseCases />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
