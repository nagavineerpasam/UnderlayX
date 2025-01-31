import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Overlay Effects | Add Overlays to Photos | UnderlayX AI',
  description: 'Create professional image overlays instantly. Add stunning effects, textures, and overlays to your photos with AI-powered image editor.',
  keywords: 'image overlay, photo overlay effects, picture overlay maker, overlay generator, photo effects editor',
  openGraph: {
    title: 'Image Overlay Effects | Professional Photo Editor',
    description: 'Transform your images with professional overlay effects using UnderlayX.',
    images: ['/personafter.jpg'],
  }
};

export default function OverlayImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
