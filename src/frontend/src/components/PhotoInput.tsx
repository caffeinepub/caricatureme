import { useState, useEffect } from 'react';
import { Camera, Upload, X, RotateCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '../camera/useCamera';
import { useI18n } from '../features/i18n/useI18n';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhotoInputProps {
  onPhotoSelected: (photoDataUrl: string, file: File) => void;
  initialPhoto?: string;
}

export default function PhotoInput({ onPhotoSelected, initialPhoto }: PhotoInputProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: isCameraLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
    format: 'image/jpeg',
  });

  useEffect(() => {
    if (initialPhoto) {
      setMode('preview');
      setPhotoPreview(initialPhoto);
    }
  }, [initialPhoto]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoPreview(dataUrl);
      setSelectedFile(file);
      setMode('preview');
      onPhotoSelected(dataUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCamera = async () => {
    setMode('camera');
    await startCamera();
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoPreview(dataUrl);
        setSelectedFile(file);
        setMode('preview');
        onPhotoSelected(dataUrl, file);
      };
      reader.readAsDataURL(file);
      await stopCamera();
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    setMode('select');
  };

  const handleRetakePhoto = async () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    setMode('camera');
    await startCamera();
  };

  if (mode === 'preview' && photoPreview) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 p-4">
          <img
            src={photoPreview}
            alt="Selected photo"
            className="w-full aspect-square object-cover rounded-xl"
          />
          <button
            onClick={handleRemovePhoto}
            className="absolute top-6 right-6 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors shadow-lg"
            aria-label={t('photo_remove')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleRetakePhoto}
          className="w-full h-12 text-base font-semibold rounded-xl"
        >
          <RotateCw className="mr-2 h-5 w-5" />
          {t('photo_retake')}
        </Button>
      </div>
    );
  }

  if (mode === 'camera') {
    return (
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-black" style={{ minHeight: '400px', aspectRatio: '1' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ minHeight: '400px' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
              <Alert variant="destructive" className="max-w-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{cameraError.message}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {cameraError ? (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={retry}
              className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isCameraLoading}
            >
              {isCameraLoading ? t('camera_starting') : t('camera_retry')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                stopCamera();
                setMode('select');
              }}
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              {t('back')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                stopCamera();
                setMode('select');
              }}
              className="h-12 text-base font-semibold rounded-xl"
              disabled={isCameraLoading}
            >
              {t('back')}
            </Button>
            <Button
              type="button"
              onClick={handleCapture}
              className="h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!isActive || isCameraLoading}
            >
              <Camera className="mr-2 h-5 w-5" />
              {t('photo_capture')}
            </Button>
          </div>
        )}

        {isActive && !cameraError && (
          <Button
            type="button"
            variant="outline"
            onClick={() => switchCamera()}
            className="w-full h-12 text-base font-semibold rounded-xl"
            disabled={isCameraLoading}
          >
            <RotateCw className="mr-2 h-5 w-5" />
            {t('camera_switch')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center space-y-4 bg-muted/20">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
            <Upload className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold mb-1">{t('photo_upload_title')}</p>
          <p className="text-sm text-muted-foreground">{t('photo_upload_description')}</p>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="photo-upload">
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Upload className="mr-2 h-5 w-5" />
            {t('photo_upload_button')}
          </Button>
        </label>

        {isSupported && (
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenCamera}
            className="w-full h-12 text-base font-semibold rounded-xl"
          >
            <Camera className="mr-2 h-5 w-5" />
            {t('photo_camera_button')}
          </Button>
        )}

        {isSupported === false && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t('camera_not_supported')}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
