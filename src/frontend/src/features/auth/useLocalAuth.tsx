import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  email: string;
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  signup: (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'caricature_users';
const SESSION_KEY = 'caricature_session';

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const sessionData = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const { email } = JSON.parse(sessionData);
        setIsLoggedIn(true);
        setUserEmail(email);
      } catch (e) {
        // Invalid session data
      }
    }
  }, []);

  const getUsers = (): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveSession = (email: string, remember: boolean) => {
    const sessionData = JSON.stringify({ email });
    if (remember) {
      localStorage.setItem(SESSION_KEY, sessionData);
    } else {
      sessionStorage.setItem(SESSION_KEY, sessionData);
    }
  };

  const login = (email: string, password: string, remember: boolean) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsLoggedIn(true);
      setUserEmail(email);
      saveSession(email, remember);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (email: string, password: string, remember: boolean) => {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    users.push({ email, password });
    saveUsers(users);
    
    setIsLoggedIn(true);
    setUserEmail(email);
    saveSession(email, remember);
    
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('caricature_result');
    localStorage.removeItem('caricature_paid');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useLocalAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useLocalAuth must be used within LocalAuthProvider');
  }
  return context;
}
