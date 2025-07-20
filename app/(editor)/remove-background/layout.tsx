import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free Background Remover | Remove Background from Image Online | UnderlayX AI",
  description:
    "Remove background from images instantly with our free AI-powered background remover. Create transparent backgrounds, remove photo backgrounds with precision. No signup required - try our professional background removal tool now!",
  keywords:
    "remove background, background remover, free background remover, remove background from image, background removal tool, transparent background, remove photo background, free background removal, no signup background remover, ai background remover, online background remover, remove image background, photo background eraser",
  openGraph: {
    title: "Free Background Remover | Remove Background from Image Online",
    description:
      "Remove background from images instantly with our free AI tool. Perfect for product photos and portraits. No signup required - start removing backgrounds now!",
    images: ["/shirtafter.jpg"],
    type: "website",
    url: "https://www.underlayx.com/remove-background",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Background Remover | UnderlayX AI",
    description:
      "Remove background from images instantly. Free AI tool, no signup required.",
    images: ["/shirtafter.jpg"],
  },
  alternates: {
    canonical: "https://www.underlayx.com/remove-background",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Background Remover | UnderlayX AI",
    description:
      "Free AI-powered background removal tool. Remove backgrounds from images instantly with precision. No signup required.",
    url: "https://www.underlayx.com/remove-background",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    permissions: "no registration required",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to use, no signup required",
    },
    featureList: [
      "Remove background from images",
      "AI-powered background removal",
      "Create transparent PNG",
      "Precise edge detection",
      "Batch processing",
      "Free to use",
      "No signup required",
    ],
    screenshot: "https://www.underlayx.com/shirtafter.jpg",
    softwareVersion: "1.0",
    releaseNotes: "Free AI-powered background removal tool",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
