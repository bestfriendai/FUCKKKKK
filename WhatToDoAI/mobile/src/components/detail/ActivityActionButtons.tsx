// WhatToDoAI/mobile/src/components/detail/ActivityActionButtons.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types/activity';

// Placeholder Text and Button components
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;
const Button = ({ onPress, title, icon, style, ...props }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.buttonBase, style]} {...props}>
    {icon && <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />}
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

interface ActivityActionButtonsProps {
  activity: Activity;
  onShare: () => void;
  onBook: () => void;
  onAddToItinerary?: () => void;
}

const ActivityActionButtons: React.FC<ActivityActionButtonsProps> = ({ activity, onShare, onBook, onAddToItinerary }) => {
  return (
    <View style={styles.actionButtonsContainer}>
      <Button
        title="Share"
        icon="share-social-outline"
        onPress={onShare}
        style={[styles.actionButton, styles.shareButton]}
      />
      {onAddToItinerary && (
        <Button
          title="Add to Itinerary"
          icon="add-outline"
          onPress={onAddToItinerary}
          style={[styles.actionButton, styles.itineraryButton]}
        />
      )}
      {(activity.bookingRequired || activity.activity_url) && (activity.bookingUrl || activity.activity_url) && (
        <Button
          title="Book Now"
          icon="calendar-outline"
          onPress={onBook}
          style={[styles.actionButton, styles.bookButton]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  shareButton: {
    backgroundColor: '#4A5568',
  },
  itineraryButton: {
    backgroundColor: '#805AD5',
  },
  bookButton: {
    backgroundColor: '#4299E1',
  },
  // Base styles for the placeholder Button
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityActionButtons;