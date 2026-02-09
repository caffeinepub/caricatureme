import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PhotoInput from '../components/PhotoInput';
import ArtStyleSelect from '../components/ArtStyleSelect';
import { Button } from '@/components/ui/button';
import { useI18n } from '../features/i18n/useI18n';
import { useCaricatureGeneration } from '../features/generation/useCaricatureGeneration';
import { cardStyles, primaryButtonStyles } from '../lib/uiStyles';

interface UploadPhotoScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const DEFAULT_STYLE = '3D Pixar';

export default function UploadPhotoScreen({ onSuccess, onBack }: UploadPhotoScreenProps) {
  const { t } = useI18n();
  const { generate, isGenerating, getStoredInput, saveInput, clearResult, getResult } = useCaricatureGeneration();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(DEFAULT_STYLE);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showDownload, setShowDownload] = useState<boolean>(false);

  // Restore stored input on mount
  useEffect(() => {
    const storedInput = getStoredInput();
    if (storedInput) {
      if (storedInput.photoDataUrl) {
        setPhotoDataUrl(storedInput.photoDataUrl);
      }
      setSelectedStyle(storedInput.style || DEFAULT_STYLE);
    }
  }, [getStoredInput]);

  const handlePhotoSelected = (dataUrl: string, file: File) => {
    setPhotoDataUrl(dataUrl);
    setPhotoFile(file);
    // Clear status and hide download when new photo is selected
    setStatusMessage('');
    setShowDownload(false);
    // Persist input when photo changes
    saveInput({
      photoDataUrl: dataUrl,
      photoFilename: file.name,
      style: selectedStyle,
    });
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    // Persist input when style changes
    if (photoDataUrl) {
      saveInput({
        photoDataUrl,
        photoFilename: photoFile?.name,
        style,
      });
    }
  };

  const handleGenerate = async () => {
    if (!photoDataUrl) return;

    // Clear any previous result before starting new generation
    clearResult();
    
    // Set status to exact text from requirements and hide download
    setStatusMessage('Processing... (Please wait ~20s)');
    setShowDownload(false);

    const result = await generate(photoDataUrl, photoFile?.name, selectedStyle);
    
    if (result.success) {
      // Set status to "Success!" and show download button
      setStatusMessage('Success!');
      setShowDownload(true);
    } else {
      // Show error message and keep download hidden
      setStatusMessage(`Error: ${result.error || 'Generation failed'}`);
      setShowDownload(false);
    }
  };

  const handleDownload = () => {
    const result = getResult();
    if (!result?.imageUrl) return;

    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `caricature_${Date.now()}.png`;
    link.click();
  };

  return (
    <AppLayout>
      <div className={cardStyles}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {t('photo_upload_title')}
            </h2>
            <p className="text-muted-foreground">
              {t('photo_upload_description')}
            </p>
          </div>

          <PhotoInput
            onPhotoSelected={handlePhotoSelected}
          />

          <ArtStyleSelect
            value={selectedStyle}
            onChange={handleStyleChange}
          />

          {statusMessage && (
            <div className={`text-center py-3 px-4 rounded-lg border ${
              statusMessage.startsWith('Error:') 
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                : statusMessage === 'Success!'
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                : 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
            }`}>
              <p className={`text-sm font-medium ${
                statusMessage.startsWith('Error:')
                  ? 'text-red-900 dark:text-red-100'
                  : statusMessage === 'Success!'
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-purple-900 dark:text-purple-100'
              }`}>
                {statusMessage}
              </p>
            </div>
          )}

          {photoDataUrl && (
            <div className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={primaryButtonStyles}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  t('generate_my_caricature')
                )}
              </Button>

              {showDownload && (
                <Button
                  onClick={handleDownload}
                  className={`${primaryButtonStyles} w-full`}
                  size="lg"
                >
                  Download PNG
                </Button>
              )}
            </div>
          )}

          {!photoDataUrl && (
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {t('back')}
            </Button>
          )}
        </div>
      </div>

      <footer className="text-center mt-8 text-sm text-muted-foreground">
        © 2026. Built with ❤️ using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </AppLayout>
  );
}
