'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllBlogPosts } from '@/lib/blog';

export default function BlogIndex() {
  const posts = getAllBlogPosts();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">Design Resources & Tutorials</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="p-6 rounded-xl border border-gray-800 hover:border-gray-700 bg-black/20 backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <span className="text-sm text-purple-400">{post.category}</span>
                <h2 className="text-xl font-bold text-white mt-2 mb-3">{post.title}</h2>
                <p className="text-gray-400">{post.description}</p>
                <time className="mt-4 block text-sm text-gray-500">{post.date}</time>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
