'use client';

import { create } from 'zustand';
import { convertHeicToJpeg } from '@/lib/image-utils';
import { SHAPES } from '@/constants/shapes';
import { uploadFile } from '@/lib/upload';
import { removeBackground } from "@imgly/background-removal";

// Update the defaultCutout object
const defaultCutout = {
  enabled: false,
  width: 10,        // Changed from 20 to 10 for thinner initial outline
  color: '#FFFFFF', // Set white as default
  intensity: 100    // Keep 100 as default
};

// Add a type definition for the cutout
interface CutoutSettings {
  enabled: boolean;
  width: number; // This allows any number
  color: string;
  intensity: number; // Add new property
}

interface GlowEffect {
  enabled: boolean;
  color: string;
  intensity: number;
}

interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  color: string;
  position: { vertical: number; horizontal: number };
  opacity: number;
  rotation: number;
  glow?: GlowEffect;
  placement: 'background' | 'foreground';
}

interface ShapeSet {
  id: number;
  type: string;
  color: string;
  isFilled: boolean;
  position: { vertical: number; horizontal: number };
  scale: number;
  opacity: number;
  rotation: number;
  strokeWidth: number;
  glow?: GlowEffect;
}

interface ImageEnhancements {
  brightness: number;
  contrast: number;
  saturation: number;
  fade: number;
  exposure: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  blur?: number;    // Add this
  blacks?: number;   // Add this
}

interface ClonedForeground {
  id: number;
  position: {
    x: number;
    y: number;
  };
  size: number;
  rotation: number;
  flip: {
    horizontal: boolean;
    vertical: boolean;
  };
}

// Update the BackgroundImage interface
interface BackgroundImage {
  id: number;
  url: string;
  position: { vertical: number; horizontal: number };
  scale: number;
  opacity: number;
  rotation: number;
  glow: {
    intensity: number;  // Remove enabled and color, only keep intensity
  };
  borderRadius: number;
}

interface PendingImage {
  id: number;
  file: File;
  url: string;
  processedUrl: string | null;
  isProcessing: boolean;
  isInEditor: boolean;
  originalSize: {
    width: number;
    height: number;
  } | null;
}

interface DrawingPoint {
  x: number;
  y: number;
  size: number;
  color: string;
}

interface DrawingPath {
  id: number;
  points: DrawingPoint[];
}

