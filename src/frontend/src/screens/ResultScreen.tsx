import { Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useI18n } from '../features/i18n/useI18n';
import { useCaricatureGeneration } from '../features/generation/useCaricatureGeneration';
import { downloadPng } from '../lib/downloadPng';
import { Button } from '@/components/ui/button';
import { cardStyles, primaryButtonStyles } from '../lib/uiStyles';
import { toast } from 'sonner';

interface ResultScreenProps {
  onNavigate: () => void;
}

export default function ResultScreen({ onNavigate }: ResultScreenProps) {
  const { t } = useI18n();
  const { getResult, clearAttempt } = useCaricatureGeneration();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const result = getResult();

  useEffect(() => {
    if (!result) {
      onNavigate();
    }
  }, [result, onNavigate]);

  if (!result) {
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPng(result.imageUrl, `${result.name}-caricature.png`);
      toast.success(t('download_success'));
    } catch (error) {
      toast.error(t('download_error'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCreateAnother = () => {
    clearAttempt();
    onNavigate();
  };

  return (
    <AppLayout>
      <div className={cardStyles}>
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t('your_caricature')}
        </h2>

        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 p-4">
            <img
              src={result.imageUrl}
              alt={`${result.name} caricature`}
              className="w-full aspect-square object-contain rounded-xl"
            />
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('name')}:</span>
              <span className="font-medium">{result.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('job_profession')}:</span>
              <span className="font-medium">{result.job}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t('art_style')}:</span>
              <span className="font-medium">{result.artStyle}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              className={`${primaryButtonStyles} w-full`}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading ? t('downloading') : t('download')}
            </Button>

            <Button
              onClick={handleCreateAnother}
              variant="outline"
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {t('create_another')}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
