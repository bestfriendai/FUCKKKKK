// WhatToDoAI/mobile/src/components/detail/ActivityHeader.tsx
import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types/activity';

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivityHeaderProps {
  activity: Activity;
}

// Helper to render rating stars safely
const renderRatingStars = (ratingValue: number | undefined, size: number = 16, color: string = "#F6AD55") => {
    const roundedRating = Math.round(ratingValue ?? 0); // Default to 0 if undefined
    return (
      <View style={{ flexDirection: 'row' }}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name={i < roundedRating ? "star" : "star-outline"} size={size} color={color} />
        ))}
      </View>
    );
};

const ActivityHeader: React.FC<ActivityHeaderProps> = ({ activity }) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{activity.name}</Text>
        {activity.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{activity.category.name}</Text>
          </View>
        )}
      </View>
      <View style={styles.ratingContainer}>
        {renderRatingStars(activity.average_rating ?? activity.rating, 20)}
        {(activity.average_rating !== undefined || activity.rating !== undefined) ?
          <Text style={styles.rating}>{(activity.average_rating ?? activity.rating ?? 0).toFixed(1)}</Text> : null}
        {(activity.review_count !== undefined || activity.reviewCount !== undefined) ?
          <Text style={styles.reviewCount}>({activity.review_count ?? activity.reviewCount ?? 0} reviews)</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginRight: 8, flex: 1 },
  categoryBadge: { backgroundColor: '#EBF4FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  categoryText: { color: '#4299E1', fontSize: 12, fontWeight: '600' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginLeft: 4 },
  reviewCount: { fontSize: 14, color: '#718096', marginLeft: 4 },
});

export default ActivityHeader;