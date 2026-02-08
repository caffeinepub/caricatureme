import { useState } from 'react';

export function useMockPayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (): Promise<boolean> => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark as paid
    localStorage.setItem('caricature_paid', 'true');
    
    setIsProcessing(false);
    return true;
  };

  return { processPayment, isProcessing };
}
