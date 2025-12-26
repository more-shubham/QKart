'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'qkart_access_token';
const REFRESH_TOKEN_KEY = 'qkart_refresh_token';
const USER_KEY = 'qkart_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Refresh token every 14 minutes (before 15 min expiry)
    const interval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register(name, email, password);

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setUser(response.user);
  };

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      api.logout(refreshToken).catch(() => {});
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) return false;

    try {
      const response = await api.refreshToken(storedRefreshToken);

      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      setUser(response.user);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to get access token for API calls
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
