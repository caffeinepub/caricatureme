// Razorpay integration placeholder
// This will remain disabled unless a Razorpay key is configured

import { env, isRazorpayConfigured } from '../../config/env';

export function initRazorpay(amount: number, onSuccess: () => void) {
  if (!isRazorpayConfigured()) {
    console.warn('Razorpay key not configured. Using mock payment.');
    return null;
  }

  // Razorpay integration would go here
  // This is a placeholder and won't execute without proper configuration
  return {
    open: () => {
      console.log('Razorpay integration not fully configured');
    }
  };
}
