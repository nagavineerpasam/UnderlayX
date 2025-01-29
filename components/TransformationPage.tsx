'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

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

  const bgColor = theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textColorMuted = theme === 'dark' ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col p-4`}>
      <nav className="w-full max-w-7xl mx-auto py-2 md:py-4">
        <Link 
          href="/" 
          className={cn(
            "text-xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-purple-600 to-pink-600",
            "hover:opacity-80 transition-opacity"
          )}
        >
          UnderlayX AI
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center pt-4 md:pt-0">
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold mb-4",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-purple-600 to-pink-600"
        )}>
          {title}
        </h1>
        
        <p className={`${textColorMuted} text-lg mb-8 max-w-2xl`}>
          {description}
        </p>

        <div className="space-y-4 mb-12">
          <button
            onClick={() => router.push('/custom-editor')}
            className={cn(
              "px-8 py-3 text-xl font-semibold text-white",
              "bg-gradient-to-r from-purple-600 to-pink-600",
              "rounded-lg shadow-lg",
              "transform transition-all duration-200",
              "hover:scale-105 hover:shadow-xl",
              "hover:from-purple-500 hover:to-pink-500",
              "active:scale-95"
            )}
          >
            Create now
          </button>
          <p className={`${textColorMuted} text-sm animate-pulse`}>
            Start creating your own transformed images now
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <Image
              src={beforeImage}
              alt={beforeAlt}
              width={250}  // Reduced from 300
              height={333} // Adjusted to maintain aspect ratio
              className="rounded-lg shadow-lg"
              priority
            />
            <p className={`${textColorMuted} mt-2 font-medium text-sm`}> {/* Added text-sm */}
              Original Image
            </p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32" // Reduced from 40
            height="32" // Reduced from 40
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
              width={250}  // Reduced from 300
              height={333} // Adjusted to maintain aspect ratio
              className="rounded-lg shadow-lg"
              priority
            />
            <p className={`${textColorMuted} mt-2 font-medium text-sm`}> {/* Added text-sm */}
              Transformed Image
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
