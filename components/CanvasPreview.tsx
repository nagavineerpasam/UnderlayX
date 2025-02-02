'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useEditor, roundRect, drawBackgroundWithOpacity } from '@/hooks/useEditor';  // Add drawBackgroundWithOpacity to imports
import { SHAPES } from '@/constants/shapes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DrawingPoint } from '@/types/editor';  // Add this import

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
    downloadImage,
    isDrawingMode,
    drawingTool,
    drawingSize,
    drawingColor,
    drawings,
    addDrawingPath,
    cutout,
    backgroundDimensions,
    backgroundOpacity,
  } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const fgImageRef = useRef<HTMLImageElement | null>(null);
  const bgImagesRef = useRef<Map<number, HTMLImageElement>>(new Map()); // Add this line
  const renderRequestRef = useRef<number | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  const [currentPath, setCurrentPath] = useState<DrawingPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

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

  // Memoize expensive calculations
  const calculateScale = useCallback((img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    return Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );
  }, []);

  // Update the render callback to use the same helper function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx || !bgImageRef.current) return;

    // Cancel any pending render
    if (renderRequestRef.current) {
      cancelAnimationFrame(renderRequestRef.current);
    }

    // Schedule next render with high priority
    renderRequestRef.current = requestAnimationFrame(() => {
      // Set canvas dimensions based on background state
      if (hasChangedBackground && backgroundDimensions.width && backgroundDimensions.height) {
        canvas.width = backgroundDimensions.width;
        canvas.height = backgroundDimensions.height;
      } else {
        canvas.width = bgImageRef.current!.width;
        canvas.height = bgImageRef.current!.height;
      }

      // Reset canvas transform and clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use the shared helper function for both preview and download
      if (!hasTransparentBackground) {
        drawBackgroundWithOpacity(ctx, {
          backgroundColor,
          backgroundImage: image.background ? bgImageRef.current : null,
          width: canvas.width,
          height: canvas.height,
          opacity: backgroundOpacity,
          filter: image.background ? filterString : undefined
        });
      } else if (hasTransparentBackground) {
        const pattern = ctx.createPattern(createCheckerboardPattern(), 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
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

        // Create a temporary canvas for the image with effects
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        // Set temp canvas size to accommodate glow
        const padding = bgImage.glow.intensity * 2;
        tempCanvas.width = scale + padding * 2;
        tempCanvas.height = scale + padding * 2;

        // First draw the image
        tempCtx.drawImage(
          img,
          padding,
          padding,
          scale,
          scale
        );

        // Apply rounded corners if needed
        if (bgImage.borderRadius > 0) {
          const radius = (bgImage.borderRadius / 100) * (scale / 2);
          // Create another temp canvas for the rounded shape
          const roundedCanvas = document.createElement('canvas');
          roundedCanvas.width = tempCanvas.width;
          roundedCanvas.height = tempCanvas.height;
          const roundedCtx = roundedCanvas.getContext('2d');
          if (!roundedCtx) continue;

          roundRect(
            roundedCtx,
            padding,
            padding,
            scale,
            scale,
            radius
          );
          roundedCtx.clip();
          roundedCtx.drawImage(tempCanvas, 0, 0);
          
          // Copy back to main temp canvas
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(roundedCanvas, 0, 0);
        }

        // Apply glow if intensity > 0
        if (bgImage.glow.intensity > 0) {
          tempCtx.shadowColor = '#ffffff'; // Always white glow
          tempCtx.shadowBlur = bgImage.glow.intensity;
          tempCtx.shadowOffsetX = 0;
          tempCtx.shadowOffsetY = 0;
          
          // Create another temp canvas to apply glow
          const glowCanvas = document.createElement('canvas');
          glowCanvas.width = tempCanvas.width;
          glowCanvas.height = tempCanvas.height;
          const glowCtx = glowCanvas.getContext('2d');
          if (!glowCtx) continue;
          
          glowCtx.drawImage(tempCanvas, 0, 0);
          tempCtx.drawImage(glowCanvas, 0, 0);
        }

        // Draw the temp canvas onto the main canvas
        ctx.drawImage(
          tempCanvas,
          -scale / 2 - padding,
          -scale / 2 - padding,
          scale + padding * 2,
          scale + padding * 2
        );
        
        ctx.restore();
      }

      // Draw drawings right after background but before shapes and text
      drawings.forEach(path => {
        drawPath(ctx, path.points);
      });

      // Draw current path (active drawing)
      if (currentPath.length > 0) {
        drawPath(ctx, currentPath);
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

        const offsetX = hasTransparentBackground || hasChangedBackground 
          ? (canvas.width * foregroundPosition.x) / 100 
          : 0;
        const offsetY = hasTransparentBackground || hasChangedBackground 
          ? (canvas.height * foregroundPosition.y) / 100 
          : 0;

        // Apply cutout effect if enabled - BEFORE drawing the foreground
        if (cutout.enabled) {
          // Create a temporary canvas for the silhouette
          const outlineCanvas = document.createElement('canvas');
          const outlineCtx = outlineCanvas.getContext('2d');
          if (!outlineCtx) return;
        
          outlineCanvas.width = canvas.width;
          outlineCanvas.height = canvas.height;
        
          // Draw foreground on outline canvas
          outlineCtx.drawImage(fgImageRef.current, x + offsetX, y + offsetY, newWidth, newHeight);
        
          // Create outline mask
          const expandedCanvas = document.createElement('canvas');
          const expandedCtx = expandedCanvas.getContext('2d');
          if (!expandedCtx) return;
        
          expandedCanvas.width = canvas.width;
          expandedCanvas.height = canvas.height;
        
          // Set up the outline style
          expandedCtx.fillStyle = cutout.color;
          expandedCtx.strokeStyle = cutout.color;
          expandedCtx.lineWidth = cutout.width;
          expandedCtx.globalAlpha = cutout.intensity / 100;
          
          // Draw expanded shape for outline
          expandedCtx.drawImage(outlineCanvas, -cutout.width/2, -cutout.width/2, 
            canvas.width + cutout.width, canvas.height + cutout.width);
          expandedCtx.globalCompositeOperation = 'source-in';
          expandedCtx.fillRect(0, 0, canvas.width, canvas.height);
        
          // Draw the outline behind the foreground
          ctx.drawImage(expandedCanvas, 0, 0);
        }

        // Draw the original foreground on top
        ctx.drawImage(fgImageRef.current, x + offsetX, y + offsetY, newWidth, newHeight);

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

          // Move to center point
          ctx.translate(x + offsetX + newWidth / 2, y + offsetY + newHeight / 2);
          
          // Apply rotation
          ctx.rotate((clone.rotation * Math.PI) / 180);
          
          // Apply flips if needed
          if (clone.flip.horizontal) ctx.scale(-1, 1);
          if (clone.flip.vertical) ctx.scale(1, -1);
          
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

    });
  }, [textSets, shapeSets, filterString, hasTransparentBackground, hasChangedBackground, foregroundPosition, clonedForegrounds, backgroundImages, backgroundColor, foregroundSize, drawings, currentPath, cutout, backgroundDimensions, backgroundOpacity]);

  // Cleanup on unmount
  useEffect(() => {
    const currentRenderRequest = renderRequestRef.current;
    const loadedBgImages = new Set([...bgImagesRef.current.values()]);

    return () => {
      if (currentRenderRequest) {
        cancelAnimationFrame(currentRenderRequest);
      }
      // Clean up image references
      loadedBgImages.clear();
      bgImagesRef.current.clear();
      bgImageRef.current = null;
      fgImageRef.current = null;
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

  // Add a useEffect for window resize event
  useEffect(() => {
    const handleResize = () => {
      render();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  // Modify the drawings effect to force immediate render
  useEffect(() => {
    render();
  }, [drawings, currentPath, render]);

  // Add a separate effect for drawings
  useEffect(() => {
    if (drawings.length > 0 || currentPath.length > 0) {
      render();
    }
  }, [drawings, currentPath, render]);

  // Add effect to reset currentPath when drawings are cleared
  useEffect(() => {
    if (drawings.length === 0) {
      setCurrentPath([]);
    }
  }, [drawings.length]);

  const handleClick = () => {
    downloadImage(true);
  };

  // Handle drawing interactions
  const handleDrawStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const point = getCanvasPoint(e, canvas);
    setCurrentPath([{
      ...point,
      size: drawingSize,
      color: drawingColor
    }]);
  };

  const handleDrawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isDrawingMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getCanvasPoint(e, canvas);
    setCurrentPath(prev => [...prev, {
      ...point,
      size: drawingSize,
      color: drawingColor
    }]);
  };

  const handleDrawEnd = () => {
    if (!isDrawing || !isDrawingMode) return;
    
    if (currentPath.length > 0) {
      addDrawingPath(currentPath);
    }
    setCurrentPath([]);
    setIsDrawing(false);
  };

  // Helper function to draw a path
  const drawPath = (ctx: CanvasRenderingContext2D, points: DrawingPoint[]) => {
    if (points.length < 2) return;
  
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
  
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
  
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = start.color;
      ctx.lineWidth = start.size;
      ctx.stroke();
    }
  
    ctx.restore();
  };

  // Helper function to get canvas coordinates
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const getCoordinates = (clientX: number, clientY: number) => ({
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    });

    if ('touches' in e) {
      const touch = e.touches[0];
      return getCoordinates(touch.clientX, touch.clientY);
    }
    
    return getCoordinates(e.clientX, e.clientY);
  };

  // Add cursor indicator for drawing tools
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCursor = (e: MouseEvent) => {
      if (!isDrawingMode) return;

      const cursorCanvas = document.createElement('canvas');
      cursorCanvas.width = drawingSize * 2;
      cursorCanvas.height = drawingSize * 2;
      const ctx = cursorCanvas.getContext('2d')!;

      ctx.beginPath();
      ctx.arc(drawingSize, drawingSize, drawingSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = drawingColor;
      ctx.fill();

      const dataURL = cursorCanvas.toDataURL();
      canvas.style.cursor = `url(${dataURL}) ${drawingSize}, auto`;
    };

    canvas.addEventListener('mousemove', updateCursor);
    return () => canvas.removeEventListener('mousemove', updateCursor);
  }, [isDrawingMode, drawingSize, drawingColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={cn(
            "max-w-full max-h-full object-contain rounded-xl",
            isDrawingMode && "cursor-crosshair"
          )}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
          onTouchStart={handleDrawStart}
          onTouchMove={handleDrawMove}
          onTouchEnd={handleDrawEnd}
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
