'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { SHAPES } from '@/constants/shapes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Add this helper function
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export function CanvasPreview() {
  const { 
    image, 
    textSets, 
    shapeSets, 
    imageEnhancements, 
    hasTransparentBackground, 
    foregroundPosition, 
    hasChangedBackground, 
    clonedForegrounds,
    backgroundImages,
    backgroundColor,
    foregroundSize,
    movableObject,     // Add this
    inpaintedBackground // Add this
  } = useEditor();

  // Remove get from destructuring and use useEditor() directly when needed
  const editor = useEditor(); // Add this line to get access to the full store

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const fgImageRef = useRef<HTMLImageElement | null>(null);
  const bgImagesRef = useRef<Map<number, HTMLImageElement>>(new Map()); // Add this line
  const renderRequestRef = useRef<number | undefined>(undefined);
  const { toast } = useToast();


  // Memoize the filter string
  const filterString = useMemo(() => `
    brightness(${imageEnhancements.brightness}%)
    contrast(${imageEnhancements.contrast}%)
    saturate(${imageEnhancements.saturation}%)
    opacity(${100 - imageEnhancements.fade}%)
  `, [imageEnhancements]);

  // Add this new function to handle background image loading
  const loadBackgroundImage = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }, []);

  // Add this effect to handle background images loading
  useEffect(() => {
    const loadImages = async () => {
      const newBgImages = new Map();
      
      for (const bgImage of backgroundImages) {
        if (!bgImagesRef.current.has(bgImage.id)) {
          const img = await loadBackgroundImage(bgImage.url);
          newBgImages.set(bgImage.id, img);
        } else {
          newBgImages.set(bgImage.id, bgImagesRef.current.get(bgImage.id)!);
        }
      }
      
      bgImagesRef.current = newBgImages;
      render();
    };

    loadImages();
  }, [backgroundImages, loadBackgroundImage]);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !bgImageRef.current) return;

    // Cancel any pending render
    if (renderRequestRef.current) {
      cancelAnimationFrame(renderRequestRef.current);
    }

    // Schedule next render
    renderRequestRef.current = requestAnimationFrame(async () => {
      // Set canvas size to match background image
      canvas.width = bgImageRef.current!.width;
      canvas.height = bgImageRef.current!.height;

      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // First, handle background color if set
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (hasTransparentBackground) {
        const pattern = ctx.createPattern(createCheckerboardPattern(), 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (image.background) {
        // Draw background image only if no color is set
        ctx.filter = filterString;
        ctx.drawImage(bgImageRef.current!, 0, 0);
        ctx.filter = 'none';
      }

      // Draw background images
      for (const bgImage of backgroundImages) {
        const img = bgImagesRef.current.get(bgImage.id);
        if (!img) continue;
        
        ctx.save();
        
        const x = (canvas.width * bgImage.position.horizontal) / 100;
        const y = (canvas.height * bgImage.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((bgImage.rotation * Math.PI) / 180);
        ctx.globalAlpha = bgImage.opacity;

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * bgImage.scale) / 100;
        
        ctx.drawImage(
          img,
          -scale / 2,
          -scale / 2,
          scale,
          scale
        );
        
        ctx.restore();
      }

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
          toast({variant:'destructive', title: "Something went wrong. Please try again."});
          console.warn(`Failed to render text: ${textSet.text}`, error);
        } finally {
          ctx.restore();
        }
      });

      // Draw original foreground
      if (fgImageRef.current) {
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        const scale = Math.min(
          canvas.width / fgImageRef.current.width,
          canvas.height / fgImageRef.current.height
        );
        
        const sizeMultiplier = foregroundSize / 100;
        const newWidth = fgImageRef.current.width * scale * sizeMultiplier;
        const newHeight = fgImageRef.current.height * scale * sizeMultiplier;
        
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        if (hasTransparentBackground || hasChangedBackground) {
          const offsetX = (canvas.width * foregroundPosition.x) / 100;
          const offsetY = (canvas.height * foregroundPosition.y) / 100;
          ctx.drawImage(fgImageRef.current, x + offsetX, y + offsetY, newWidth, newHeight);
        } else {
          ctx.drawImage(fgImageRef.current, x, y, newWidth, newHeight);
        }

        // Draw cloned foregrounds
        clonedForegrounds.forEach(clone => {
          const scale = Math.min(
            canvas.width / fgImageRef.current!.width,
            canvas.height / fgImageRef.current!.height
          );
          
          const newWidth = fgImageRef.current!.width * scale * (clone.size / 100);
          const newHeight = fgImageRef.current!.height * scale * (clone.size / 100);
          
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
          
          const offsetX = (canvas.width * clone.position.x) / 100;
          const offsetY = (canvas.height * clone.position.y) / 100;

          // Save context state before transformations
          ctx.save();

          // Move to center of where we want to draw the image
          ctx.translate(x + offsetX + newWidth / 2, y + offsetY + newHeight / 2);
          
          // Rotate around the center
          ctx.rotate((clone.rotation * Math.PI) / 180);
          
          // Draw image centered at origin
          ctx.drawImage(
            fgImageRef.current!, 
            -newWidth / 2, 
            -newHeight / 2, 
            newWidth, 
            newHeight
          );

          // Restore context state
          ctx.restore();
        });
      }

      // Replace get().inpaintedBackground with direct access
      if (inpaintedBackground) {
        const inpaintedImg = await loadImage(inpaintedBackground);
        ctx.drawImage(inpaintedImg, 0, 0, canvas.width, canvas.height);
      }

      // Replace get().movableObject with direct access
      if (movableObject.url) {
        const objImg = await loadImage(movableObject.url);
        
        ctx.save();
        
        const scale = Math.min(
          canvas.width / objImg.width,
          canvas.height / objImg.height
        );
        
        const newWidth = objImg.width * scale * (movableObject.scale / 100);
        const newHeight = objImg.height * scale * (movableObject.scale / 100);
        
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;
        
        const offsetX = (canvas.width * movableObject.position.x) / 100;
        const offsetY = (canvas.height * movableObject.position.y) / 100;

        ctx.translate(x + offsetX + newWidth / 2, y + offsetY + newHeight / 2);
        ctx.rotate((movableObject.rotation * Math.PI) / 180);
        ctx.drawImage(objImg, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
        
        ctx.restore();
      }
    });
  }, [
    textSets, 
    shapeSets, 
    filterString, 
    hasTransparentBackground, 
    hasChangedBackground, 
    foregroundPosition, 
    clonedForegrounds, 
    backgroundImages, 
    backgroundColor, 
    foregroundSize,
    movableObject,
    inpaintedBackground
  ]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
      bgImagesRef.current.clear(); // Clean up loaded images on unmount
    };
  }, []);

  useEffect(() => {
    if (!hasTransparentBackground && !image.background) return;
    if (hasTransparentBackground && !image.foreground) return;

    // Load appropriate image based on transparency state
    const img = new Image();
    img.src = hasTransparentBackground ? image.foreground! : image.background!;
    img.onload = () => {
      bgImageRef.current = img;
      render();
    };

    // Load foreground image if not in transparent mode
    if (!hasTransparentBackground && image.foreground) {
      const fgImg = new Image();
      fgImg.src = image.foreground;
      fgImg.onload = () => {
        fgImageRef.current = fgImg;
        render();
      };
    }
  }, [image.background, image.foreground, hasTransparentBackground, foregroundPosition, foregroundSize]); // Add foregroundSize here

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

  // Re-render on text, shape, imageEnhancements, and foregroundPosition changes
  useEffect(() => {
    render();
  }, [
    textSets, 
    shapeSets, 
    imageEnhancements, 
    foregroundPosition, 
    clonedForegrounds, 
    hasChangedBackground, 
    backgroundColor,
    foregroundSize  // Add foregroundSize here
  ]);

  // Add an effect specifically for movable object changes
  useEffect(() => {
    if (movableObject.url) {
      render();
    }
  }, [
    movableObject.url,
    movableObject.position.x,
    movableObject.position.y,
    movableObject.scale,
    movableObject.rotation,
    render
  ]);

  return (
    <div className="relative w-full h-full">
      <div className={cn(
        "absolute inset-0",
        "flex items-center justify-center",
        "overflow-hidden"
      )}>
        <canvas
          ref={canvasRef}
          className={cn(
            "max-w-full max-h-full",
            "object-contain",
            "rounded-xl" // Rounded corners for canvas
          )}
        />
      </div>
    </div>
  );
}

// Add helper function for transparency visualization
function createCheckerboardPattern() {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size * 2, size * 2);
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return canvas;
}
