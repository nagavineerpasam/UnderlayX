import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title:
    "Free AI Image Editor | Remove Background, Text Behind Image, Customize Background | UnderlayX AI",
  description:
    "Free AI-powered image editor. Remove backgrounds, add text behind images, customize backgrounds, clone objects, and create stunning visual effects. Professional image editing made simple.",
  metadataBase: new URL("https://www.underlayx.com"),
  openGraph: {
    type: "website",
    url: "https://www.underlayx.com",
    title: "Free AI Image Editor | UnderlayX AI",
    description:
      "Transform your images with our free AI editor. Remove backgrounds, add text behind images, customize backgrounds, and more. Start editing now!",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free AI Image Editor | Remove Background, Text Behind Image | UnderlayX AI",
    description:
      "Free AI image editor. Remove backgrounds, add text behind images, customize backgrounds, and create stunning effects instantly.",
    creator: "@underlayx",
    images: ["/og-image.png"],
    site: "@underlayx",
  },
  keywords:
    "free image editor, no signup image editor, remove background free, text behind image, change background, customize background, background remover, ai image editor, online image editor, free background changer, text behind picture, remove background online, background replacement, image background editor, clone image ai, duplicate ai, shapes behind image, free photo editor, no registration image editor",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
      <body className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors">
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
        <GoogleAnalytics gaId="G-LWYW0Q03ZL" />
      </body>
    </html>
  );
}
