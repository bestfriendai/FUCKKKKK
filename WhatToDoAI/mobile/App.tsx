// WhatToDoAI/mobile/App.tsx
import React, { useEffect } from 'react'; // Import useEffect
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { useFonts } from 'expo-font'; // Import useFonts
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_CONFIG } from './src/config';

// Initialize Mapbox with access token
MapboxGL.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);

import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  // Load fonts
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      // Potential place to hide splash screen if needed
      // SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Conditionally render only when fonts are loaded
  if (!loaded) {
    return null; // Or return a loading component/splash screen
  }

  // Optional: Detect color scheme for default theme
  // import { useColorScheme } from 'react-native';
  // const colorScheme = useColorScheme();

  return (
    // Pass config and optionally defaultTheme
    <TamaguiProvider config={tamaguiConfig} /* defaultTheme={colorScheme!} */>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </TamaguiProvider>
  );
}

// Remove default styles if not needed
// const styles = StyleSheet.create({ ... });
