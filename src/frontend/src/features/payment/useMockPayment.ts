import { useState } from 'react';

export async function processPayment() {
  await new Promise(res => setTimeout(res, 1000));
  // Always return success
  return { success: true };
}

export function useMockPayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      // Always succeeds - no error path
      const result = await processPayment();
      
      // Mark as paid
      localStorage.setItem('caricature_paid', 'true');
      
      return result;
    } catch {
      // Even if something unexpected happens, return success
      localStorage.setItem('caricature_paid', 'true');
      return { success: true };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment: handleProcessPayment, isProcessing };
}
