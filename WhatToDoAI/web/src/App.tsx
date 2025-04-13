// WhatToDoAI/web/src/App.tsx
import React from 'react';
import './App.css'; // Keep or replace with your preferred styling method
import './styles/darkMode.css'; // Import dark mode styles
import AppRouter from './navigation/AppRouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Main App component that uses the AuthProvider and ThemeProvider
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Inner component that can access the auth context
function AppContent() {
  const { state } = useAuth();

  if (state.isLoading) {
    // Optional: Render a loading indicator
    return <div className="loading-container">Loading...</div>;
  }

  // Determine if the user is authenticated based on the session
  const isAuthenticated = !!(state.session && state.user);

  return <AppRouter isAuthenticated={isAuthenticated} />;
}

export default App;