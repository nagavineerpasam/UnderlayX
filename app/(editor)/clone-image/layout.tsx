import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Image Cloning & Duplication | Professional Object Replication Tool",
  description:
    "Explore AI-driven image cloning and object duplication with UnderlayX AI. Create multiple images, replicate objects, and enhance your designs effortlessly.",
  keywords:
    "AI image cloning, duplicate objects, object replication AI, create multiple images, image duplication tool, UnderlayX AI",
  openGraph: {
    title:
      "AI Image Cloning & Duplication | Professional Object Replication Tool",
    description:
      "Explore AI-driven image cloning and object duplication with UnderlayX AI. Create multiple images, replicate objects, and enhance your designs effortlessly.",
    images: ["/appleafter.jpeg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
