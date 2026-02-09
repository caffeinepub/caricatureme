import { useI18n } from '../features/i18n/useI18n';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { cardStyles } from '../lib/uiStyles';
import { Camera, Upload } from 'lucide-react';

interface UploadScreenProps {
  onContinue: () => void;
}

export default function UploadScreen({ onContinue }: UploadScreenProps) {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className={cardStyles}>
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('upload_screen_title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('upload_screen_description')}
            </p>
          </div>

          <div className="flex flex-col gap-4 py-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <Upload className="w-12 h-12 text-purple-600" />
              <Camera className="w-12 h-12 text-pink-600" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('upload_screen_instructions')}
            </p>
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('upload_screen_continue')}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
