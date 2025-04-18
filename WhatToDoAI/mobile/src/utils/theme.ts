// WhatToDoAI/mobile/src/utils/theme.ts

import { createTokens } from 'tamagui';

// Define color palette
export const colors = {
  // Primary colors
  blue1: '#EFF6FF',
  blue2: '#DBEAFE',
  blue3: '#BFDBFE',
  blue4: '#93C5FD',
  blue5: '#60A5FA',
  blue6: '#3B82F6',
  blue7: '#2563EB',
  blue8: '#1D4ED8',
  blue9: '#1E40AF',
  blue10: '#1E3A8A',
  
  // Gray scale
  gray1: '#F9FAFB',
  gray2: '#F3F4F6',
  gray3: '#E5E7EB',
  gray4: '#D1D5DB',
  gray5: '#9CA3AF',
  gray6: '#6B7280',
  gray7: '#4B5563',
  gray8: '#374151',
  gray9: '#1F2937',
  gray10: '#111827',
  
  // Success colors
  green1: '#ECFDF5',
  green2: '#D1FAE5',
  green3: '#A7F3D0',
  green4: '#6EE7B7',
  green5: '#34D399',
  green6: '#10B981',
  green7: '#059669',
  green8: '#047857',
  green9: '#065F46',
  green10: '#064E3B',
  
  // Error colors
  red1: '#FEF2F2',
  red2: '#FEE2E2',
  red3: '#FECACA',
  red4: '#FCA5A5',
  red5: '#F87171',
  red6: '#EF4444',
  red7: '#DC2626',
  red8: '#B91C1C',
  red9: '#991B1B',
  red10: '#7F1D1D',
  
  // Warning colors
  yellow1: '#FFFBEB',
  yellow2: '#FEF3C7',
  yellow3: '#FDE68A',
  yellow4: '#FCD34D',
  yellow5: '#FBBF24',
  yellow6: '#F59E0B',
  yellow7: '#D97706',
  yellow8: '#B45309',
  yellow9: '#92400E',
  yellow10: '#78350F',
};

// Create tokens for Tamagui
export const tokens = createTokens({
  color: {
    // Theme colors
    primary: colors.blue6,
    secondary: colors.gray6,
    success: colors.green6,
    error: colors.red6,
    warning: colors.yellow6,
    
    // Background colors
    background: '#FFFFFF',
    backgroundHover: colors.gray1,
    backgroundPress: colors.gray2,
    
    // Text colors
    text: colors.gray10,
    textMuted: colors.gray6,
    
    // Border colors
    borderColor: colors.gray3,
    borderColorHover: colors.gray4,
    borderColorFocus: colors.blue5,
    
    // Specific component colors
    card: '#FFFFFF',
    cardHover: colors.gray1,
    
    // Add all color palette colors
    ...colors,
  },
  
  space: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 12,
    $4: 16,
    $5: 20,
    $6: 24,
    $7: 32,
    $8: 40,
    $9: 48,
    $10: 64,
  },
  
  size: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 12,
    $4: 16,
    $5: 20,
    $6: 24,
    $7: 32,
    $8: 40,
    $9: 48,
    $10: 64,
  },
  
  radius: {
    $0: 0,
    $1: 2,
    $2: 4,
    $3: 6,
    $4: 8,
    $5: 12,
    $6: 16,
    $7: 24,
    $8: 32,
    $9: 999,
  },
  
  zIndex: {
    $0: 0,
    $1: 100,
    $2: 200,
    $3: 300,
    $4: 400,
    $5: 500,
    $modal: 1000,
    $max: 9999,
  },
});

export default tokens;
