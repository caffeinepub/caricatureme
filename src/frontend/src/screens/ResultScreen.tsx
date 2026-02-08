import { Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
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
  const [showSourcePhoto, setShowSourcePhoto] = useState(false);
  
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
      const filename = `caricature-${result.timestamp}.png`;
      await downloadPng(result.imageUrl, filename);
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
              alt="Generated caricature"
              className="w-full aspect-square object-contain rounded-xl"
            />
          </div>

          {result.photoDataUrl && (
            <div className="space-y-2">
              <button
                onClick={() => setShowSourcePhoto(!showSourcePhoto)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ImageIcon className="h-4 w-4" />
                {showSourcePhoto ? t('photo_hide_source') : t('photo_show_source')}
              </button>
              
              {showSourcePhoto && (
                <div className="rounded-xl overflow-hidden border-2 border-muted">
                  <img
                    src={result.photoDataUrl}
                    alt="Source photo"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              )}
            </div>
          )}

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
