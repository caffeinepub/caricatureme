import { useState } from 'react';
import { type GenerationResult } from './generationState';

export function useCaricatureGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    name: string,
    job: string,
    description: string,
    artStyle: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate generation delay (3-5 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Generate Dicebear avatar URL using name as seed
      const seed = encodeURIComponent(name);
      const imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

      const result: GenerationResult = {
        name,
        job,
        description,
        artStyle,
        imageUrl,
        timestamp: Date.now(),
      };

      localStorage.setItem('caricature_result', JSON.stringify(result));
      
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

  const clearAttempt = () => {
    localStorage.removeItem('caricature_result');
    localStorage.removeItem('caricature_paid');
    setError(null);
  };

  return {
    generate,
    isGenerating,
    error,
    getResult,
    clearAttempt,
  };
}
