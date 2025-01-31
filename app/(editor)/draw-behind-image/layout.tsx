import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Draw Behind Images | Custom Image Background Editor | UnderlayX AI',
  description: 'Create custom drawings and effects behind your images. Add artistic elements and personalized backgrounds to your photos.',
  keywords: 'draw behind image, custom photo background, image drawing tool, photo art creator, background drawing editor',
  openGraph: {
    title: 'Draw Behind Images | Custom Background Creator',
    description: 'Create custom drawings and effects behind your images with UnderlayX.',
    images: ['/drawafter.jpeg'],
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}