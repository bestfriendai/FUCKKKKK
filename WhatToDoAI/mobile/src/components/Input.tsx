// WhatToDoAI/mobile/src/components/Input.tsx

import React from 'react';
import { Input as TamaguiInput, InputProps as TamaguiInputProps, YStack, Text } from 'tamagui';

interface InputProps extends TamaguiInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <YStack space="$1">
      {label && <Text>{label}</Text>}
      <TamaguiInput
        borderColor={error ? '$red10' : undefined}
        {...props}
      />
      {error && <Text color="$red10" fontSize="$1">{error}</Text>}
    </YStack>
  );
};

export default Input;
