import { useState } from 'react';
import { type GenerationResult, type GenerationInput } from './generationState';
import { env, isCaricatureApiConfigured } from '../../config/env';

export function useCaricatureGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    photoDataUrl: string,
    photoFilename?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!photoDataUrl) {
      return { success: false, error: 'No photo provided' };
    }

    setIsGenerating(true);
    setError(null);

    try {
      let imageUrl: string;

      // If API is configured, attempt to use it
      if (isCaricatureApiConfigured()) {
        try {
          const apiResult = await generateViaApi(photoDataUrl);
          if (apiResult.success && apiResult.imageUrl) {
            imageUrl = apiResult.imageUrl;
          } else {
            // API failed, fall back to placeholder
            console.warn('API generation failed, falling back to placeholder');
            imageUrl = await generatePlaceholder();
          }
        } catch (apiError) {
          // API error, fall back to placeholder
          console.warn('API error, falling back to placeholder:', apiError);
          imageUrl = await generatePlaceholder();
        }
      } else {
        // No API configured, use placeholder
        imageUrl = await generatePlaceholder();
      }

      const result: GenerationResult = {
        photoDataUrl,
        photoFilename,
        imageUrl,
        timestamp: Date.now(),
      };

      // Store both result and input
      localStorage.setItem('caricature_result', JSON.stringify(result));
      localStorage.setItem('caricature_input', JSON.stringify({ photoDataUrl, photoFilename } as GenerationInput));
      
      setIsGenerating(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      setIsGenerating(false);
      return { success: false, error: errorMessage };
    }
  };

  const generatePlaceholder = async (): Promise<string> => {
    // Simulate generation delay (3-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Generate Dicebear avatar URL using timestamp as seed
    const seed = encodeURIComponent(`photo-${Date.now()}`);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const generateViaApi = async (photoDataUrl: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const apiUrl = env.caricatureApi.url;
    const apiKey = env.caricatureApi.key;

    // Convert data URL to blob
    const response = await fetch(photoDataUrl);
    const blob = await response.blob();

    // Prepare form data
    const formData = new FormData();
    formData.append('image', blob, 'photo.jpg');

    // Make API request
    const headers: HeadersInit = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const result = await apiResponse.json();

    // Parse API response - adjust based on your API's response format
    // Expected format: { success: true, imageUrl: "https://..." }
    // or { success: true, image: "base64..." }
    if (result.imageUrl) {
      return { success: true, imageUrl: result.imageUrl };
    } else if (result.image) {
      // If API returns base64, convert to data URL
      const imageUrl = result.image.startsWith('data:') 
        ? result.image 
        : `data:image/jpeg;base64,${result.image}`;
      return { success: true, imageUrl };
    } else {
      return { success: false, error: 'Invalid API response format' };
    }
  };

  const getResult = (): GenerationResult | null => {
    try {
      const data = localStorage.getItem('caricature_result');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const getStoredInput = (): GenerationInput | null => {
    try {
      const data = localStorage.getItem('caricature_input');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const clearAttempt = () => {
    localStorage.removeItem('caricature_result');
    localStorage.removeItem('caricature_input');
    localStorage.removeItem('caricature_paid');
    setError(null);
  };

  return {
    generate,
    isGenerating,
    error,
    getResult,
    getStoredInput,
    clearAttempt,
  };
}
