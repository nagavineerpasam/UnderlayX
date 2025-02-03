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
  Sticker,
  Square as Shapes,
  Copy,
  Wand2 as Wand,
  SlidersHorizontal as Filter,
  Download,
  Eye,
  Image,
} from "lucide-react";

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

        <main className="pt-24" role="main" aria-label="Main content">
          {/* Hero Section */}
          <section className="container mx-auto px-4 min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-400 mb-8">
                50+ Powerful Image Editing Tools in One App
              </p>
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 leading-tight">
                One Powerful Tool for
                <br />
                Effortless Image Editing
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                Everything you need to remove backgrounds, edit photos, and
                magically place text and logos behind objects—fast and easy.
              </p>

              {/* Create Now Button */}
              <div className="flex justify-center mb-16">
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

              {/* Tool Icons Carousel */}
              <div className="relative max-w-5xl mx-auto mb-12">
                {/* Add gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10"></div>

                {/* Carousel container */}
                <div className="overflow-hidden">
                  <div 
                    className="flex animate-[scroll_40s_linear_infinite]"
                    style={{
                      width: 'fit-content',
                      willChange: 'transform'
                    }}
                  >
                    {[...Array(2)].map((_, duplicateIndex) => (
                      <div key={duplicateIndex} className="flex">
                        {[
                          { Icon: ImageOff, name: "Remove Background" },
                          { Icon: Layers, name: "Customize Background" },
                          { Icon: Adjustments, name: "Tune Image" },
                          { Icon: Overlay, name: "Overlay Images" },
                          { Icon: Type, name: "Add Text Behind Objects" },
                          { Icon: Sticker, name: "Add Logo Behind Objects" },
                          { Icon: Shapes, name: "Add Shapes Behind Objects" },
                          { Icon: Copy, name: "Image Clone" },
                          { Icon: Wand, name: "AI Object Detection" },
                          { Icon: Filter, name: "Apply Filters & Effects" },
                          { Icon: Download, name: "Export High-Quality Images" },
                          { Icon: Eye, name: "Toggle Overlays" },
                        ].map((tool, index) => (
                          <div
                            key={`${duplicateIndex}-${index}`}
                            className="flex flex-col items-center p-4 bg-gray-900/50 rounded-xl min-w-[140px] mx-2"
                          >
                            <tool.Icon className="w-6 h-6 mb-2 text-purple-500" />
                            <span className="text-sm text-gray-300 whitespace-nowrap">
                              {tool.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    100,000+
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    Images Generated
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Product Hunt Badges Section */}
          {/* <section className="container mx-auto px-4 mb-10">
            <div className="flex flex-row justify-center items-center gap-4">
              {[
                {
                  href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
                  src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=44"
                },
                {
                  href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-underlayx",
                  src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=739682&theme=light&period=daily"
                },
                {
                  href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
                  src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=164"
                }
              ].map((badge, index) => (
                <a 
                  key={index}
                  href={badge.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img
                    src={badge.src}
                    alt="UnderlayX - Product Hunt Badge"
                    width={150}
                    height={32}
                    className="h-18 w-auto"
                  />
                </a>
              ))}
            </div>
          </section> */}

          {/* Feature Showcase */}
          <FeatureShowcase />
          <Features />
          <UseCases />
          {/* <section id="pricing">
            <Pricing />
          </section> */}

          <Footer />
        </main>
      </div>
    </div>
  );
}
