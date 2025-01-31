import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Background from Images | Background Remover | UnderlayX AI',
  description: 'Remove background from images instantly. Our AI-powered tool helps you remove backgrounds from photos with precision, perfect for product photos and portraits.',
  keywords: 'remove background, background remover, transparent background, remove image background, photo background remover',
  openGraph: {
    title: 'Remove Background from Images | Background Remover',
    description: 'Remove backgrounds from your images instantly with UnderlayX AI.',
    images: ['/shirtafter.jpg'],
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
