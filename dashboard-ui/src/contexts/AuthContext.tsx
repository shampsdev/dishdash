import React, { createContext, useContext, useState, useEffect } from 'react';
import { setupAxiosInterceptors } from '../services/api';

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
    setIsAuthenticated(true);
    setupAxiosInterceptors(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setTokenState(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors(token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, logout }}>
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