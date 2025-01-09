'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { SHAPES } from '@/constants/shapes';

export function CanvasPreview() {
  const { image, textSets, shapeSets, imageEnhancements, foregroundPosition } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const fgImageRef = useRef<HTMLImageElement | null>(null);
  const renderRequestRef = useRef<number | undefined>(undefined);

  // Memoize the filter string
  const filterString = useMemo(() => `
    brightness(${imageEnhancements.brightness}%)
    contrast(${imageEnhancements.contrast}%)
    saturate(${imageEnhancements.saturation}%)
    opacity(${100 - imageEnhancements.fade}%)
  `, [imageEnhancements]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !bgImageRef.current) return;

    // Cancel any pending render
    if (renderRequestRef.current) {
      cancelAnimationFrame(renderRequestRef.current);
    }

    // Schedule next render
    renderRequestRef.current = requestAnimationFrame(() => {
      // Set canvas size to match background image
      canvas.width = bgImageRef.current!.width;
      canvas.height = bgImageRef.current!.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply image enhancements
      ctx.filter = filterString;

      // Draw background
      ctx.drawImage(bgImageRef.current!, 0, 0);

      // Draw shapes with consistent scaling
      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        // Move to position
        ctx.translate(x, y);
        
        // Apply rotation
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);

        // Calculate scale
        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * (shapeSet.scale / 100)) / 1000;
        
        // Move to center, scale, then move back
        ctx.translate(-0.5, -0.5);  // Move to center of shape path
        ctx.scale(scale, scale);    // Apply scaling
        ctx.translate(0.5, 0.5);    // Move back

        // Add glow effect if enabled
        if (shapeSet.glow?.enabled) {
          ctx.shadowColor = shapeSet.glow.color;
          ctx.shadowBlur = shapeSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Set opacity
        ctx.globalAlpha = shapeSet.opacity;

        // Find shape path and draw
        const shape = SHAPES.find(s => s.value === shapeSet.type);
        if (shape) {
          const path = new Path2D(shape.path);
          
          if (shapeSet.isFilled) {
            ctx.fillStyle = shapeSet.color;
            ctx.fill(path);
          } else {
            ctx.strokeStyle = shapeSet.color;
            ctx.lineWidth = shapeSet.strokeWidth || 2;
            ctx.stroke(path);
          }
        }
        
        ctx.restore();
      });

      // Draw text layers with font family and weight
      textSets.forEach(textSet => {
        ctx.save();
        
        try {
          // Create proper font string
          const fontString = `${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}"`;
          
          // Set the font
          ctx.font = fontString;
          ctx.fillStyle = textSet.color;
          ctx.globalAlpha = textSet.opacity;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
  
          const x = (canvas.width * textSet.position.horizontal) / 100;
          const y = (canvas.height * textSet.position.vertical) / 100;
  
          ctx.translate(x, y);
          ctx.rotate((textSet.rotation * Math.PI) / 180);
  
          // Add glow effect if enabled
          if (textSet.glow?.enabled && textSet.glow.color && textSet.glow.intensity > 0) {
            ctx.shadowColor = textSet.glow.color;
            ctx.shadowBlur = textSet.glow.intensity;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
  
          ctx.fillText(textSet.text, 0, 0);
        } catch (error) {
          console.warn(`Failed to render text: ${textSet.text}`, error);
        } finally {
          ctx.restore();
        }
      });

      // Draw foreground with correct dimensions - FIX HERE
      if (fgImageRef.current) {
        ctx.filter = 'none'; // Reset filter before drawing foreground
        ctx.globalAlpha = 1; // Reset opacity
        ctx.drawImage(
          fgImageRef.current,
          foregroundPosition.x, // Use from props instead of get()
          foregroundPosition.y, // Use from props instead of get()
          canvas.width,
          canvas.height
        );
      }
    });
  }, [textSets, shapeSets, filterString, foregroundPosition]); // Add foregroundPosition to dependencies

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const activeBackground = image.customBackground || image.background;
    if (!activeBackground) return;

    // Load background image
    const bgImg = new Image();
    bgImg.src = activeBackground;
    bgImg.onload = () => {
      bgImageRef.current = bgImg;
      render();
    };

    // Load foreground image if exists
    if (image.foreground) {
      const fgImg = new Image();
      fgImg.src = image.foreground;
      fgImg.onload = () => {
        fgImageRef.current = fgImg;
        render();
      };
    }
  }, [image.background, image.customBackground, image.foreground]);

  useEffect(() => {
    // Load all fonts used in text sets
    const loadFonts = async () => {
      const fontPromises = textSets.map(textSet => {
        // Create proper font string for loading
        const fontString = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
        return document.fonts.load(fontString);
      });
      await Promise.all(fontPromises);
      render();
    };
    
    loadFonts();
  }, [textSets]);

  // Re-render on text or shape changes
  useEffect(() => {
    render();
  }, [textSets, shapeSets, imageEnhancements, foregroundPosition]); // Add foregroundPosition to dependencies

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
    />
  );
}
