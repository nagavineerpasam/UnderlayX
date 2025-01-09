'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  // Add layoutEffect: false to prevent hydration warning
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
    layoutEffect: false // Add this line
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    // Add position-relative to both parent and scroll container
    <div className="min-h-screen relative flex flex-col" style={{ position: 'relative' }}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 animate-gradient-slow" />
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-transparent to-purple-900/20 animate-gradient-slow-delay" />
        </div>
        {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" /> */}
      </div>

      {/* Content Container - Ensure both className and style have positioning */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-grow" 
        style={{ 
          position: 'relative',
          transform: 'translate3d(0, 0, 0)',  // Create a new stacking context with hardware acceleration
          willChange: 'transform'  // Hint to browser about upcoming transforms
        }}
      >
        

        {/* Hero Section - Single Viewport */}
        <div className="min-h-screen flex flex-col">
          {/* Brand Header */}
          <div className="pt-8 pb-4">
            <h2 className="text-3xl font-bold text-center text-white">
              UnderlayX
            </h2>
          </div>

          {/* Main Hero Content */}
          <div className="flex-grow flex items-center">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Text content */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-left"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    Transform Your <span className="text-purple-500">Images</span> Instantly
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8">
                    Add professional text behind objects, create stunning glow effects, and place shapes behind your images - all in one click.
                  </p>
                  <Link 
                    href="/custom-editor" 
                    onClick={() => setIsLoading(true)}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-black rounded-lg text-xl font-semibold transition-all hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                      </>
                    ) : (
                      "Try It Now - It's Free"
                    )}
                  </Link>

                  {/* Product Hunt Badges */}
                  <div className="hidden sm:flex flex-col sm:flex-row gap-4 mt-8">
                    <a 
                      href="https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full sm:w-auto"
                    >
                      <img 
                        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=44" 
                        alt="UnderlayX - Product Hunt" 
                        className="w-full max-w-[250px] h-auto mx-auto"
                      />
                    </a>
                    <a 
                      href="https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-underlayx" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full sm:w-auto"
                    >
                      <img 
                        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=739682&theme=light&period=daily" 
                        alt="UnderlayX - Product Hunt" 
                        className="w-full max-w-[250px] h-auto mx-auto"
                      />
                    </a>
                    <a 
                      href="https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full sm:w-auto"
                    >
                      <img 
                        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=164" 
                        alt="UnderlayX - Product Hunt" 
                        className="w-full max-w-[250px] h-auto mx-auto"
                      />
                    </a>
                  </div>
                </motion.div>

                {/* Right side - Interactive Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src="/journey.png"
                        alt="UnderlayX Demo"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 mix-blend-overlay" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            >
              Everything You Need In One Place
            </motion.h2>

            {/* Feature Grid - Three columns */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Text Behind Objects",
                  image: "/ride.png",
                  description: "AI-powered text placement behind any object"
                },
                {
                  title: "Glowing Effects",
                  image: "/star.png",
                  description: "Add stunning glow effects to your designs"
                },
                {
                  title: "Shape Underlays",
                  image: "/pose.png",
                  description: "Place custom shapes behind your objects"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative rounded-xl overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-200">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* First Viewport Section */}
        <div className="min-h-screen flex flex-col justify-center">
          <div className="container mx-auto px-4 py-6 md:py-12">
            {/* Features Grid Section - Adjusted spacing */}
            <div className="py-16 md:py-24">
              <div className="container mx-auto px-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ reducedMotion: "user" }}
                  className="text-3xl md:text-5xl font-bold text-white text-center mb-12"
                >
                  Create Stunning Text Behind Images & More
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Add Shapes Behind Objects",
                      description: "Effortlessly place shapes to create depth and make your images stand out.",
                      color: "purple"
                    },
                    {
                      title: "Place Text Behind Objects",
                      description: "Use AI to position text perfectly behind objects for a professional finish.",
                      color: "blue"
                    },
                    {
                      title: "Create Stunning Glow Effects",
                      description: "Add glowing highlights to your images to make them visually striking.",
                      color: "yellow"
                    },
                    {
                      title: "Customize Design Elements",
                      description: "Personalize every detail with a wide range of font styles, colors, and design options.",
                      color: "pink"
                    },
                    {
                      title: "High-Quality Downloads",
                      description: "Save your creations in premium quality, ready for any use.",
                      color: "green"
                    },
                    {
                      title: "YouTube Thumbnails",
                      description: "Design thumbnails that grab attention and drive clicks effortlessly.",
                      color: "red"
                    },
                    {
                      title: "Social Media Posts",
                      description: "Craft engaging posts for Instagram, TikTok, Facebook, and beyond in seconds.",
                      color: "indigo"
                    },
                    {
                      title: "Professional Marketing",
                      description: "Build standout visuals for campaigns, promotions, and creative projects.",
                      color: "orange"
                    },
                    {
                      title: "Enhanced Photography",
                      description: "Elevate your photos with professional-grade effects and enhancements.",
                      color: "cyan"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, reducedMotion: "user" }}
                      className={`group p-6 rounded-2xl border border-gray-800 relative bg-black/20 backdrop-blur-sm 
                        hover:bg-black/40 transition-all duration-500 hover:-translate-y-1 
                        ${feature.color === 'purple' && 'hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)]'}
                        ${feature.color === 'blue' && 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]'}
                        ${feature.color === 'yellow' && 'hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]'}
                        ${feature.color === 'pink' && 'hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]'}
                        ${feature.color === 'green' && 'hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]'}
                        ${feature.color === 'red' && 'hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]'}
                        ${feature.color === 'indigo' && 'hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]'}
                        ${feature.color === 'orange' && 'hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]'}
                        ${feature.color === 'cyan' && 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]'}
                        overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-500/10 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <h3 className={`text-xl font-bold text-white mb-3 group-hover:text-${feature.color}-400 
                          transition-colors duration-300`}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Showcase Section - Adjusted spacing */}
            <div className="py-16 md:py-24 bg-black/20">
              <div className="container mx-auto px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ reducedMotion: "user" }}
                  className="text-3xl md:text-5xl font-bold text-white text-center mb-12"
                >
                  For Every Creator
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
                  {[
                    {
                      title: "Content Creators",
                      subtitle: "Effortlessly Create Stunning Visuals",
                      description: "Add shapes, text, and glow effects behind objects in your images to make captivating YouTube thumbnails, Instagram posts, and more.",
                      color: "purple"
                    },
                    {
                      title: "Marketers",
                      subtitle: "Boost Your Campaigns",
                      description: "Design high-quality visuals with custom fonts, colors, and styles to make your ads, banners, and promotional materials stand out.",
                      color: "blue"
                    },
                    {
                      title: "Photographers",
                      subtitle: "Enhance Your Photos",
                      description: "Transform ordinary images into extraordinary works of art by placing text and shapes behind objects seamlessly.",
                      color: "green"
                    },
                    {
                      title: "Digital Artists",
                      subtitle: "Unleash Your Creativity",
                      description: "Experiment with colors, fonts, and effects to bring your artistic vision to life with AI-powered tools.",
                      color: "pink"
                    },
                    {
                      title: "Social Media",
                      subtitle: "Stand Out on Every Platform",
                      description: "Design engaging content for Instagram, TikTok, Facebook, and beyond in seconds.",
                      color: "yellow"
                    },
                    {
                      title: "Students & Educators",
                      subtitle: "Simplify Creative Projects",
                      description: "Easily design posters, presentations, and visual aids for school or teaching projects.",
                      color: "orange"
                    }
                  ].map((card, index) => (
                    <div
                      key={index}
                      className={`group p-8 rounded-2xl border border-gray-800 relative bg-black/20 backdrop-blur-sm 
                        hover:bg-black/40 transition-all duration-500 hover:-translate-y-2 
                        ${card.color === 'purple' && 'hover:shadow-[0_0_40px_-5px_rgba(147,51,234,0.3)]'}
                        ${card.color === 'blue' && 'hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.3)]'}
                        ${card.color === 'green' && 'hover:shadow-[0_0_40px_-5px_rgba(34,197,94,0.3)]'}
                        ${card.color === 'pink' && 'hover:shadow-[0_0_40px_-5px_rgba(236,72,153,0.3)]'}
                        ${card.color === 'yellow' && 'hover:shadow-[0_0_40px_-5px_rgba(234,179,8,0.3)]'}
                        ${card.color === 'orange' && 'hover:shadow-[0_0_40px_-5px_rgba(249,115,22,0.3)]'}
                        overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-${card.color}-500/10 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <h3 className={`text-2xl font-bold text-white mb-2 group-hover:text-${card.color}-400 
                          transition-colors duration-300`}>
                          {card.title}
                        </h3>
                        <h4 className="text-lg text-gray-300 font-semibold mb-4 group-hover:text-gray-200 
                          transition-colors duration-300">
                          {card.subtitle}
                        </h4>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 
                          transition-colors duration-300">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Footer positioning */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}