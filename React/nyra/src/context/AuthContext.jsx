import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  adminId: '2016306Nyra',
  password: 'NyraZunnun@1993'
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('nyra_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    localStorage.setItem('nyra_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (adminId, password) => {
    if (adminId === ADMIN_CREDENTIALS.adminId && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setAuthError('');
      return true;
    }
    setAuthError('Invalid credentials');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nyra_auth');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      authError,
      setAuthError,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
