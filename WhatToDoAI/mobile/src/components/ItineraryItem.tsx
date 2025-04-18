// WhatToDoAI/mobile/src/components/ItineraryItem.tsx

import React from 'react';
import { YStack, XStack, Text, Card, H5, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../utils/formatters';

// Define the ItineraryItem type if not already defined in types
interface ItineraryItemType {
  id: string;
  activity_id: string;
  itinerary_id: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  activity?: {
    activity_id: string;
    name: string;
    description?: string;
    venue?: {
      name: string;
      address?: string;
    };
  };
}

interface ItineraryItemProps {
  item: ItineraryItemType;
  onEdit?: (item: ItineraryItemType) => void;
  onDelete?: (item: ItineraryItemType) => void;
  onPress?: (item: ItineraryItemType) => void;
}

const ItineraryItem: React.FC<ItineraryItemProps> = ({
  item,
  onEdit,
  onDelete,
  onPress
}) => {
  return (
    <Card
      marginBottom="$3"
      padding="$4"
      bordered
      elevate
      onPress={onPress ? () => onPress(item) : undefined}
    >
      <YStack>
        <XStack justifyContent="space-between" alignItems="center">
          <H5>{item.activity?.name || 'Unnamed Activity'}</H5>
          <XStack gap="$2">
            {onEdit && (
              <Button
                size="$2"
                circular
                chromeless
                onPress={() => onEdit(item)}
                icon={<Ionicons name="pencil" size={16} color="#4299E1" />}
              />
            )}
            {onDelete && (
              <Button
                size="$2"
                circular
                chromeless
                onPress={() => onDelete(item)}
                icon={<Ionicons name="trash" size={16} color="#E53E3E" />}
              />
            )}
          </XStack>
        </XStack>
        
        {item.activity?.venue?.name && (
          <Text fontSize="$2" color="$gray10" marginTop="$1">
            {item.activity.venue.name}
          </Text>
        )}
        
        {item.start_time && (
          <Text fontSize="$1" color="$gray9" marginTop="$1">
            Time: {formatTime(item.start_time)}
            {item.end_time && ` - ${formatTime(item.end_time)}`}
          </Text>
        )}
        
        {item.notes && (
          <Text fontSize="$1" color="$gray9" marginTop="$2">
            Notes: {item.notes}
          </Text>
        )}
      </YStack>
    </Card>
  );
};

export default ItineraryItem;
