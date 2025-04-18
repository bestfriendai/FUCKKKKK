// WhatToDoAI/mobile/src/components/MapMarker.tsx

import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { YStack, Text } from 'tamagui';
import { Activity } from '../types/activity';

interface MapMarkerProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ activity, onPress }) => {
  // Get coordinates from activity
  const latitude = activity.venue?.latitude || activity.latitude;
  const longitude = activity.venue?.longitude || activity.longitude;

  // Skip rendering if no valid coordinates
  if (!latitude || !longitude) return null;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(activity)}
      pinColor={activity.source === 'Eventbrite' ? '#4299E1' : '#48BB78'}
    >
      <Callout>
        <YStack padding="$2" width={200}>
          <Text fontWeight="bold" numberOfLines={1}>{activity.name}</Text>
          {activity.venue?.name && (
            <Text fontSize="$1" color="$gray10" numberOfLines={1}>
              {activity.venue.name}
            </Text>
          )}
          <Text fontSize="$1" color="$blue10" marginTop="$1">
            Tap for details
          </Text>
        </YStack>
      </Callout>
    </Marker>
  );
};

export default MapMarker;
