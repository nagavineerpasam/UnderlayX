import { Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-8 bg-gray-50/80 dark:bg-black/30 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/custom-editor" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Editor</Link></li>
            </ul>
          </div>
          
          {/* Blog Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Blog</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/text-behind-images" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Text Behind Images</Link></li>
              <li><Link href="/blog/glowing-text-effects" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Glowing Text Effects</Link></li>
              <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">View All</Link></li>
            </ul>
          </div>

          {/* FAQ & Legal Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Have a question or need help? Email me at
              </li>
              <li className="text-gray-900 dark:text-gray-300 text-sm font-medium">
                dailifyofficial@gmail.com
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Created by{' '}
              <a 
                href="https://x.com/Vineer5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors hover:underline"
              >
                Vineer
              </a>
            </p>
          </div>
        </div>

        {/* Mobile view - Github link */}
        <div className="md:hidden flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <a
            href="https://github.com/nagavineerpasam/UnderlayX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
