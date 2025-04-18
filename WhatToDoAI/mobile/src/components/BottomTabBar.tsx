// WhatToDoAI/mobile/src/components/BottomTabBar.tsx

import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { XStack, YStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Map of route names to icons
const ROUTE_ICONS: Record<string, string> = {
  Home: 'home',
  Search: 'search',
  Map: 'map',
  Itinerary: 'calendar',
  Profile: 'person'
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  return (
    <XStack 
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingVertical="$2"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;
        const iconName = ROUTE_ICONS[route.name] || 'apps';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Button
            key={route.key}
            flex={1}
            chromeless
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <YStack alignItems="center" gap="$1">
              <Ionicons 
                name={isFocused ? `${iconName}` : `${iconName}-outline`} 
                size={22} 
                color={isFocused ? '#4299E1' : '#718096'} 
              />
              <Text 
                fontSize="$1" 
                color={isFocused ? '$blue10' : '$gray10'}
              >
                {label as string}
              </Text>
            </YStack>
          </Button>
        );
      })}
    </XStack>
  );
};

export default BottomTabBar;
