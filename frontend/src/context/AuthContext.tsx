import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('constructai_token');

      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setState({
            user: profile,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('constructai_user', JSON.stringify(profile));
        } catch {
          localStorage.removeItem('constructai_token');
          localStorage.removeItem('constructai_user');
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };

    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('constructai_token', token);
    localStorage.setItem('constructai_user', JSON.stringify(user));
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('constructai_token');
    localStorage.removeItem('constructai_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setUser = (user: User) => {
    localStorage.setItem('constructai_user', JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  };

  const refreshProfile = async () => {
    try {
      const user = await authAPI.getProfile();
      setUser(user);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