interface EditorState {
  image: {
    original: string | null;
    background: string | null;
    foreground: string | null;
  };
  textSets: TextSet[];
  isProcessing: boolean;
  isConverting: boolean;
  shapeSets: ShapeSet[];
  exportQuality: 'high' | 'medium' | 'low';
  isDownloading: boolean;
  imageEnhancements: ImageEnhancements;
  originalFileName: string | null;
  processingMessage: string;
  loadedFonts: Set<string>;
  hasTransparentBackground: boolean;
  hasChangedBackground: boolean;
  foregroundPosition: {
    x: number;
    y: number;
  };
  clonedForegrounds: ClonedForeground[];
  isBackgroundRemoved: boolean;  // Add this new state
  backgroundImages: BackgroundImage[];
  backgroundColor: string | null;
  foregroundSize: number;  // Add this line
  pendingImages: PendingImage[];  // Add this line
  isProSubscriptionActive: boolean | null;  // Add this line
  drawings: DrawingPath[];
  isDrawingMode: boolean;
  drawingTool: 'pencil';  // Remove eraser option
  drawingSize: number;
  drawingColor: string;
  cutout: CutoutSettings; // Use the new interface instead of typeof defaultCutout
  backgroundDimensions: {
    width: number | null;
    height: number | null;
  };
  backgroundOpacity: number; // Add this line
  applyToBackground: boolean; // Add this line
  applyToForeground: boolean; // Add this line
  foregroundEnhancements: ImageEnhancements;
  backgroundEnhancements: ImageEnhancements;
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File, state?: { isConverting?: boolean; isProcessing?: boolean; isAuthenticated?: boolean; userId?: string }) => Promise<void>;
  downloadImage: (isAuthenticated: boolean) => Promise<void>;  // Remove quality parameter
  resetEditor: (clearImage?: boolean) => void;
  addShapeSet: (type: string) => void;
  updateShapeSet: (id: number, updates: Partial<ShapeSet>) => void;
  removeShapeSet: (id: number) => void;
  duplicateShapeSet: (id: number) => void;
  setExportQuality: (quality: 'high' | 'medium' | 'low') => void;
  updateImageEnhancements: (enhancements: ImageEnhancements) => void;
  setProcessingMessage: (message: string) => void;
  removeBackground: () => Promise<void>;
  resetBackground: () => void;
  changeBackground: () => Promise<void>; // Update the signature to not take arguments
  updateForegroundPosition: (position: { x: number; y: number }) => void;
  addClonedForeground: () => void;
  removeClonedForeground: (id: number) => void;
  updateClonedForegroundPosition: (id: number, position: { x: number; y: number }) => void;
  updateClonedForegroundTransform: (id: number, updates: Partial<{ position: { x: number; y: number }; size: number; rotation: number; flip: { horizontal: boolean; vertical: boolean } }>) => void;
  setIsProcessing: (value: boolean) => void;
  setIsConverting: (value: boolean) => void;
  addBackgroundImage: (file: File, originalSize?: { width: number; height: number } | null, id?: number) => Promise<void>;
  removeBackgroundImage: (id: number) => void;
  updateBackgroundImage: (id: number, updates: Partial<BackgroundImage>) => void;
  setBackgroundColor: (color: string | null) => void;
  updateForegroundSize: (size: number) => void;  // Add this line
  addPendingImage: (image: PendingImage) => void;
  updatePendingImage: (id: number, updates: Partial<PendingImage>) => void;
  setIsDrawingMode: (isDrawing: boolean) => void;
  setDrawingTool: (tool: 'pencil') => void;
  setDrawingSize: (size: number) => void;
  setDrawingColor: (color: string) => void;
  addDrawingPath: (path: DrawingPoint[]) => void;
  clearDrawings: () => void;
  undoLastDrawing: () => void;
  setCutoutEnabled: (enabled: boolean) => void;
  updateCutout: (updates: Partial<CutoutSettings>) => void;
  updateBackgroundOpacity: (opacity: number) => void; // Add this line
  setApplyToBackground: (value: boolean) => void; // Add this line
  setApplyToForeground: (value: boolean) => void; // Add this line
  updateForegroundEnhancements: (enhancements: ImageEnhancements) => void;
  updateBackgroundEnhancements: (enhancements: ImageEnhancements) => void;
}

// Update the helper function with more specific types and consistent behavior
export const drawBackgroundWithOpacity = (
  ctx: CanvasRenderingContext2D, 
  options: {
    backgroundColor?: string | null;
    backgroundImage?: HTMLImageElement | null;
    width: number;
    height: number;
    opacity: number;
    filter?: string;
  }
) => {
  const { backgroundColor, backgroundImage, width, height, opacity, filter } = options;
  
  // Store the original global alpha
  const originalAlpha = ctx.globalAlpha;
  const originalFilter = ctx.filter;
  
  try {
    // Set global alpha for opacity
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity / 100));

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundImage) {
      if (filter) {
        ctx.filter = filter;
      }
      ctx.drawImage(backgroundImage, 0, 0, width, height);
    }
  } finally {
    // Always restore the original values
    ctx.globalAlpha = originalAlpha;
    ctx.filter = originalFilter;
  }
};

// Modify the export of helper functions
export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const createCheckerboardPattern = (): HTMLCanvasElement => {
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
};

// Update the image loading function to ensure cross-platform compatibility
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";  // Important for CORS
    img.decoding = "async";        // Add async decoding
    
    // Add error handling
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      reject(new Error('Failed to load image'));
    };
    
    img.onload = () => {
      // Create a canvas to ensure proper image data
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw and re-encode the image to ensure proper format
      ctx.drawImage(img, 0, 0);
      try {
        // Create a new image from the canvas
        const cleanImg = new Image();
        cleanImg.onload = () => resolve(cleanImg);
        cleanImg.onerror = reject;
        cleanImg.src = canvas.toDataURL('image/png');  // Use PNG for better quality
      } catch (err) {
        reject(err);
      }
    };
    
    img.src = src;
  });
};

const filterString = (enhancements: ImageEnhancements): string => {
  const blur = enhancements.blur ?? 0;  // Use nullish coalescing
  const blacks = enhancements.blacks ?? 0;  // Use nullish coalescing
  
  return `
    brightness(${enhancements.brightness}%)
    contrast(${enhancements.contrast}%)
    saturate(${enhancements.saturation}%)
    opacity(${100 - enhancements.fade}%)
    blur(${blur}px)
    brightness(${100 - blacks}%)
  `;
};

