'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function OverlayImagePage() {
  return (
    <TransformationPage
      title="Image Overlay Transform"
      description="Transform your images by adding stunning overlays, text, and effects. Create professional-looking visuals in minutes with intuitive editor."
      beforeImage="/personbefore.jpg"
      afterImage="/personafter.jpg"
      beforeAlt="Original image without overlay"
      afterAlt="Image with overlay effects"
    />
  );
}
