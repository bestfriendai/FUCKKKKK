// WhatToDoAI/mobile/src/components/detail/SimilarActivities.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types/activity';
import ActivitySection from './ActivitySection'; // Use the generic section component

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface SimilarActivitiesProps {
  activities: Activity[];
  onActivityPress: (activity: Activity) => void; // Callback for navigation
}

const SimilarActivities: React.FC<SimilarActivitiesProps> = ({ activities, onActivityPress }) => {
  if (!activities || activities.length === 0) {
    return null; // Don't render if no similar activities
  }

  return (
    <ActivitySection title="You Might Also Like">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.similarActivitiesContainer}
      >
        {activities.map((item) => (
          <TouchableOpacity
            key={item.activity_id}
            style={styles.similarActivityCard}
            onPress={() => onActivityPress(item)}
          >
            <Image
              source={{ uri: item.image_urls?.[0] ?? item.imageUrls?.[0] ?? undefined }} // Safe access
              style={styles.similarActivityImage}
              // defaultSource={require('../../assets/icon.png')} // Optional placeholder
            />
            <View style={styles.similarActivityInfo}>
              <Text style={styles.similarActivityName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.similarActivityRating}>
                <Ionicons name="star" size={14} color="#F6E05E" />
                <Text style={styles.similarActivityRatingText}>
                  {(item.average_rating !== undefined || item.rating !== undefined) ?
                    (item.average_rating ?? item.rating ?? 0).toFixed(1) : 'N/A'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ActivitySection>
  );
};

// const { width } = Dimensions.get('window'); // Uncomment if needed for responsive sizing

const styles = StyleSheet.create({
  similarActivitiesContainer: {
    // Remove paddingLeft from here, handled by ActivitySection
  },
  similarActivityCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 4, // Add some bottom margin if needed
  },
  similarActivityImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E2E8F0', // Placeholder color
  },
  similarActivityInfo: {
    padding: 8,
  },
  similarActivityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  similarActivityRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarActivityRatingText: {
    fontSize: 12,
    color: '#4A5568',
    marginLeft: 4,
  },
});

export default SimilarActivities;