import { useState, useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PhotoInput from '../components/PhotoInput';
import { useI18n } from '../features/i18n/useI18n';
import { useRegionalPrice } from '../features/pricing/useRegionalPrice';
import { useMockPayment } from '../features/payment/useMockPayment';
import { useCaricatureGeneration } from '../features/generation/useCaricatureGeneration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cardStyles, primaryButtonStyles, inputStyles, labelStyles } from '../lib/uiStyles';
import { toast } from 'sonner';

interface InputPaymentScreenProps {
  onNavigate: () => void;
}

export default function InputPaymentScreen({ onNavigate }: InputPaymentScreenProps) {
  const { t } = useI18n();
  const { priceDisplay } = useRegionalPrice();
  const { processPayment, isProcessing: isPaymentProcessing } = useMockPayment();
  const { generate, isGenerating, error: generationError, getStoredInput } = useCaricatureGeneration();

  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  // Load stored photo if exists
  useEffect(() => {
    const storedInput = getStoredInput();
    if (storedInput?.photoDataUrl) {
      setPhotoDataUrl(storedInput.photoDataUrl);
    }
  }, [getStoredInput]);

  const isFormValid = !!photoDataUrl;

  const handlePhotoSelected = (dataUrl: string, file: File) => {
    setPhotoDataUrl(dataUrl);
    setPhotoFile(file);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error(t('photo_required_error'));
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoDataUrl) {
      toast.error(t('photo_required_error'));
      return;
    }

    const paymentSuccess = await processPayment();
    
    if (paymentSuccess) {
      toast.success(t('payment_success'));
      
      // Generate caricature with photo
      const result = await generate(photoDataUrl, photoFile?.name);
      
      if (result.success) {
        toast.success(t('generation_success'));
        onNavigate();
      } else {
        // Show error but don't block - fallback was used
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.error(t('generation_error'));
        }
      }
    } else {
      toast.error(t('payment_error'));
    }
  };

  if (isGenerating) {
    return (
      <AppLayout>
        <div className={cardStyles}>
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full animate-pulse">
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">{t('generating')}</h2>
            <p className="text-muted-foreground">{t('generating_message')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (showPayment) {
    return (
      <AppLayout>
        <div className={cardStyles}>
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('payment')}
          </h2>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t('total_amount')}</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {priceDisplay}
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number" className={labelStyles}>
                {t('card_number')}
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="card-number"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={`${inputStyles} pl-10`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className={labelStyles}>
                  {t('expiry')}
                </Label>
                <Input
                  id="expiry"
                  type="text"
                  className={inputStyles}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className={labelStyles}>
                  {t('cvv')}
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  className={inputStyles}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1"
                disabled={isPaymentProcessing}
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                className={`${primaryButtonStyles} flex-1`}
                disabled={isPaymentProcessing}
              >
                {isPaymentProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('pay_now')
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {t('mock_payment_notice')}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={cardStyles}>
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t('create_caricature')}
        </h2>

        <form onSubmit={handleSubmitForm} className="space-y-6">
          <PhotoInput onPhotoSelected={handlePhotoSelected} initialPhoto={photoDataUrl} />

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('price_label')}</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {priceDisplay}
            </p>
          </div>

          <Button
            type="submit"
            className={`${primaryButtonStyles} w-full`}
            disabled={!isFormValid}
          >
            {t('generate_my_caricature')}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
