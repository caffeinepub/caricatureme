import { useEffect, useState } from 'react';
import { ThemeProvider } from './features/theme/useTheme';
import { I18nProvider } from './features/i18n/useI18n';
import { LocalAuthProvider, useLocalAuth } from './features/auth/useLocalAuth';
import TopBar from './components/TopBar';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import InputPaymentScreen from './screens/InputPaymentScreen';
import ResultScreen from './screens/ResultScreen';
import { Toaster } from '@/components/ui/sonner';

type Screen = 'landing' | 'auth' | 'input' | 'result';

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
      } else if (currentScreen === 'landing' || currentScreen === 'auth') {
        // If logged in but on landing/auth, go to input
        setCurrentScreen('input');
      }
    } else {
      // Not logged in - only allow landing and auth screens
      if (currentScreen === 'input' || currentScreen === 'result') {
        setCurrentScreen('auth');
      }
    }
  }, [isLoggedIn, currentScreen]);

  const navigateTo = (screen: Screen) => {
    // Guard navigation
    if (!isLoggedIn && (screen === 'input' || screen === 'result')) {
      setCurrentScreen('auth');
      return;
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <TopBar />
      <main className="pt-16">
        {currentScreen === 'landing' && <LandingScreen onNavigate={() => navigateTo('auth')} />}
        {currentScreen === 'auth' && <AuthScreen onNavigate={() => navigateTo('input')} />}
        {currentScreen === 'input' && <InputPaymentScreen onNavigate={() => navigateTo('result')} />}
        {currentScreen === 'result' && <ResultScreen onNavigate={() => navigateTo('input')} />}
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
