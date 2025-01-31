import type { Metadata } from 'next';


export const metadata: Metadata = { 
  title: 'Clone & Duplicate Image Objects | Image Cloning Tool | UnderlayX AI',
  description: 'Clone and duplicate objects in your images with precision. Create stunning repetitive patterns and remove unwanted elements easily.',
  keywords: 'image clone, photo duplication, object cloning, pattern creator, image object copy',
  openGraph: {
    title: 'Clone & Duplicate Image Objects | Professional Cloning Tool',
    description: 'Clone and duplicate objects in your images perfectly with UnderlayX AI.',
    images: ['/appleafter.jpeg'],
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
