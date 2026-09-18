import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: AdminUser | null;
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (emailOrToken: string, passwordOrUser?: string | AdminUser) => Promise<void> | void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('davcom_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('davcom_admin_user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('davcom_admin_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('davcom_admin_token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile.admin);
          localStorage.setItem('davcom_admin_user', JSON.stringify(profile.admin));
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          localStorage.removeItem('davcom_admin_token');
          localStorage.removeItem('davcom_admin_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrToken: string, passwordOrUser?: string | AdminUser) => {
    if (typeof passwordOrUser === 'string') {
      // Called with email and password
      const res = await api.login(emailOrToken, passwordOrUser);
      localStorage.setItem('davcom_admin_token', res.token);
      localStorage.setItem('davcom_admin_user', JSON.stringify(res.admin));
      setToken(res.token);
      setUser(res.admin);
    } else if (passwordOrUser && typeof passwordOrUser === 'object') {
      // Called with token and user object
      localStorage.setItem('davcom_admin_token', emailOrToken);
      localStorage.setItem('davcom_admin_user', JSON.stringify(passwordOrUser));
      setToken(emailOrToken);
      setUser(passwordOrUser);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (_) {}
    localStorage.removeItem('davcom_admin_token');
    localStorage.removeItem('davcom_admin_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = !!user && (user.role === 'admin' || user.role === 'super_admin');
  const isSuperAdmin = !!user && user.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        admin: user,
        token,
        isAuthenticated: !!token && isAdmin,
        isAdmin,
        isSuperAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
