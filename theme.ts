/**
 * Theme configuration for the web app
 */

// Color palette
export const lightColors = {
  // Primary colors
  primary: '#4A80F0',
  primaryDark: '#3A64C0',
  primaryLight: '#6E9AF5',
  
  // Secondary colors
  secondary: '#FF8E3C',
  secondaryDark: '#E07A2E',
  secondaryLight: '#FFA968',
  
  // Neutral colors
  background: '#FFFFFF',
  paper: '#F9F9F9',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#EEEEEE',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

// Dark mode colors
export const darkColors = {
  // Primary colors
  primary: '#6E9AF5',
  primaryDark: '#4A80F0',
  primaryLight: '#8EB5FF',
  
  // Secondary colors
  secondary: '#FFA968',
  secondaryDark: '#FF8E3C',
  secondaryLight: '#FFC090',
  
  // Neutral colors
  background: '#121212',
  paper: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textLight: '#999999',
  border: '#333333',
  
  // Status colors
  success: '#66BB6A',
  warning: '#FFCA28',
  error: '#EF5350',
  info: '#42A5F5',
};

// Typography
export const typography = {
  fontFamily: {
    primary: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    secondary: "'Poppins', 'Helvetica', 'Arial', sans-serif",
    monospace: "'Roboto Mono', monospace",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    xxl: '1.5rem',    // 24px
    xxxl: '1.875rem', // 30px
    display: '2.25rem', // 36px
  },
  lineHeight: {
    xs: 1.25,
    sm: 1.375,
    md: 1.5,
    lg: 1.625,
    xl: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
  xxxl: '4rem',    // 64px
};

// Border radius
export const borderRadius = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  round: '50%',
};

// Shadows
export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  md: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
  lg: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  xl: '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
};

// Breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Z-index
export const zIndex = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Transitions
export const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Light theme
export const lightTheme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  mode: 'light',
};

// Dark theme
export const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  mode: 'dark',
};

export default {
  light: lightTheme,
  dark: darkTheme,
};