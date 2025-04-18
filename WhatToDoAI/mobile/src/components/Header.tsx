// WhatToDoAI/mobile/src/components/Header.tsx

import React from 'react';
import { XStack, H4, Button, YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightComponent
}) => {
  const navigation = useNavigation();

  return (
    <YStack>
      <XStack
        height={60}
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack alignItems="center" flex={1}>
          {showBackButton && (
            <Button
              chromeless
              onPress={() => navigation.goBack()}
              paddingRight="$2"
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </Button>
          )}
          <H4 numberOfLines={1} flex={1}>{title}</H4>
        </XStack>
        {rightComponent && (
          <XStack>
            {rightComponent}
          </XStack>
        )}
      </XStack>
    </YStack>
  );
};

export default Header;
