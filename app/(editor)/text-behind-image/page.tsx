'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function TextBehindImagePage() {
  return (
    <TransformationPage
      title="Text Behind Image Transform"
      description="Add stunning text effects behind your images."
      beforeImage="/povbefore.jpg"
      afterImage="/povafter.jpg"
      beforeAlt="Original image without text behind"
      afterAlt="Image with text effect behind"
    />
  );
}
