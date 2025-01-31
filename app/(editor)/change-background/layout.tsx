import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Image Background | Background Replacement Tool | UnderlayX AI',
  description: 'Change image backgrounds instantly with AI. Replace, modify, or enhance photo backgrounds with our professional background changer.',
  keywords: 'change background, background replacement, photo background changer, image background editor, AI background tool',
  openGraph: {
    title: 'Change Image Background | AI Background Replacement',
    description: 'Transform your image backgrounds instantly with UnderlayX AI.',
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
