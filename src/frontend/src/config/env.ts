// Environment configuration with safe fallbacks
// Reads from Vite's import.meta.env (populated from .env file)

interface EnvConfig {
  razorpay: {
    key: string;
  };
  caricatureApi: {
    url: string;
    key: string;
  };
}

function getEnvVar(key: string): string {
  if (typeof import.meta.env !== 'undefined' && import.meta.env[key]) {
    return String(import.meta.env[key]);
  }
  return '';
}

export const env: EnvConfig = {
  razorpay: {
    key: getEnvVar('VITE_RAZORPAY_KEY'),
  },
  caricatureApi: {
    url: getEnvVar('VITE_CARICATURE_API_URL'),
    key: getEnvVar('VITE_CARICATURE_API_KEY'),
  },
};

// Helper to check if Razorpay is configured
export function isRazorpayConfigured(): boolean {
  return !!env.razorpay.key && env.razorpay.key.trim().length > 0;
}

// Helper to check if Caricature API is configured
export function isCaricatureApiConfigured(): boolean {
  return !!env.caricatureApi.url && env.caricatureApi.url.trim().length > 0;
}
