"use client";

import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { motion } from "framer-motion";
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
  Image as ImageIcon,
  PaintBucket as Paint,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// tools - now with viral energy!
const tools = [
  {
    Icon: ImageOff,
    name: "Cut Out Backgrounds",
    emoji: "✂️",
    vibe: "SNIP SNIP!",
    gradient: "from-red-500 to-pink-500",
    popular: true,
  },
  {
    Icon: Layers,
    name: "Swap Backgrounds",
    emoji: "🔄",
    vibe: "SWITCH IT UP!",
    gradient: "from-blue-500 to-purple-500",
    popular: false,
  },
  {
    Icon: Paint,
    name: "Custom Backdrops",
    emoji: "🎨",
    vibe: "PAINT IT!",
    gradient: "from-yellow-500 to-orange-500",
    popular: false,
  },
  {
    Icon: Type,
    name: "Text Behind Objects",
    emoji: "✍️",
    vibe: "BEHIND THE MAGIC!",
    gradient: "from-green-500 to-cyan-500",
    popular: true,
  },
  {
    Icon: Shapes,
    name: "Shapes Behind Objects",
    emoji: "🔷",
    vibe: "SHAPE IT!",
    gradient: "from-purple-500 to-pink-500",
    popular: false,
  },
  {
    Icon: Copy,
    name: "Duplicate Elements",
    emoji: "🔄",
    vibe: "DOUBLE TROUBLE!",
    gradient: "from-cyan-500 to-blue-500",
    popular: false,
  },
  {
    Icon: Sticker,
    name: "Logo Integration",
    emoji: "⭐",
    vibe: "BRAND FLEX!",
    gradient: "from-orange-500 to-red-500",
    popular: true,
  },
  {
    Icon: Overlay,
    name: "Layer Images",
    emoji: "📸",
    vibe: "STACK IT!",
    gradient: "from-indigo-500 to-purple-500",
    popular: false,
  },
  {
    Icon: Adjustments,
    name: "Fine-Tune Colors",
    emoji: "🎛️",
    vibe: "DIAL IT IN!",
    gradient: "from-pink-500 to-red-500",
    popular: false,
  },
  {
    Icon: Wand,
    name: "AI Magic",
    emoji: "✨",
    vibe: "ABRACADABRA!",
    gradient: "from-purple-500 to-blue-500",
    popular: true,
  },
  {
    Icon: Filter,
    name: "Instant Effects",
    emoji: "⚡",
    vibe: "INSTANT FIRE!",
    gradient: "from-yellow-500 to-red-500",
    popular: false,
  },
  {
    Icon: Download,
    name: "HD Downloads",
    emoji: "💎",
    vibe: "CRYSTAL CLEAR!",
    gradient: "from-green-500 to-blue-500",
    popular: false,
  },
  {
    Icon: Eye,
    name: "Preview Mode",
    emoji: "👁️",
    vibe: "PEEK A BOO!",
    gradient: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    Icon: ImageIcon,
    name: "Enhance Quality",
    emoji: "🚀",
    vibe: "LEVEL UP!",
    gradient: "from-red-500 to-purple-500",
    popular: true,
  },
];

// Key benefits of the app
const benefits = [
  {
    title: "Professional Results in Seconds",
    description:
      "Create studio-quality edits with just a few clicks, no design experience needed.",
    icon: Sparkles,
  },
  {
    title: "All-in-One Solution",
    description:
      "50+ powerful tools in one place - no need to switch between different apps.",
    icon: Layers,
  },
  {
    title: "Unique Behind-Object Technology",
    description:
      "Place text, logos, and shapes behind objects in your images with AI precision.",
    icon: Type,
  },
  {
    title: "High-Resolution Exports",
    description:
      "Download your creations in high quality for professional use.",
    icon: Download,
  },
];

// Common use cases
const useCases = [
  {
    title: "Social Media Content",
    description: "Create eye-catching posts that stand out in crowded feeds",
    image: "/social-media-example.jpg",
  },
  {
    title: "Product Photography",
    description:
      "Enhance product images with professional backgrounds and effects",
    image: "/product-example.jpg",
  },
  {
    title: "YouTube Thumbnails",
    description: "Design clickable thumbnails that boost your video views",
    image: "/youtube-example.jpg",
  },
];

