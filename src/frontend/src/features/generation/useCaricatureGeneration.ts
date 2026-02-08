import { useState } from 'react';
import { type GenerationResult, type GenerationInput } from './generationState';

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
      // Simulate generation delay (3-5 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Generate Dicebear avatar URL using timestamp as seed
      const seed = encodeURIComponent(`photo-${Date.now()}`);
      const imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

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
