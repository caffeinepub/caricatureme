import { useState } from 'react';
import { User, Briefcase, Palette, CreditCard, Loader2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useI18n } from '../features/i18n/useI18n';
import { useRegionalPrice } from '../features/pricing/useRegionalPrice';
import { useMockPayment } from '../features/payment/useMockPayment';
import { useCaricatureGeneration } from '../features/generation/useCaricatureGeneration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cardStyles, primaryButtonStyles, inputStyles, labelStyles } from '../lib/uiStyles';
import { toast } from 'sonner';

interface InputPaymentScreenProps {
  onNavigate: () => void;
}

const ART_STYLES = ['Cartoon', 'Comic', 'Anime', 'Watercolor'];

export default function InputPaymentScreen({ onNavigate }: InputPaymentScreenProps) {
  const { t } = useI18n();
  const { priceDisplay } = useRegionalPrice();
  const { processPayment, isProcessing: isPaymentProcessing } = useMockPayment();
  const { generate, isGenerating, error: generationError } = useCaricatureGeneration();

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [description, setDescription] = useState('');
  const [artStyle, setArtStyle] = useState('Cartoon');
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  const descriptionLength = description.length;
  const isDescriptionValid = descriptionLength >= 50 && descriptionLength <= 200;
  const isFormValid = name && job && isDescriptionValid && artStyle;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error(t('form_validation_error'));
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentSuccess = await processPayment();
    
    if (paymentSuccess) {
      toast.success(t('payment_success'));
      
      // Generate caricature
      const result = await generate(name, job, description, artStyle);
      
      if (result.success) {
        toast.success(t('generation_success'));
        onNavigate();
      } else {
        toast.error(result.error || t('generation_error'));
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

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={labelStyles}>
              {t('name')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputStyles} pl-10`}
                placeholder={t('name_placeholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job" className={labelStyles}>
              {t('job_profession')}
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="job"
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className={`${inputStyles} pl-10`}
                placeholder={t('job_placeholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={labelStyles}>
              {t('description')}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyles}
              placeholder={t('description_placeholder')}
              rows={4}
              required
            />
            <p className={`text-xs ${
              descriptionLength < 50 
                ? 'text-destructive' 
                : descriptionLength > 200 
                ? 'text-destructive' 
                : 'text-muted-foreground'
            }`}>
              {descriptionLength}/200 {t('characters')} 
              {descriptionLength < 50 && ` (${t('minimum')} 50)`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="art-style" className={labelStyles}>
              {t('art_style')}
            </Label>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Select value={artStyle} onValueChange={setArtStyle}>
                <SelectTrigger id="art-style" className={`${inputStyles} pl-10`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ART_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
