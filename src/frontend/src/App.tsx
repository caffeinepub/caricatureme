import { useEffect, useState } from 'react';
import { ThemeProvider } from './features/theme/useTheme';
import { I18nProvider } from './features/i18n/useI18n';
import { LocalAuthProvider, useLocalAuth } from './features/auth/useLocalAuth';
import TopBar from './components/TopBar';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import UploadScreen from './screens/UploadScreen';
import UploadPhotoScreen from './screens/UploadPhotoScreen';
import ResultScreen from './screens/ResultScreen';
import { Toaster } from '@/components/ui/sonner';

type Screen = 'landing' | 'auth' | 'upload_intro' | 'upload' | 'result';

function AppContent() {
  const { isLoggedIn } = useLocalAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  // Route guards and initial screen logic
  useEffect(() => {
    const storedResult = localStorage.getItem('caricature_result');
    
    if (isLoggedIn) {
      // If logged in and we have a stored result, go to result screen
      if (storedResult && currentScreen === 'landing') {
        setCurrentScreen('result');
      } else if (currentScreen === 'auth') {
        // If logged in but on auth, go to landing
        setCurrentScreen('landing');
      }
    } else {
      // Not logged in - only allow landing and auth screens
      if (currentScreen === 'result' || currentScreen === 'upload' || currentScreen === 'upload_intro') {
        setCurrentScreen('auth');
      }
    }
  }, [isLoggedIn, currentScreen]);

  const navigateTo = (screen: Screen) => {
    // Guard navigation
    if (!isLoggedIn && (screen === 'result' || screen === 'upload' || screen === 'upload_intro')) {
      setCurrentScreen('auth');
      return;
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <TopBar />
      <main className="pt-16">
        {currentScreen === 'landing' && (
          <LandingScreen onNavigate={() => navigateTo(isLoggedIn ? 'upload_intro' : 'auth')} />
        )}
        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={() => navigateTo('landing')} />
        )}
        {currentScreen === 'upload_intro' && (
          <UploadScreen onContinue={() => navigateTo('upload')} />
        )}
        {currentScreen === 'upload' && (
          <UploadPhotoScreen
            onSuccess={() => navigateTo('result')}
            onBack={() => navigateTo('upload_intro')}
          />
        )}
        {currentScreen === 'result' && (
          <ResultScreen onNavigate={() => navigateTo('landing')} />
        )}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <LocalAuthProvider>
          <AppContent />
        </LocalAuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
