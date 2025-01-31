import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Text Behind Image | Text Behind Picture Editor | UnderlayX AI',
  description: 'Create stunning text behind image effects. Our AI-powered tool helps you add text behind photos, create text background effects, and design creative text overlays for your images.',
  keywords: 'text behind image, put text behind picture, text behind photo editor, image text effects, text background effects',
  openGraph: {
    title: 'Add Text Behind Image | Text Behind Picture Editor',
    description: 'Create stunning text behind image effects with UnderlayX. Add text behind photos easily.',
    images: ['/povafter.jpg'],
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
