import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useI18n } from '../features/i18n/useI18n';
import { useLocalAuth } from '../features/auth/useLocalAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cardStyles, primaryButtonStyles, inputStyles, labelStyles } from '../lib/uiStyles';
import { toast } from 'sonner';

interface AuthScreenProps {
  onNavigate: () => void;
}

export default function AuthScreen({ onNavigate }: AuthScreenProps) {
  const { t } = useI18n();
  const { login, signup } = useLocalAuth();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRemember, setSignupRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(loginEmail, loginPassword, loginRemember);
    
    if (result.success) {
      toast.success(t('login_success'));
      onNavigate();
    } else {
      toast.error(result.error || t('login_error'));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup(signupEmail, signupPassword, signupRemember);
    
    if (result.success) {
      toast.success(t('signup_success'));
      onNavigate();
    } else {
      toast.error(result.error || t('signup_error'));
    }
  };

  return (
    <AppLayout>
      <div className={cardStyles}>
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t('welcome')}
        </h2>

        <Button asChild variant="outline" className="w-full mb-4">
          <a 
            href="https://mail.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('continue_with_google')}
          </a>
        </Button>

        <div className="relative mb-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            {t('or')}
          </span>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">{t('login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('sign_up')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className={labelStyles}>
                  {t('email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`${inputStyles} pl-10`}
                    placeholder={t('email_placeholder')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className={labelStyles}>
                  {t('password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`${inputStyles} pl-10`}
                    placeholder={t('password_placeholder')}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="login-remember"
                  checked={loginRemember}
                  onCheckedChange={(checked) => setLoginRemember(checked as boolean)}
                />
                <Label htmlFor="login-remember" className="text-sm cursor-pointer">
                  {t('remember_me')}
                </Label>
              </div>

              <Button type="submit" className={`${primaryButtonStyles} w-full`}>
                {t('login')}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className={labelStyles}>
                  {t('email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`${inputStyles} pl-10`}
                    placeholder={t('email_placeholder')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className={labelStyles}>
                  {t('password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={`${inputStyles} pl-10`}
                    placeholder={t('password_placeholder')}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signup-remember"
                  checked={signupRemember}
                  onCheckedChange={(checked) => setSignupRemember(checked as boolean)}
                />
                <Label htmlFor="signup-remember" className="text-sm cursor-pointer">
                  {t('remember_me')}
                </Label>
              </div>

              <Button type="submit" className={`${primaryButtonStyles} w-full`}>
                {t('sign_up')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
