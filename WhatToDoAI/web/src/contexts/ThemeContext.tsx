// WhatToDoAI/web/src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Theme types
export type ThemeMode = 'light' | 'dark';

// Theme state interface
interface ThemeState {
  mode: ThemeMode;
}

// Theme actions
type ThemeAction = 
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'TOGGLE_THEME_MODE' };

// Theme context type
interface ThemeContextType {
  state: ThemeState;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Local storage key for theme
const THEME_STORAGE_KEY = 'whattodoai_theme_mode';

// Initial state
const initialState: ThemeState = {
  mode: 'light',
};

// Reducer function
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'TOGGLE_THEME_MODE':
      return {
        ...state,
        mode: state.mode === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME_MODE', payload: savedTheme as ThemeMode });
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_THEME_MODE', payload: prefersDarkMode ? 'dark' : 'light' });
    }
  }, []);

  // Update body class and localStorage when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    
    // Update body class
    if (state.mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [state.mode]);

  // Toggle theme mode
  const toggleThemeMode = () => {
    dispatch({ type: 'TOGGLE_THEME_MODE' });
  };

  // Set specific theme mode
  const setThemeMode = (mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME_MODE', payload: mode });
  };

  // Context value
  const value: ThemeContextType = {
    state,
    toggleThemeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
