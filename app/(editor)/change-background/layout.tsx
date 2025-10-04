import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free Background Changer | Change Image Background Online | Customize Background | UnderlayX AI",
  description:
    "Change image backgrounds instantly with our free AI-powered background changer. Customize background, replace photo backgrounds, and enhance your images professionally. Start changing backgrounds now!",
  keywords:
    "change background, background changer, customize background, change image background, photo background changer, background replacement, free background changer, no signup background editor, ai background changer, online background changer, image background editor, custom background tool, replace background, background customization",
  openGraph: {
    title:
      "Free Background Changer | Change & Customize Image Background Online",
    description:
      "Change and customize image backgrounds instantly with our free AI tool. Professional background replacement and customization. Start changing backgrounds now!",
    images: ["/shirtafter.jpg"],
    type: "website",
    url: "https://www.underlayx.com/change-background",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Background Changer | Customize Background | UnderlayX AI",
    description:
      "Change and customize image backgrounds instantly. Free AI tool. Start changing backgrounds now!",
    images: ["/shirtafter.jpg"],
  },
  alternates: {
    canonical: "https://www.underlayx.com/change-background",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Background Changer | UnderlayX AI",
    description:
      "Free AI-powered background changer tool. Change and customize image backgrounds instantly. Start changing backgrounds now!",
    url: "https://www.underlayx.com/change-background",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    permissions: "no registration required",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to use. Start changing backgrounds now!",
    },
    featureList: [
      "Change image backgrounds",
      "Customize background colors",
      "AI-powered background replacement",
      "Professional background editing",
      "Natural blending effects",
      "Free to use",
      "No signup required",
    ],
    screenshot: "https://www.underlayx.com/shirtafter.jpg",
    softwareVersion: "1.0",
    releaseNotes: "Free AI-powered background changer and customization tool",
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
