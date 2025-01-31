import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Shapes Behind Image | Geometric Pattern Background | UnderlayX AI',
  description: 'Add geometric shapes and patterns behind your images. Create stunning visual effects with customizable shapes, patterns, and designs behind your photos.',
  keywords: 'shapes behind image, geometric patterns, image background shapes, photo pattern maker, geometric background designer',
  openGraph: {
    title: 'Add Shapes Behind Image | Geometric Pattern Background',
    description: 'Create stunning visual effects with shapes behind your images using UnderlayX.',
    images: ['/personafter.jpg'],
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}