const POSITION_UPDATE_DELAY = 8; // Reduced from 16ms

const batchedPositionUpdates = new Map<number, any>();
const batchTimeout = new Map<number, NodeJS.Timeout>();

const batchUpdate = (id: number, updates: any, updateFn: (id: number, updates: any) => void) => {
  if (batchTimeout.has(id)) {
    clearTimeout(batchTimeout.get(id));
  }

  batchedPositionUpdates.set(id, {
    ...batchedPositionUpdates.get(id),
    ...updates
  });

  batchTimeout.set(id, setTimeout(() => {
    const batchedUpdates = batchedPositionUpdates.get(id);
    if (batchedUpdates) {
      requestAnimationFrame(() => {
        updateFn(id, batchedUpdates);
        batchedPositionUpdates.delete(id);
      });
    }
    batchTimeout.delete(id);
  }, POSITION_UPDATE_DELAY));
};

const cleanupImageUrls = (state: EditorState) => {
  if (state.image.original) URL.revokeObjectURL(state.image.original);
  if (state.image.background) URL.revokeObjectURL(state.image.background);
  if (state.image.foreground) URL.revokeObjectURL(state.image.foreground);
  
  state.backgroundImages.forEach(img => {
    URL.revokeObjectURL(img.url);
  });

  state.pendingImages.forEach(img => {
    if (img.url) URL.revokeObjectURL(img.url);
    if (img.processedUrl) URL.revokeObjectURL(img.processedUrl);
  });
};

const defaultEnhancements: ImageEnhancements = {
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
};

