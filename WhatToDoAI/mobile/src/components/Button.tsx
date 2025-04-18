// WhatToDoAI/mobile/src/components/Button.tsx

import React from 'react';
import { Button as TamaguiButton, Text, ButtonProps as TamaguiButtonProps } from 'tamagui';

interface ButtonProps extends TamaguiButtonProps {
  title: string;
  variant?: 'solid' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'solid',
  size = 'medium',
  ...props
}) => {
  return (
    <TamaguiButton
      variant={variant}
      size={size}
      {...props}
    >
      <Text>{title}</Text>
    </TamaguiButton>
  );
};

export default Button;