const FeatureCard = ({
  tool: { Icon, name, emoji, vibe, gradient, popular },
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      type: "spring",
      bounce: 0.4,
    }}
    viewport={{ once: true }}
    className="group relative"
  >
    {/* Popular badge */}
    {popular && (
      <div className="absolute -top-2 -right-2 z-20">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg animate-pulse">
          🔥 HOT
        </div>
      </div>
    )}

    {/* Glow effect */}
    <div
      className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500`}
    />

    <div
      className="relative flex flex-col items-center p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl
        transform transition-all duration-300 
        hover:scale-110 hover:-rotate-2
        border border-white/50 dark:border-gray-700/50
        shadow-lg hover:shadow-2xl
        cursor-pointer overflow-hidden
        h-32 justify-between"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-20 transition-opacity">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      </div>

      {/* Icon container */}
      <div
        className={`relative w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white drop-shadow-sm" />

        {/* Emoji overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-xl">
          <span className="text-xl animate-bounce">{emoji}</span>
        </div>
      </div>

      {/* Text content - fixed height container */}
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight mb-1 min-h-[2.5rem] flex items-center">
          {name}
        </span>

        {/* Vibe text - appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 absolute bottom-2">
          <span
            className={`text-xs font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent whitespace-nowrap`}
          >
            {vibe}
          </span>
        </div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
      </div>
      <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
        <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping" />
      </div>

      {/* Hover ripple effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl animate-ping`}
        />
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

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
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-white dark:bg-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10">
        <Navbar />
      </div>

      {/* Content Container */}
      <div ref={scrollRef} className="relative z-10 flex-grow">
        <main className="w-full" role="main" aria-label="Main content">
          <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent dark:from-purple-500/20" />

            <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20">
              {/* Top Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-4"
              >
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full text-sm font-medium text-gray-800 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                  🔥 The Secret Tool Every Creator Needs
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
                  Make Your Photos{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
                    Go Viral
                  </span>
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
                  Put text and graphics behind people in your photos. It's the
                  secret sauce content creators use to get millions of views.
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {" "}
                    Free forever, no signup needed.
                  </span>
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-16"
              >
                <Link
                  href="/custom-editor"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full text-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                >
                  Start Creating Magic ✨
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>

              {/* Viral Feature Grid */}
              <div className="relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl blur-xl" />

                {/* Desktop Grid */}
                <div className="relative hidden md:block">
                  {/* Header for grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      50+ VIRAL TOOLS AT YOUR FINGERTIPS! 🔥
                    </h3>
                  </motion.div>

                  {/* Masonry-style grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
                    {tools.map((tool, index) => (
                      <FeatureCard key={index} tool={tool} index={index} />
                    ))}
                  </div>

                  {/* Grid decorations */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-pulse" />
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-40 animate-pulse delay-1000" />
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-35 animate-ping" />
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden">
                  {/* Mobile header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/20 mb-3">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        🛠️ SWIPE FOR TOOLS
                      </span>
                    </div>
                    <h3 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      50+ VIRAL TOOLS! 🔥
                    </h3>
                  </motion.div>

                  {/* Horizontal scroll with enhanced styling */}
                  <div className="relative">
                    {/* Gradient overlays for scroll indication */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

                    <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide px-2">
                      {tools.map((tool, index) => (
                        <div key={index} className="flex-none w-28">
                          <FeatureCard tool={tool} index={index} />
                        </div>
                      ))}
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex justify-center mt-2">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-purple-500/30 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA for tools */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center mt-8"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      Hover over tools
                    </span>{" "}
                    to see the vibe! 👆
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* VIRAL Before/After Section - TikTok Style */}
          <section id="examples" className="w-full relative overflow-hidden">
            {/* Dynamic background with multiple gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-blue-500/10 dark:from-pink-400/20 dark:via-purple-400/10 dark:to-blue-400/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(236,72,153,0.15)_0%,transparent_50%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.15)_0%,transparent_50%)] animate-pulse delay-1000" />

            <div className="relative z-10 px-4 py-20 md:py-32">
              <div className="max-w-7xl mx-auto">
                {/* Viral Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  {/* Trending alert */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-red-500/20 mb-6">
                    <span className="text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      🚨 MINDS = BLOWN
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="text-gray-900 dark:text-white">Holy</span>{" "}
                    <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      SH*T
                    </span>
                    <span className="text-gray-900 dark:text-white">,</span>
                    <br />
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                      LOOK AT THIS!
                    </span>{" "}
                    <span className="text-6xl animate-bounce">🤯</span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium mb-8">
                    Seriously,{" "}
                    <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      SWIPE THAT SLIDER
                    </span>
                  </p>
                </motion.div>

                {/* Enhanced FeatureShowcase with wrapper */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Glow effect around showcase */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse" />

                  <div className="relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
                    <FeatureShowcase />

                    {/* Floating indicators */}
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                        👀 WATCH THIS!
                      </div>
                    </div>

                    <div className="absolute -bottom-2 -left-2 animate-bounce delay-500">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                        🔥 INSANE!
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Viral reaction section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center mt-16"
                >
                  {/* Main CTA */}
                  <div className="relative inline-block">
                    {/* Button glow effect */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse" />

                    <Link
                      href="/custom-editor"
                      className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-3xl text-2xl font-black transition-all duration-300 shadow-2xl shadow-pink-500/25 hover:shadow-3xl hover:shadow-pink-500/40 hover:scale-110"
                    >
                      <span>Create Your First VIRAL Photo!</span>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl animate-bounce">🚀</span>
                        <span className="text-3xl animate-bounce delay-100">
                          💥
                        </span>
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  {/* Social proof counter */}
                  <p className="mt-6 text-lg font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                    🔥 Join 2.5M+ creators who already went viral with this! 🔥
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works Section - Viral Redesign */}
          <section className="w-full relative overflow-hidden">
            {/* Dynamic animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 dark:from-yellow-400/10 dark:via-orange-400/10 dark:to-red-400/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(251,191,36,0.1)_0%,transparent_50%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1)_0%,transparent_50%)] animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.05)_0%,transparent_70%)]" />

            <div className="relative z-10 px-4 py-20 md:py-32">
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  {/* Trending badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/20 mb-6">
                    <span className="text-sm font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      😂 TOO EASY TO BE REAL
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="text-gray-900 dark:text-white">It's</span>{" "}
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                      EMBARRASSINGLY
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      EASY
                    </span>{" "}
                    <span className="text-6xl">🤯</span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium">
                    No joke, a{" "}
                    <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      5-year-old
                    </span>{" "}
                    could use this.{" "}
                    <span className="font-black text-3xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      THREE CLICKS
                    </span>{" "}
                    and you're{" "}
                    <span className="bg-yellow-200 dark:bg-yellow-900/50 px-2 py-1 rounded font-bold">
                      DONE
                    </span>
                    ! 💀
                  </p>
                </motion.div>

                {/* Interactive Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {[
                    {
                      emoji: "📱",
                      title: "Drag & Drop Your Photo",
                      desc: "Literally just DROP your photo. That boring selfie from last week? PERFECT! 📸",
                      gradient: "from-blue-500 via-purple-500 to-pink-500",
                      bgGradient: "from-blue-500/10 to-pink-500/10",
                      stepNumber: "01",
                      delay: 0.1,
                      hoverText: "SO EASY! 🙌",
                    },
                    {
                      emoji: "✨",
                      title: "Add Some Magic",
                      desc: "Put text behind yourself, swap backgrounds, WHATEVER! The AI does ALL the hard work! 🤖",
                      gradient: "from-yellow-500 via-orange-500 to-red-500",
                      bgGradient: "from-yellow-500/10 to-red-500/10",
                      stepNumber: "02",
                      delay: 0.2,
                      hoverText: "MIND = BLOWN! 🤯",
                    },
                    {
                      emoji: "🚀",
                      title: "Watch It Go VIRAL",
                      desc: "Download your MASTERPIECE and watch the likes POUR IN. You're welcome! 😎",
                      gradient: "from-green-500 via-cyan-500 to-blue-500",
                      bgGradient: "from-green-500/10 to-blue-500/10",
                      stepNumber: "03",
                      delay: 0.3,
                      hoverText: "VIRAL BABY! 📈",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: step.delay }}
                      viewport={{ once: true }}
                      className="group relative"
                    >
                      {/* Step glow effect */}
                      <div
                        className={`absolute -inset-2 bg-gradient-to-r ${step.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500`}
                      />

                      <div className="relative">
                        {/* Step number badge */}
                        <div className="absolute -top-4 -left-4 z-20">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900 group-hover:scale-125 transition-transform duration-300`}
                          >
                            <span className="text-white font-black text-lg">
                              {step.stepNumber}
                            </span>
                          </div>
                        </div>

                        <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-center">
                          {/* Icon section */}
                          <div
                            className={`relative w-24 h-24 bg-gradient-to-br ${step.bgGradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500`}
                          >
                            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-3xl" />
                            <span className="relative text-5xl group-hover:scale-125 transition-transform duration-300">
                              {step.emoji}
                            </span>
                          </div>

                          {/* Content */}
                          <h3
                            className={`text-2xl md:text-3xl font-black mb-4 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                          >
                            {step.title}
                          </h3>

                          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium mb-6">
                            {step.desc}
                          </p>

                          {/* Hover indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${step.gradient} rounded-full text-white font-bold text-sm shadow-lg`}
                            >
                              <span>{step.hoverText}</span>
                              <div className="animate-bounce">🎉</div>
                            </div>
                          </div>

                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-3xl`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Final CTA */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative inline-block">
                    {/* Button glow effect */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-50 animate-pulse" />

                    <Link
                      href="/custom-editor"
                      className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white rounded-3xl text-2xl font-black transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-3xl hover:shadow-orange-500/40 hover:scale-110"
                    >
                      <span>Let's Make Some MAGIC!</span>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl animate-bounce">✨</span>
                        <span className="text-3xl animate-bounce delay-100">
                          🎨
                        </span>
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  {/* Fun disclaimer */}
                  <p className="mt-6 text-lg font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                    ⚡ Warning: May cause extreme satisfaction and viral content
                    ⚡
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Viral Secret Weapon Section - Redesigned for Gen-Z */}
          <section className="w-full relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-blue-900/10 dark:from-purple-500/20 dark:via-pink-500/10 dark:to-blue-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.1)_0%,transparent_50%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.1)_0%,transparent_50%)] animate-pulse delay-1000" />

            <div className="relative z-10 px-4 py-20 md:py-32">
              <div className="max-w-7xl mx-auto">
                {/* Header Section with better typography */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  {/* Trending badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-pink-500/20 mb-6">
                    <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      🔥 TRENDING ON TIKTOK
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="block text-gray-900 dark:text-white">
                      The
                    </span>
                    <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                      Secret Weapon
                    </span>
                    <span className="block text-gray-900 dark:text-white text-2xl md:text-4xl lg:text-5xl mt-2">
                      Influencers Don't Want You to Know 🤫
                    </span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium">
                    While everyone's still using{" "}
                    <span className="line-through text-gray-500">
                      basic filters
                    </span>
                    ,
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {" "}
                      smart creators
                    </span>{" "}
                    are using
                    <span className="font-bold text-pink-600 dark:text-pink-400">
                      {" "}
                      this
                    </span>{" "}
                    to{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-black">
                      DOMINATE
                    </span>{" "}
                    social media 📈
                  </p>
                </motion.div>

                {/* Main Feature Card - Redesigned */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mb-24"
                >
                  <div className="relative">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500" />

                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 dark:border-gray-700/50 shadow-2xl">
                      <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left side - Text content */}
                        <div className="lg:w-1/2 space-y-8">
                          {/* Viral badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/30">
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              💯 VIRAL ALERT
                            </span>
                            <div className="flex">
                              <span className="text-xs">🔥</span>
                              <span className="text-xs animate-bounce">🔥</span>
                              <span className="text-xs">🔥</span>
                            </div>
                          </div>

                          <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                            The{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                              "Behind Objects"
                            </span>{" "}
                            Trick That{" "}
                            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                              BREAKS
                            </span>{" "}
                            the Internet 🤯
                          </h3>

                          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                            Remember those{" "}
                            <span className="font-bold text-purple-600">
                              viral posts
                            </span>{" "}
                            where text appears{" "}
                            <span className="font-bold text-pink-600">
                              behind people
                            </span>
                            ? Yeah, that's us. This{" "}
                            <span className="bg-yellow-200 dark:bg-yellow-900/50 px-2 py-1 rounded font-bold">
                              ONE feature
                            </span>{" "}
                            has generated{" "}
                            <span className="font-black text-green-600">
                              MILLIONS
                            </span>{" "}
                            of views for creators.
                            <span className="block mt-4 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              And now it's YOUR turn! 🚀
                            </span>
                          </p>

                          <Link
                            href="/custom-editor"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
                          >
                            <span>I Want to Go VIRAL Too!</span>
                            <div className="flex items-center gap-1">
                              <span className="text-2xl">🔥</span>
                              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        </div>

                        {/* Right side - Interactive feature cards */}
                        <div className="lg:w-1/2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                              {
                                emoji: "✍️",
                                title: "Text Behind People",
                                desc: "The MrBeast secret! Put text behind yourself = instant WOW factor",
                                color: "from-yellow-400 to-orange-500",
                                delay: 0.1,
                              },
                              {
                                emoji: "🎬",
                                title: "Movie-Level Graphics",
                                desc: "Make your photos look like Hollywood movie posters",
                                color: "from-purple-400 to-pink-500",
                                delay: 0.2,
                              },
                              {
                                emoji: "🎯",
                                title: "Brand Integration",
                                desc: "Blend logos behind people. Ads that don't look like ads!",
                                color: "from-blue-400 to-purple-500",
                                delay: 0.3,
                              },
                              {
                                emoji: "🔄",
                                title: "Clone Yourself",
                                desc: "Matrix effect but easier. Multiply yourself in photos!",
                                color: "from-green-400 to-blue-500",
                                delay: 0.4,
                              },
                            ].map((feature, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: feature.delay,
                                }}
                                viewport={{ once: true }}
                                className="group relative"
                              >
                                {/* Card glow effect */}
                                <div
                                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300`}
                                />

                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                                  <div className="flex items-start gap-4">
                                    <div className="text-4xl group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                                      {feature.emoji}
                                    </div>
                                    <div className="flex-1">
                                      <h4
                                        className={`font-bold text-lg mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:text-gray-900 dark:group-hover:text-white transition-all`}
                                      >
                                        {feature.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 leading-relaxed">
                                        {feature.desc}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Teleportation Section - Viral Redesign */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mb-24"
                >
                  <div className="relative">
                    {/* Dynamic glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />

                    <div className="relative bg-gradient-to-br from-cyan-50/90 to-blue-50/90 dark:from-cyan-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-200/50 dark:border-cyan-700/30 shadow-2xl">
                      <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="lg:w-1/2 space-y-8">
                          {/* AI badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30">
                            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                              🤖 AI MAGIC
                            </span>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-100" />
                            </div>
                          </div>

                          <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                              TELEPORT
                            </span>{" "}
                            Yourself
                            <span className="block mt-2">
                              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                ANYWHERE
                              </span>{" "}
                              🌍✨
                            </span>
                          </h3>

                          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-bold text-cyan-600">
                              One click
                            </span>{" "}
                            removes your background. Then drop yourself on a{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
                              beach
                            </span>
                            , in{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent font-bold">
                              space
                            </span>
                            , or at a{" "}
                            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">
                              fancy restaurant
                            </span>
                            .
                            <span className="block mt-3 text-xl font-bold">
                              The AI cuts you out so perfectly, people will
                              think you{" "}
                              <span className="bg-yellow-200 dark:bg-yellow-900/50 px-2 py-1 rounded">
                                actually traveled there
                              </span>
                              ! 🤯
                            </span>
                          </p>

                          <Link
                            href="/remove-background"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                          >
                            <span>Teleport Me NOW!</span>
                            <div className="flex items-center gap-1">
                              <span className="text-2xl animate-bounce">
                                🚀
                              </span>
                              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        </div>

                        {/* Right side - Interactive demo */}
                        <div className="lg:w-1/2">
                          <div className="relative">
                            {/* Phone-like container */}
                            <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                  🌎 Teleportation Menu
                                </h4>
                                <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full">
                                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                    LIVE
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {[
                                  {
                                    emoji: "✂️",
                                    title: "Cut Me Out",
                                    desc: "AI removes background in 0.5 seconds!",
                                    color: "from-red-500 to-pink-500",
                                    delay: 0.1,
                                  },
                                  {
                                    emoji: "🏖️",
                                    title: "Pick Destination",
                                    desc: "Maldives? Mars? Your choice!",
                                    color: "from-blue-500 to-cyan-500",
                                    delay: 0.2,
                                  },
                                  {
                                    emoji: "🔍",
                                    title: "Perfect Edges",
                                    desc: "Make it look 100% real",
                                    color: "from-green-500 to-emerald-500",
                                    delay: 0.3,
                                  },
                                  {
                                    emoji: "💎",
                                    title: "Export HD",
                                    desc: "Download crystal clear quality",
                                    color: "from-purple-500 to-indigo-500",
                                    delay: 0.4,
                                  },
                                ].map((step, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.5,
                                      delay: step.delay,
                                    }}
                                    viewport={{ once: true }}
                                    className="group relative"
                                  >
                                    {/* Step glow */}
                                    <div
                                      className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-300`}
                                    />

                                    <div className="relative flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-102 cursor-pointer">
                                      <div
                                        className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                                      >
                                        <span className="text-xl">
                                          {step.emoji}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 transition-all">
                                          {step.title}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                          {step.desc}
                                        </p>
                                      </div>
                                      <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        ⚡
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Bottom CTA */}
                              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 text-center">
                                <p className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                                  ✨ Used by 2M+ creators worldwide ✨
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Viral Community Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-16">
                    {/* Community badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-500/20 mb-6">
                      <span className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        🌟 JOIN THE MOVEMENT
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse delay-200" />
                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse delay-400" />
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                      Join the{" "}
                      <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                        VIRAL CONTENT
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        REVOLUTION
                      </span>{" "}
                      🔥
                    </h3>

                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium">
                      From{" "}
                      <span className="line-through text-gray-500">
                        broke college students
                      </span>{" "}
                      to{" "}
                      <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        MILLION-FOLLOWER
                      </span>{" "}
                      influencers - everyone's using this to{" "}
                      <span className="font-black text-2xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        BLOW UP
                      </span>{" "}
                      their content 💥
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                      {
                        emoji: "🎥",
                        title: "YouTubers & TikTokers",
                        desc: "Stop using boring thumbnails. Create MIND-BENDING visuals that FORCE people to click!",
                        gradient: "from-red-500 via-pink-500 to-purple-500",
                        bgGradient: "from-red-500/10 to-purple-500/10",
                        delay: 0.1,
                        stats: "+156% CTR",
                      },
                      {
                        emoji: "📈",
                        title: "Entrepreneurs & Brands",
                        desc: "Make ads that don't look like ads. Viral content that actually CONVERTS customers!",
                        gradient: "from-blue-500 via-cyan-500 to-green-500",
                        bgGradient: "from-blue-500/10 to-green-500/10",
                        delay: 0.2,
                        stats: "+89% Sales",
                      },
                      {
                        emoji: "📸",
                        title: "Anyone with a Phone",
                        desc: "Turn random selfies into PORTFOLIO-WORTHY masterpieces. Your friends will be SHOOK!",
                        gradient: "from-yellow-500 via-orange-500 to-red-500",
                        bgGradient: "from-yellow-500/10 to-red-500/10",
                        delay: 0.3,
                        stats: "+1M Likes",
                      },
                    ].map((creator, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: creator.delay }}
                        viewport={{ once: true }}
                        className="group relative"
                      >
                        {/* Card glow */}
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${creator.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}
                        />

                        <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 h-full flex flex-col">
                          {/* Header with emoji and stats */}
                          <div
                            className={`relative h-48 bg-gradient-to-br ${creator.bgGradient} flex flex-col items-center justify-center overflow-hidden`}
                          >
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
                            </div>

                            <div className="relative z-10 text-center">
                              <div className="text-6xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                                {creator.emoji}
                              </div>
                              <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full">
                                <span
                                  className={`text-sm font-bold bg-gradient-to-r ${creator.gradient} bg-clip-text text-transparent`}
                                >
                                  {creator.stats}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-8 flex-1 flex flex-col justify-center">
                            <h4
                              className={`text-2xl font-black mb-4 bg-gradient-to-r ${creator.gradient} bg-clip-text text-transparent`}
                            >
                              {creator.title}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
                              {creator.desc}
                            </p>
                          </div>

                          {/* Hover effect overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${creator.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500 rounded-3xl`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Final CTA */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      {/* Button glow effect */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse" />

                      <Link
                        href="/custom-editor"
                        className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-3xl text-2xl font-black transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/40 hover:scale-110"
                      >
                        <span>I'm Ready to Go VIRAL!</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl animate-bounce">🚀</span>
                          <span className="text-3xl animate-bounce delay-100">
                            💫
                          </span>
                          <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Link>
                    </div>

                    {/* Social proof */}
                    <p className="mt-6 text-lg font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                      ✨ Join 2.5M+ creators making viral content daily ✨
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
