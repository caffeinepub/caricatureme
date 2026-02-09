import { useState } from 'react';
import { type GenerationResult, type GenerationInput } from './generationState';
import { env } from '../../config/env';

const DEFAULT_STYLE = '3D Pixar';

export function useCaricatureGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    photoDataUrl: string,
    photoFilename?: string,
    style?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!photoDataUrl) {
      return { success: false, error: 'No photo provided' };
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Convert data URL to blob
      const response = await fetch(photoDataUrl);
      const imageBlob = await response.blob();

      // Create a File object with proper filename
      const filename = photoFilename || 'photo.jpg';
      const imageFile = new File([imageBlob], filename, { type: imageBlob.type || 'image/jpeg' });

      const formData = new FormData();
      // Append as 'image' field with filename (matches expected multipart field name)
      formData.append("image", imageFile);
      
      // Always append style field (use default if not provided)
      const selectedStyle = style || DEFAULT_STYLE;
      formData.append("style", selectedStyle);

      const apiUrl = env.caricatureApi.url;
      
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Caricature generation failed with status ${res.status}`);
      }

      const contentType = res.headers.get('Content-Type') || '';
      let imageUrl: string;

      // Handle binary image response
      if (contentType.startsWith('image/')) {
        const imageBlob = await res.blob();
        // Convert blob to data URL for reliable display and storage
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });
      } else {
        // Handle JSON response
        const data = await res.json();
        
        // Extract image from various possible response formats
        if (data.imageUrl) {
          imageUrl = data.imageUrl;
        } else if (data.image) {
          // Handle base64 with or without data URL prefix
          if (data.image.startsWith('data:')) {
            imageUrl = data.image;
          } else {
            // Assume base64 without prefix
            imageUrl = `data:image/jpeg;base64,${data.image}`;
          }
        } else {
          throw new Error('Invalid API response: no image data found');
        }
      }

      const result: GenerationResult = {
        photoDataUrl,
        photoFilename,
        style: selectedStyle,
        imageUrl,
        timestamp: Date.now(),
      };

      // Store both result and input
      localStorage.setItem('caricature_result', JSON.stringify(result));
      localStorage.setItem('caricature_input', JSON.stringify({ 
        photoDataUrl, 
        photoFilename,
        style: selectedStyle
      } as GenerationInput));
      
      setIsGenerating(false);
      return { success: true };
    } catch (err) {
      let errorMessage = 'Generation failed';
      
      // Detect network/fetch errors and provide actionable message
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = `Unable to reach the caricature API at ${env.caricatureApi.url}. Please verify:\n1. The API endpoint is accessible\n2. CORS is properly configured\n3. The server is accepting connections`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsGenerating(false);
      return { success: false, error: errorMessage };
    }
  };

  const getResult = (): GenerationResult | null => {
    try {
      const stored = localStorage.getItem('caricature_result');
      if (!stored) return null;
      return JSON.parse(stored) as GenerationResult;
    } catch {
      return null;
    }
  };

  const clearResult = () => {
    localStorage.removeItem('caricature_result');
    localStorage.removeItem('caricature_input');
  };

  const getStoredInput = (): GenerationInput | null => {
    try {
      const stored = localStorage.getItem('caricature_input');
      if (!stored) return null;
      return JSON.parse(stored) as GenerationInput;
    } catch {
      return null;
    }
  };

  const saveInput = (input: GenerationInput) => {
    localStorage.setItem('caricature_input', JSON.stringify(input));
  };

  return {
    generate,
    isGenerating,
    error,
    getResult,
    clearResult,
    clearAttempt: clearResult, // Alias for backward compatibility
    getStoredInput,
    saveInput,
  };
}
