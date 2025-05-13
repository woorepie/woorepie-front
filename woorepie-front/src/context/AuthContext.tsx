// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { checkAuthStatus, login, logout } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string, phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    setLoading(true);
    const result = await checkAuthStatus();
    if (result.success && result.data) {
      setIsAuthenticated(true);
      setUser(result.data.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string, phoneNumber: string) => {
    const result = await login(email, password, phoneNumber);
    if (result.success) {
      await checkAuth(); // 로그인 후 인증 상태 갱신
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};