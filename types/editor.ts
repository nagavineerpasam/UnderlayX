import type { FontWeight } from '@/constants/fonts';

export interface GlowEffect {
  enabled: boolean;
  color: string;
  intensity: number;
}

export interface Position {
  horizontal: number;
  vertical: number;
}

export interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  fontWeight: FontWeight;
  fontSize: number;
  color: string;
  opacity: number;
  position: Position;
  rotation: number;
  glow?: GlowEffect;
}

export interface ShapeSet {
  id: number;
  type: string;
  color: string;
  width?: number;   // Changed from scale
  height?: number;  // Added height
  opacity: number;
  position: Position;
  rotation: number;
  isFilled: boolean;
  strokeWidth?: number;
  glow?: GlowEffect;
}

export interface ClonedForeground {
  id: string;
  position: {
    x: number;
    y: number;
  };
  size: number;  // 100 is original size
  rotation: number;  // degrees
}

export interface DrawingPoint {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface ImageEnhancements {
  brightness: number;
  contrast: number;
  saturation: number;
  fade: number;
  exposure: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  blur: number;    // Remove optional
  blacks: number;  // Remove optional
}

export const defaultEnhancements: ImageEnhancements = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  fade: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0,
  blacks: 0
} as const;
