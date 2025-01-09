'use client';

import { create } from 'zustand';
import { removeBackground } from '@imgly/background-removal';
import { convertHeicToJpeg } from '@/lib/image-utils';
import { SHAPES } from '@/constants/shapes';

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
}

interface EditorState {
  image: {
    original: string | null;
    background: string | null;
    foreground: string | null;
    customBackground: string | null; // Add this
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
  foregroundPosition: {
    x: number;
    y: number;
  };
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File, state?: { isConverting?: boolean; isProcessing?: boolean }) => Promise<void>;
  downloadImage: () => Promise<void>;
  resetEditor: (clearImage?: boolean) => void;
  addShapeSet: (type: string) => void;
  updateShapeSet: (id: number, updates: Partial<ShapeSet>) => void;
  removeShapeSet: (id: number) => void;
  duplicateShapeSet: (id: number) => void;
  setExportQuality: (quality: 'high' | 'medium' | 'low') => void;
  updateImageEnhancements: (enhancements: ImageEnhancements) => void;
  setProcessingMessage: (message: string) => void;
  setCustomBackground: (file: File) => Promise<void>; // Add this
  updateForegroundPosition: (position: { x: number; y: number }) => void;
}

export const useEditor = create<EditorState & EditorActions>((set, get) => ({
  image: {
    original: null,
    background: null,
    foreground: null,
    customBackground: null
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
  },
  originalFileName: null,
  processingMessage: '',
  loadedFonts: new Set(),
  foregroundPosition: {
    x: 0,
    y: 0
  },
  setProcessingMessage: (message) => set({ processingMessage: message }),

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'new text',
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 350,
      color: '#FFFFFF',
      position: { vertical: 50, horizontal: 50 },
      opacity: 1,
      rotation: 0
    }]
  })),

  updateTextSet: async (id, updates) => {
    const state = get();
    
    try {
      // If there's a font update, load it first
      if (updates.fontFamily) {
        const weightsToLoad = ['400', '700'];
        const fontLoadPromises = weightsToLoad.map(weight => 
          document.fonts.load(`${weight} 16px "${updates.fontFamily}"`)
        );

        // Wait for all font weights to load
        await Promise.all(fontLoadPromises);

        // Fix the type error by ensuring fontFamily is not undefined and creating a new Set properly
        if (updates.fontFamily) {
          const newLoadedFonts = new Set(state.loadedFonts);
          newLoadedFonts.add(updates.fontFamily);
          
          set({
            loadedFonts: newLoadedFonts
          });
        }
      }

      // Update the text set after font is loaded (or immediately if no font change)
      set(state => ({
        textSets: state.textSets.map(set => 
          set.id === id 
            ? { ...set, ...updates }
            : set
        )
      }));
    } catch (error) {
      console.warn(`Failed to update text set (ID: ${id}):`, error);
      // Still update other properties even if font loading fails
      set(state => ({
        textSets: state.textSets.map(set => 
          set.id === id 
            ? { ...set, ...updates }
            : set
        )
      }));
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

  updateShapeSet: (id, updates) => set((state) => ({
    shapeSets: state.shapeSets.map(set => 
      set.id === id ? { ...set, ...updates } : set
    )
  })),

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

  handleImageUpload: async (file: File, state?: { isConverting?: boolean; isProcessing?: boolean }) => {
    // Set states if provided
    if (state?.isConverting !== undefined) set({ isConverting: state.isConverting });
    if (state?.isProcessing !== undefined) set({ isProcessing: state.isProcessing });

    if (file.name.toLowerCase().match(/\.(heic|heif)$/)) {
      set({ isConverting: true });
      set(state => ({
        image: {
          ...state.image,
          original: URL.createObjectURL(file)
        }
      }));
    } else {
      set({ isProcessing: true });
      set(state => ({
        image: {
          ...state.image,
          original: URL.createObjectURL(file)
        }
      }));
    }

    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      set({ originalFileName: fileName });

      if (file.type === 'image/heic' || file.type === 'image/heif') {
        set({ 
          isConverting: true,
          processingMessage: 'Converting your photo to a compatible format...' 
        });
        file = await convertHeicToJpeg(file);
      }

      set({ isProcessing: true });

      // More friendly loading messages
      const messages = [
        'Getting your photo ready...',
        'Working some magic...',
        'Making your photo shine...',
        'Almost ready to create something amazing...',
        'Just a few more moments...'
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        set({ processingMessage: messages[messageIndex] });
        messageIndex = (messageIndex + 1) % messages.length;
      }, 3000); // Increased to 3 seconds for better readability

      const originalUrl = URL.createObjectURL(file);
      
      set(state => ({
        image: {
          ...state.image,
          original: originalUrl,
          background: originalUrl
        }
      }));

      // Process at original quality
      const processedBlob = await removeBackground(originalUrl);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      clearInterval(messageInterval);
      set(state => ({
        image: {
          ...state.image,
          foreground: processedUrl
        },
        processingMessage: 'All set! Let\'s create something beautiful!'
      }));

      // Clear the success message after 2 seconds
      setTimeout(() => {
        set({ processingMessage: '' });
      }, 2000);

    } catch (error) {
      console.error('Error processing image:', error);
      set({ processingMessage: 'Oops! Something went wrong. Please try again.' });
      
    } finally {
      set({ isConverting: false, isProcessing: false });
    }
  },

  downloadImage: async () => {
    set({ 
      isDownloading: true,
      processingMessage: 'Preparing your masterpiece...'
    });

    const { image, textSets, shapeSets, imageEnhancements, exportQuality, originalFileName } = get();
    if (!image.background || !image.foreground) return;

    try {
      // Load fonts first with a status update
      set({ processingMessage: 'Getting everything perfect...' });
      const fontPromises = textSets.map(textSet => 
        document.fonts.load(`${textSet.fontWeight} 1rem "${textSet.fontFamily}"`)
      );
      await Promise.all(fontPromises);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Use the active background (custom or original)
      const activeBackground = image.customBackground || image.original;
      
      // Load the background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = activeBackground!;
      });

      // Maintain original dimensions
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Apply enhancements
      ctx.filter = `
        brightness(${imageEnhancements.brightness}%)
        contrast(${imageEnhancements.contrast}%)
        saturate(${imageEnhancements.saturation}%)
        opacity(${100 - imageEnhancements.fade}%)
      `;

      // Draw background
      ctx.drawImage(bgImg, 0, 0);

      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);

        // Use the same scale calculation as CanvasPreview
        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * (shapeSet.scale / 100)) / 1000;
        
        // Add center-based scaling
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

      textSets.forEach(textSet => {
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

      const fgImg = new Image();
      fgImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        fgImg.onload = resolve;
        fgImg.onerror = reject;
        fgImg.src = image.foreground!;
      });
      
      // Before drawing foreground, apply the position offset
      const { foregroundPosition } = get();
      ctx.filter = 'none';
      ctx.drawImage(
        fgImg, 
        foregroundPosition.x,
        foregroundPosition.y,
        canvas.width, 
        canvas.height
      );

      // Always use maximum quality (1.0) regardless of exportQuality setting for PNG
      const blobPromise = new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image'));
            return;
          }
          
          const now = new Date();
          const baseFileName = originalFileName || 'UnderlayXAI';
          const timestamp = [
            now.getDate().toString().padStart(2, '0'),
            (now.getMonth() + 1).toString().padStart(2, '0'),
            now.getSeconds().toString().padStart(2, '0')
          ].join('_');
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${baseFileName}_${timestamp}.png`;
          link.href = url;
          
          set({ processingMessage: 'Downloading your creation...' });
          
          // Create a promise that resolves when the download starts
          const downloadPromise = new Promise<void>((downloadResolve) => {
            link.onclick = () => {
              setTimeout(() => {
                URL.revokeObjectURL(url);
                downloadResolve();
              }, 1000); // Give enough time for the download to start
            };
          });

          link.click();
          await downloadPromise;
          resolve();
        }, 'image/png', 1.0);
      });

      await blobPromise;
      
      // Immediately clear the downloading state and show success message
      set({ 
        isDownloading: false,
        processingMessage: 'Download complete!' 
      });

      // Clear the success message after 2 seconds
      setTimeout(() => {
        set({ processingMessage: '' });
      }, 2000);

    } catch (error) {
      console.error('Error downloading image:', error);
      set({ 
        processingMessage: 'Oops! Download failed. Please try again.',
        isDownloading: false 
      });
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        set({ processingMessage: '' });
      }, 3000);
    }
  },

  resetEditor: (clearImage = true) => set((state) => ({
    textSets: [],
    shapeSets: [],
    imageEnhancements: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      fade: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      sharpness: 0,
    },
    image: clearImage ? {
      original: null,
      background: null,
      foreground: null,
      customBackground: null
    } : {
      ...state.image,
      customBackground: null,
      background: state.image.original // Reset to original background
    },
    foregroundPosition: { x: 0, y: 0 }
  })),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  updateImageEnhancements: (enhancements) => set({ imageEnhancements: enhancements }),
  setCustomBackground: async (file: File) => {
    try {
      const currentState = get();
      // Check if URL exists before revoking
      if (currentState.image.customBackground) {
        URL.revokeObjectURL(currentState.image.customBackground);
      }
      
      const url = URL.createObjectURL(file);
      set(state => ({
        image: {
          ...state.image,
          customBackground: url,
          background: url
        }
      }));
    } catch (error) {
      console.error('Error setting custom background:', error);
    }
  },
  updateForegroundPosition: (position) => set({ foregroundPosition: position }),
}));
