import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { MainLayout } from './components/layout/MainLayout';

const AuthWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (isAuthenticated) {
    return (
      <AppProvider>
        <MainLayout />
      </AppProvider>
    );
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  return authMode === 'login' ? (
    <Login onToggleMode={toggleAuthMode} />
  ) : (
    <SignUp onToggleMode={toggleAuthMode} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;