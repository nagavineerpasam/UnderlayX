import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free Text Behind Image Generator | Add Text Behind Picture Online | UnderlayX AI",
  description:
    "Create stunning text behind image effects instantly with our free AI-powered tool. Add text behind pictures, create text background effects, and design professional image overlays. Start creating now!",
  keywords:
    "text behind image, text behind picture, add text behind image, text behind photo, free text behind image tool, text background effects, image text overlay, put text behind picture, text behind image ai, text behind image generator, free image editor, no signup image editor, text overlay generator",
  openGraph: {
    title: "Free Text Behind Image Generator | Add Text Behind Picture Online",
    description:
      "Create stunning text behind image effects instantly. Free AI tool. Start creating now!",
    images: ["/povafter.jpg"],
    type: "website",
    url: "https://www.underlayx.com/text-behind-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text Behind Image Generator | UnderlayX AI",
    description:
      "Create stunning text behind image effects instantly. Free AI tool. Start creating now!",
    images: ["/povafter.jpg"],
  },
  alternates: {
    canonical: "https://www.underlayx.com/text-behind-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Text Behind Image Generator | UnderlayX AI",
    description:
      "Free AI-powered tool to add text behind images. Create professional text behind picture effects. Start creating now!",
    url: "https://www.underlayx.com/text-behind-image",
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
      "Add text behind images",
      "AI-powered object detection",
      "Professional text effects",
      "Real-time preview",
      "Free to use",
      "No signup required",
    ],
    screenshot: "https://www.underlayx.com/povafter.jpg",
    softwareVersion: "1.0",
    releaseNotes: "Free AI-powered text behind image generator",
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
