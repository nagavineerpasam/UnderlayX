import { Header } from './Header';
import { Footer } from './Footer';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    date: string;
    description: string;
    path: string; // Add this to handle different redirect paths
  }
}

export function BlogPost({ post }: BlogPostProps) {
  const sanitizedContent = sanitizeHtml(post.content, {
    allowedTags: [ 'p', 'ul', 'li', 'br', 'article', 'img' ],
    allowedAttributes: {
      'img': [ 'src', 'alt', 'className' ]
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-gray-400 text-lg mb-4">{post.description}</p>
            <time className="text-gray-500">{post.date}</time>
          </header>
          <div 
            className="prose prose-invert prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Try It Yourself?</h2>
            <p className="text-gray-300 mb-6">
              Start creating your own {post.title.toLowerCase()} with our easy-to-use editor. No sign-up required - it's completely free!
            </p>
            <Link 
              href={post.path} // Use the specific path for each blog post
              className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Try It Now
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