export const useEditor = create<EditorState & EditorActions>()((set, get) => ({
  image: {
    original: null,
    background: null,
    foreground: null,
  },
  textSets: [],
  isProcessing: false,
  isConverting: false,
  shapeSets: [],
  exportQuality: 'high',
  isDownloading: false,
  imageEnhancements: {
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
  },
  originalFileName: null,
  processingMessage: '',
  loadedFonts: new Set(),
  hasTransparentBackground: false,
  hasChangedBackground: false,
  foregroundPosition: {
    x: 0,
    y: 0
  },
  clonedForegrounds: [],
  isBackgroundRemoved: false,  // Initialize the new state
  backgroundImages: [],
  backgroundColor: null,
  foregroundSize: 100,  // Default size is 100%
  pendingImages: [],  // Initialize the new state
  isProSubscriptionActive: null,  // Add this line
  drawings: [],
  isDrawingMode: false,
  drawingTool: 'pencil',  // Remove eraser option
  drawingSize: 20,  // Changed from 5 to 50
  drawingColor: '#FFFFFF',  // Changed from #000000 to #FFFFFF
  cutout: defaultCutout, // Use the default value here instead of inline object
  backgroundDimensions: {
    width: null,
    height: null,
  },
  backgroundOpacity: 100, // Default to 100%
  applyToBackground: true,  // Always true now
  applyToForeground: true,  // Always true now
  foregroundEnhancements: {
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
  },
  backgroundEnhancements: {
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
  },

  setProcessingMessage: (message) => set({ processingMessage: message }),

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'new text',
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 600,
      color: '#FFFFFF',
      position: { 
        vertical: 50, 
        horizontal: 50 
      },
      opacity: 1,
      rotation: 0,
      placement: 'background'
    }]
  })),

  updateTextSet: async (id, updates) => {
    const state = get();
    
    try {
      if (updates.position) {
        // Ensure position updates include both properties
        const currentText = state.textSets.find(set => set.id === id);
        if (!currentText) return;

        const newPosition = {
          vertical: updates.position.vertical ?? currentText.position.vertical,
          horizontal: updates.position.horizontal ?? currentText.position.horizontal
        };

        // Batch position updates
        batchUpdate(id, { position: newPosition }, (id, batchedUpdates) => {
          set(state => ({
            textSets: state.textSets.map(set => 
              set.id === id ? { ...set, ...batchedUpdates } : set
            )
          }));
        });
        return;
      }

      // Handle placement updates
      if (updates.placement) {
        set(state => ({
          textSets: state.textSets.map(set => 
            set.id === id ? { 
              ...set, 
              placement: updates.placement as 'background' | 'foreground'
            } : set
          )
        }));
        return;
      }

      if (updates.fontFamily) {
        // Load fonts in parallel
        const weightsToLoad = ['400', '700'];
        await Promise.all(
          weightsToLoad.map(weight => 
            document.fonts.load(`${weight} 16px ${updates.fontFamily}`)
          )
        );

        const newLoadedFonts = new Set(state.loadedFonts);
        newLoadedFonts.add(updates.fontFamily);
        set({ loadedFonts: newLoadedFonts });
      }

      // Use RAF for visual updates
      requestAnimationFrame(() => {
        set(state => ({
          textSets: state.textSets.map(set => 
            set.id === id ? { ...set, ...updates } : set
          )
        }));
      });
    } catch (error) {
      console.warn(`Failed to update text set (ID: ${id}):`, error);
    }
  },

  removeTextSet: (id) => set((state) => ({
    textSets: state.textSets.filter(set => set.id !== id)
  })),

  duplicateTextSet: (id) => set((state) => {
    const textSet = state.textSets.find(set => set.id === id);
    if (!textSet) return state;
    return {
      textSets: [...state.textSets, { ...textSet, id: Date.now() }]
    };
  }),

  addShapeSet: (type: string) => set((state) => ({
    shapeSets: [...state.shapeSets, {
      id: Date.now(),
      type,
      color: '#FFFFFF',
      isFilled: false,
      strokeWidth: 5,
      position: { vertical: 50, horizontal: 50 },
      scale: 500, // Changed initial scale to be 50
      opacity: 1,
      rotation: 0
    }]
  })),

  updateShapeSet: (id, updates) => {
    if (updates.position) {
      // Batch position updates
      batchUpdate(id, { position: updates.position }, (id, batchedUpdates) => {
        set(state => ({
          shapeSets: state.shapeSets.map(set => 
            set.id === id ? { ...set, ...batchedUpdates } : set
          )
        }));
      });
      return;
    }

    // Use RAF for visual updates
    requestAnimationFrame(() => {
      set(state => ({
        shapeSets: state.shapeSets.map(set => 
          set.id === id ? { ...set, ...updates } : set
        )
      }));
    });
  },

  removeShapeSet: (id) => set((state) => ({
    shapeSets: state.shapeSets.filter(set => set.id !== id)
  })),

  duplicateShapeSet: (id) => set((state) => {
    const shapeSet = state.shapeSets.find(set => set.id === id);
    if (!shapeSet) return state;
    return {
      shapeSets: [...state.shapeSets, { ...shapeSet, id: Date.now() }]
    };
  }),

  handleImageUpload: async (file: File, state?: { isConverting?: boolean; isProcessing?: boolean; isAuthenticated?: boolean; userId?: string }) => {
    // Reset relevant state first
    set(state => ({
      ...state,
      image: {
        original: null,
        background: null,
        foreground: null
      },
      textSets: [],
      shapeSets: [],
      drawings: [],
      isProcessing: true,
      processingMessage: 'Analyzing your image, please wait...'
    }));

    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      set({ originalFileName: fileName });

      // Clean up previous object URLs
      const currentState = get();
      if (currentState.image.original) URL.revokeObjectURL(currentState.image.original);
      if (currentState.image.background) URL.revokeObjectURL(currentState.image.background);
      if (currentState.image.foreground) URL.revokeObjectURL(currentState.image.foreground);

      const originalUrl = URL.createObjectURL(file);
      set(state => ({
        image: {
          ...state.image,
          original: originalUrl,
          background: originalUrl
        }
      }));

      if (file.type === 'image/heic' || file.type === 'image/heif') {
        set({ 
          isConverting: true,
          processingMessage: 'Converting your photo to a compatible format...' 
        });
        file = await convertHeicToJpeg(file);
      }

      // Remove optimization step - use original file
      const fileToUpload = file;

      set({ isProcessing: true });

      // Use client-side background removal for all users
      let foregroundUrl;
      
      try {
        // Create a new URL for the image to be processed
        const imageUrl = URL.createObjectURL(fileToUpload);
        // Use client-side background removal
        const imageBlob = await removeBackground(imageUrl);
        foregroundUrl = URL.createObjectURL(imageBlob);
        // Clean up the temporary URL
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        set({ 
          processingMessage: 'Failed to analyze image. Please try with a different image.',
          isProcessing: false 
        });
        throw new Error('Failed to analyze image. Please try with a different image.');
      }
  
      set(state => ({
        image: {
          ...state.image,
          foreground: foregroundUrl
        },
        processingMessage: 'All set! Let\'s create something beautiful!'
      }));
  
      setTimeout(() => set({ processingMessage: '' }), 2000);
  
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.';
      set({ 
        processingMessage: errorMessage,
        isProcessing: false,
        isConverting: false
      });
      // Let the component handle the toast display using the processingMessage
      throw error;
    } finally {
      set({ isConverting: false, isProcessing: false });
    }
  },

  downloadImage: async (isAuthenticated: boolean) => {
    try {
      const state = get();
      if (state.isDownloading) return; // Prevent multiple downloads

      set({ 
        isDownloading: true,
        processingMessage: 'Preparing your masterpiece...'
      });

      // Add delay to ensure dialog appears before any processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const { 
        image, 
        backgroundColor,
        textSets, 
        shapeSets, 
        hasTransparentBackground,
        hasChangedBackground,
        foregroundPosition,
        backgroundImages,
        foregroundSize,
        backgroundDimensions,
        backgroundOpacity,
        applyToBackground,
        applyToForeground,
        foregroundEnhancements,  // Add this
        backgroundEnhancements,  // Add this
      } = get();

      // Modified validation check to allow downloads with backgroundColor
      if (!image.foreground || (!image.background && !backgroundColor && !hasTransparentBackground)) {
        throw new Error('No image to download');
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Set canvas dimensions based on background state
      if (hasChangedBackground && backgroundDimensions.width && backgroundDimensions.height) {
        // Use the new background dimensions if available
        canvas.width = backgroundDimensions.width;
        canvas.height = backgroundDimensions.height;
      } else {
        // Fall back to foreground dimensions
        const fgImg = await loadImage(image.foreground);
        canvas.width = fgImg.width;
        canvas.height = fgImg.height;
      }

      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // This is where we need to modify the background drawing logic
      if (!hasTransparentBackground) {
        if (backgroundColor || image.background) {
          const bgImg = image.background ? await loadImage(image.background) : null;
          const filterToApply = applyToBackground 
            ? filterString(backgroundEnhancements)  // Use backgroundEnhancements
            : undefined;

          drawBackgroundWithOpacity(ctx, {
            backgroundColor,
            backgroundImage: bgImg,
            width: canvas.width,
            height: canvas.height,
            opacity: backgroundOpacity,
            filter: filterToApply
          });
        }
      }

      // 2. Draw background images
      for (const bgImage of backgroundImages) {
        const img = await loadImage(bgImage.url);
        
        ctx.save();
        
        const x = (canvas.width * bgImage.position.horizontal) / 100;
        const y = (canvas.height * bgImage.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((bgImage.rotation * Math.PI) / 180);
        ctx.globalAlpha = bgImage.opacity;

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * bgImage.scale) / 100;

        // Create a temporary canvas for effects
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

      // Draw all drawings
      const { drawings } = get();
      
      // Draw all drawings after background but before other elements
      drawings.forEach(path => {
        const points = path.points;
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
      });

      // 3. Draw shapes and text
      // Draw shapes
      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * (shapeSet.scale / 100)) / 1000;
        
        ctx.translate(-0.5, -0.5);
        ctx.scale(scale, scale);
        ctx.translate(0.5, 0.5);

        if (shapeSet.glow?.enabled) {
          ctx.shadowColor = shapeSet.glow.color;
          ctx.shadowBlur = shapeSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.globalAlpha = shapeSet.opacity;

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

      // Draw text that should be behind the foreground
      textSets.filter(textSet => textSet.placement === 'background').forEach(textSet => {
        ctx.save();
        
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}"`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = (canvas.width * textSet.position.horizontal) / 100;
        const y = (canvas.height * textSet.position.vertical) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        if (textSet.glow?.enabled) {
          ctx.shadowColor = textSet.glow.color;
          ctx.shadowBlur = textSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.fillText(textSet.text, 0, 0);
        
        ctx.restore();
      });

      // 4. Draw foreground LAST and ONCE
      if (image.foreground) {
        const fgImg = await loadImage(image.foreground);
        if (applyToForeground) {
          ctx.filter = filterString(foregroundEnhancements);  // Use foregroundEnhancements
        } else {
          ctx.filter = 'none';
        }
        ctx.globalAlpha = 1;

        const scale = Math.min(
          canvas.width / fgImg.width,
          canvas.height / fgImg.height
        );
        
        const sizeMultiplier = foregroundSize / 100;
        const newWidth = fgImg.width * scale * sizeMultiplier;
        const newHeight = fgImg.height * scale * sizeMultiplier;
        
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;
        
        const offsetX = (hasTransparentBackground || hasChangedBackground) ? (canvas.width * foregroundPosition.x) / 100 : 0;
        const offsetY = (hasTransparentBackground || hasChangedBackground) ? (canvas.height * foregroundPosition.y) / 100 : 0;

        // Apply cutout effect before drawing foreground
        if (get().cutout.enabled) {
          // Create a temporary canvas for the silhouette
          const outlineCanvas = document.createElement('canvas');
          const outlineCtx = outlineCanvas.getContext('2d');
          if (!outlineCtx) return;

          outlineCanvas.width = canvas.width;
          outlineCanvas.height = canvas.height;

          // Draw foreground on outline canvas
          outlineCtx.drawImage(fgImg, x + offsetX, y + offsetY, newWidth, newHeight);

          // Create outline mask
          const expandedCanvas = document.createElement('canvas');
          const expandedCtx = expandedCanvas.getContext('2d');
          if (!expandedCtx) return;

          expandedCanvas.width = canvas.width;
          expandedCanvas.height = canvas.height;

          // Set up the outline style
          const { cutout } = get();
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

        // Draw the foreground image on top
        ctx.drawImage(fgImg, x + offsetX, y + offsetY, newWidth, newHeight);

        // Draw cloned foregrounds
        for (const clone of get().clonedForegrounds) {
          const fgImg = await loadImage(image.foreground);
          const scale = Math.min(
            canvas.width / fgImg.width,
            canvas.height / fgImg.height
          );
          
          const newWidth = fgImg.width * scale * (clone.size / 100);
          const newHeight = fgImg.height * scale * (clone.size / 100);
          
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

          // Apply flip transformations
          ctx.scale(clone.flip.horizontal ? -1 : 1, clone.flip.vertical ? -1 : 1);

          // Draw image centered at origin
          ctx.drawImage(
            fgImg, 
            -newWidth / 2, 
            -newHeight / 2, 
            newWidth, 
            newHeight
          );

          // Restore context state
          ctx.restore();
        }
      }
      
      // Draw text that should be on top of the foreground
      textSets.filter(textSet => textSet.placement === 'foreground').forEach(textSet => {
        ctx.save();
        
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}"`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = (canvas.width * textSet.position.horizontal) / 100;
        const y = (canvas.height * textSet.position.vertical) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        if (textSet.glow?.enabled) {
          ctx.shadowColor = textSet.glow.color;
          ctx.shadowBlur = textSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.fillText(textSet.text, 0, 0);
        
        ctx.restore();
      });

      try {
        // Convert canvas to blob with maximum quality
        canvas.toBlob(async (blob) => {
          if (!blob) {
            throw new Error('Failed to create blob from canvas');
          }
      
          const timestamp = Math.floor(Date.now() / 1000);
          const fileName = `UnderlayXAI_${timestamp}.png`;
          const blobUrl = URL.createObjectURL(blob);
      
          try {
            // Create and trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
      
            // Cleanup after a short delay
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
            }, 1000);
      
            set({ 
              isDownloading: false,
              processingMessage: 'Download complete!' 
            });
          } catch (error) {
            console.error('Download error:', error);
          }
        }, 'image/png', 1.0); // Maximum PNG quality
      
      } catch (error) {
        console.error('Canvas to Blob error:', error);
        set({ 
          isDownloading: false,
          processingMessage: 'Download failed. Please try again.' 
        });
      }

    } catch (error) {
      console.error('Download error:', error);
      set({ 
        isDownloading: false,
        processingMessage: 'Download failed. Please try again.' 
      });
    }
  },

  resetEditor: (clearImage = true) => set((state) => {
    // Clean up existing object URLs to prevent memory leaks
    if (clearImage) {
      cleanupImageUrls(state);
    }

    return {
      textSets: [],
      shapeSets: [],
      imageEnhancements: { ...defaultEnhancements },
      foregroundEnhancements: { ...defaultEnhancements }, // Add this
      backgroundEnhancements: { ...defaultEnhancements }, // Add this
      clonedForegrounds: [],
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 },
      processingMessage: '',
      isProcessing: false,
      isConverting: false,
      isDownloading: false,
      backgroundImages: [],
      image: clearImage ? {
        original: null,
        background: null,
        foreground: null
      } : state.image,
      loadedFonts: new Set(),
      isProSubscriptionActive: null,  // Add this line
      drawings: [],
      isDrawingMode: false,
      drawingTool: 'pencil',  // Remove eraser option
      drawingSize: 20,
      drawingColor: '#ffffff',
    };
  }),

  setExportQuality: (quality) => set({ exportQuality: quality }),
  updateImageEnhancements: (enhancements) => set({ imageEnhancements: enhancements }),
  removeBackground: async () => {
    const { image } = get();
    if (!image.foreground) return;

    set(state => ({
      image: {
        ...state.image,
        background: null
      },
      hasTransparentBackground: true,
      isBackgroundRemoved: true,
      processingMessage: 'Background removed!'
    }));

    setTimeout(() => set({ processingMessage: '' }), 1000);
  },

  resetBackground: () => {
    const { image } = get();
    if (!image.original) return;

    // Clean up background image URLs before resetting
    const state = get();
    state.backgroundImages.forEach(img => {
      URL.revokeObjectURL(img.url);
    });

    set(state => ({
      image: {
        ...state.image,
        background: image.original
      },
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 },
      backgroundImages: [],
      backgroundColor: null,  // Reset background color
      foregroundSize: 100,
      backgroundDimensions: {  // Reset dimensions
        width: null,
        height: null
      }
    }));
  },

  changeBackground: async () => {
    try {
      const file = await uploadFile();
      if (!file) return;

      set({ 
        isProcessing: true,
        processingMessage: 'Changing background...'
      });

      // Create a promise to get image dimensions
      const getDimensions = (url: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.src = url;
        });
      };

      const backgroundUrl = URL.createObjectURL(file);
      const dimensions = await getDimensions(backgroundUrl);

      set(state => ({
        image: {
          ...state.image,
          background: backgroundUrl
        },
        hasTransparentBackground: false,
        hasChangedBackground: true,
        isBackgroundRemoved: false,
        backgroundDimensions: {
          width: dimensions.width,
          height: dimensions.height
        },
        isProcessing: false,
        processingMessage: 'Background changed successfully!'
      }));

      setTimeout(() => set({ processingMessage: '' }), 2000);
    } catch (error) {
      console.error('Error changing background:', error);
      set({ 
        processingMessage: 'Failed to change background. Please try again.',
        isProcessing: false
      });
    }
  },

  updateForegroundPosition: ({ x, y }) => {
    set({ foregroundPosition: { x, y } });
  },

  addClonedForeground: () => {
    const { image } = get();
    if (!image.foreground) return;

    set((state) => ({
      clonedForegrounds: [
        ...state.clonedForegrounds,
        {
          id: Date.now(),
          position: { x: 5, y: 0 },
          size: 100,
          rotation: 0,
          flip: {
            horizontal: false,
            vertical: false
          }
        }
      ]
    }));
  },

  removeClonedForeground: (id) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.filter(clone => clone.id !== id)
  })),

  updateClonedForegroundPosition: (id, position) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.map(clone =>
      clone.id === id ? { ...clone, position } : clone
    )
  })),

  updateClonedForegroundTransform: (id, updates) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.map(clone =>
      clone.id === id ? {
        ...clone,
        ...updates,
        // Ensure flip property is properly merged
        flip: updates.flip ? { ...clone.flip, ...updates.flip } : clone.flip
      } : clone
    )
  })),
  setIsProcessing: (value: boolean) => set({ isProcessing: value }),
  setIsConverting: (value: boolean) => set({ isConverting: value }),
  addBackgroundImage: async (file: File, originalSize?: { width: number; height: number } | null, id?: number) => {
    try {
      const { backgroundImages } = get();
      if (backgroundImages.length >= 2) {
        throw new Error('Maximum of 2 background images allowed');
      }

      const url = URL.createObjectURL(file);
      
      // Calculate scale that preserves aspect ratio
      let initialScale = 50;
      if (originalSize) {
        const aspectRatio = originalSize.width / originalSize.height;
        initialScale = aspectRatio > 1 ? 100 : 100 * aspectRatio;
      }

      set((state) => ({
        backgroundImages: [
          ...state.backgroundImages,
          {
            id: id || Date.now(),
            url,
            position: { vertical: 50, horizontal: 50 },
            scale: initialScale,
            opacity: 1,
            rotation: 0,
            glow: {
              intensity: 0  // Simplified glow object
            },
            borderRadius: 0
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding background image:', error);
      throw error; // Re-throw to handle in the component
    }
  },

  removeBackgroundImage: (id) => set((state) => {
    // Find the image to clean up its URL
    const imageToRemove = state.backgroundImages.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove from both pendingImages and backgroundImages arrays
    const filteredBackgroundImages = state.backgroundImages.filter(img => img.id !== id);
    const filteredPendingImages = state.pendingImages.filter(img => img.id !== id);

    // If all background images are removed, reset related states
    const shouldResetBackground = filteredBackgroundImages.length === 0;

    return {
      backgroundImages: filteredBackgroundImages,
      pendingImages: filteredPendingImages,
      ...(shouldResetBackground && {
        hasChangedBackground: false,
        hasTransparentBackground: false,
        backgroundColor: null,
        image: {
          ...state.image,
          background: state.image.original
        }
      })
    };
  }),

  updateBackgroundImage: (id, updates) => set((state) => ({
    backgroundImages: state.backgroundImages.map(img =>
      img.id === id ? { ...img, ...updates } : img
    )
  })),
  setBackgroundColor: (color) => {
    const { image } = get();
    
    set(state => ({
      backgroundColor: color,
      // Reset background image if color is selected
      image: {
        ...state.image,
        background: color ? null : image.original
      },
      hasChangedBackground: true
    }));
  },
  
  updateForegroundSize: (size) => set({ foregroundSize: size }),

  addPendingImage: (image: PendingImage) => set(state => ({
    pendingImages: [...state.pendingImages, image]
  })),

  updatePendingImage: (id: number, updates: Partial<PendingImage>) => set(state => ({
    pendingImages: state.pendingImages.map(img =>
      img.id === id ? { ...img, ...updates } : img
    )
  })),

  setIsDrawingMode: (isDrawing) => {
    set(state => ({
      isDrawingMode: isDrawing,
      // Reset currentPath when exiting drawing mode
      drawings: isDrawing ? state.drawings : [...state.drawings]
    }));
  },

  setDrawingTool: (tool) => set({ drawingTool: tool }),
  setDrawingSize: (size) => set({ drawingSize: size }),
  setDrawingColor: (color) => set({ drawingColor: color }),
  addDrawingPath: (path) => {
    if (path.length < 2) return; // Don't add single points
    set(state => ({
      drawings: [...state.drawings, { id: Date.now(), points: path }]
    }));
  },
  clearDrawings: () => {
    set(state => {
      // Trigger an immediate re-render after clearing drawings
      requestAnimationFrame(() => {
        // Dispatch a resize event to force canvas update
        window.dispatchEvent(new Event('resize'));
      });
      return { drawings: [] };
    });
  },

  undoLastDrawing: () => {
    set(state => {
      // Trigger an immediate re-render after undoing
      requestAnimationFrame(() => {
        // Dispatch a resize event to force canvas update
        window.dispatchEvent(new Event('resize'));
      });
      return {
        drawings: state.drawings.slice(0, -1)
      };
    });
  },

  setCutoutEnabled: (enabled) => set(state => ({
    cutout: {
      ...state.cutout,
      enabled
    }
  })),

  updateCutout: (updates: Partial<CutoutSettings>) => set(state => ({
    cutout: {
      ...state.cutout,
      ...updates
    }
  })),

  updateBackgroundOpacity: (opacity: number) => set({ backgroundOpacity: opacity }), // Add this line
  setApplyToBackground: (value: boolean) => set({ applyToBackground: value }), // Add this line
  setApplyToForeground: (value: boolean) => set({ applyToForeground: value }), // Add this line
  updateForegroundEnhancements: (enhancements) => set({ foregroundEnhancements: enhancements }),
  updateBackgroundEnhancements: (enhancements) => set({ backgroundEnhancements: enhancements }),
}));

// Update the render and download functions to use these flags
export const applyImageEnhancements = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  enhancements: ImageEnhancements,
  shouldApplyFilters: boolean
) => {
  if (shouldApplyFilters) {
    ctx.filter = filterString(enhancements);
  } else {
    ctx.filter = 'none';
  }
  return ctx;
};
