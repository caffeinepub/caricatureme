import { Sparkles } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useI18n } from '../features/i18n/useI18n';
import { Button } from '@/components/ui/button';
import { cardStyles, primaryButtonStyles } from '../lib/uiStyles';

interface LandingScreenProps {
  onNavigate: () => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className={cardStyles}>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              CaricatureMe
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4">
            <img
              src="/assets/generated/example-1.dim_512x512.png"
              alt="Example 1"
              className="w-full aspect-square object-cover rounded-xl shadow-md"
            />
            <img
              src="/assets/generated/example-2.dim_512x512.png"
              alt="Example 2"
              className="w-full aspect-square object-cover rounded-xl shadow-md"
            />
            <img
              src="/assets/generated/example-3.dim_512x512.png"
              alt="Example 3"
              className="w-full aspect-square object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/assets/caricature-1.jpeg"
              alt="CaricatureMe Hero"
              className="w-full h-auto object-cover"
            />
          </div>

          <Button
            onClick={onNavigate}
            className={primaryButtonStyles}
            size="lg"
          >
            {t('get_started')}
          </Button>
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
