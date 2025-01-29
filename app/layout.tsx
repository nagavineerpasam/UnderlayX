import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { PricingProvider } from '@/contexts/PricingContext';


export const metadata = {
  title: 'All-in-One Free AI Image Editor - UnderlayX AI',
  description: 'The ultimate tool to add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects effortlessly. Perfect for creators and designers.',
  metadataBase: new URL('https://www.underlayx.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.underlayx.com',
    title: 'All-in-One Free AI Image Editor - UnderlayX AI',
    description: 'Add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects. Elevate your visuals with UnderlayX AI.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnderlayX AI | All-in-One Free AI Image Editor',
    description: 'Add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects effortlessly. Try it now!',
    creator: '@underlayx',
    images: ['/og-image.png'],
    site: '@underlayx',
  },
  keywords: 'image behind image, image overlay, blend image, logo behind image, text behind image, logos behind image, shapes behind image, remove background, clone objects, change background, glowing text effect, image editor, photo editing, advanced image editor, youtube thumbnail maker',
  icons: {
    icon: '/favicon.ico',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className={`${inter.className} bg-[#0A0A0A] min-h-screen`}>
        <PricingProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </PricingProvider>
        <GoogleAnalytics gaId="G-LWYW0Q03ZL" />
      </body>
    </html>
  );
}
