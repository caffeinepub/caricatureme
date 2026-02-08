import { useState, useEffect } from 'react';

interface PriceInfo {
  amount: string;
  currency: string;
  symbol: string;
}

const PRICE_MAP: Record<string, PriceInfo> = {
  IN: { amount: '50', currency: 'INR', symbol: '₹' },
  US: { amount: '0.60', currency: 'USD', symbol: '$' },
  GB: { amount: '0.50', currency: 'GBP', symbol: '£' },
  DE: { amount: '0.55', currency: 'EUR', symbol: '€' },
  FR: { amount: '0.55', currency: 'EUR', symbol: '€' },
  ES: { amount: '0.55', currency: 'EUR', symbol: '€' },
  IT: { amount: '0.55', currency: 'EUR', symbol: '€' },
  default: { amount: '0.60', currency: 'USD', symbol: '$' },
};

export function useRegionalPrice() {
  const [priceInfo, setPriceInfo] = useState<PriceInfo>(PRICE_MAP.default);

  useEffect(() => {
    const cached = localStorage.getItem('region_price');
    if (cached) {
      try {
        setPriceInfo(JSON.parse(cached));
        return;
      } catch {
        // Invalid cache
      }
    }

    // Fetch region
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country_code || 'US';
        const price = PRICE_MAP[countryCode] || PRICE_MAP.default;
        setPriceInfo(price);
        localStorage.setItem('region_price', JSON.stringify(price));
      })
      .catch(() => {
        // Use default on error
        setPriceInfo(PRICE_MAP.default);
      });
  }, []);

  const priceDisplay = `${priceInfo.symbol}${priceInfo.amount}`;

  return { priceInfo, priceDisplay };
}
