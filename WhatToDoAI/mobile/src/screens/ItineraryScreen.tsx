// WhatToDoAI/mobile/src/screens/ItineraryScreen.tsx

import React from 'react';
// Import Tamagui components
import { YStack, H2, Text } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

// Note: The route prop type was 'ItineraryPlanner', assuming this screen might be part of that flow or needs adjustment.
// If this is a separate 'ItineraryList' screen, the type should be updated in MainStackParamList.
type ItineraryScreenProps = NativeStackScreenProps<MainStackParamList, 'ItineraryPlanner'>; // Or 'ItineraryList'?

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ navigation }) => {
  return (
    // Use YStack with standard props
    <YStack flex={1} backgroundColor="$background" paddingTop={40}> {/* Added paddingTop for safe area */}
      {/* Use YStack with standard props */}
      <YStack space="$4" padding="$4">
        {/* Use H2 */}
        <H2>My Itineraries</H2>
        {/* Use YStack with standard props for Center */}
        <YStack flex={1} marginTop={40} justifyContent="center" alignItems="center">
          {/* Use Text with standard props */}
          <Text>Itinerary Planner Coming Soon!</Text>
          {/* Use Text with standard props */}
          <Text mt={8} color="gray">
            Plan your perfect day with activities from WhatToDoAI
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
};

export default ItineraryScreen;
