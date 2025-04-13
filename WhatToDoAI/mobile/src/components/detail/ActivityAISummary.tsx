// WhatToDoAI/mobile/src/components/detail/ActivityAISummary.tsx
import React from 'react';
import { View, StyleSheet, Text as RNText, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types/activity';

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivityAISummaryProps {
  aiSummary: Activity['aiSummary']; // Can be optional based on Activity type
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

const ActivityAISummary: React.FC<ActivityAISummaryProps> = ({ aiSummary }) => {
  if (!aiSummary) {
    return null; // Don't render anything if no AI summary exists
  }

  return (
    <View style={styles.aiSummaryContainer}>
      <View style={styles.aiSummaryHeader}>
        <Ionicons name="sparkles-outline" size={20} color="#805AD5" />
        <Text style={styles.aiSummaryTitle}>AI Insights</Text>
      </View>
      <ScrollView style={styles.aiSummaryContent}>
        {aiSummary.overview && (
          <View style={styles.overviewContainer}>
            <Text style={styles.aiSectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>{aiSummary.overview}</Text>
          </View>
        )}

        {aiSummary.highlights && aiSummary.highlights.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.aiSectionTitle}>Highlights</Text>
            {aiSummary.highlights.map((highlight: string, index: number) => (
              <View key={index} style={styles.highlightItem}>
                <Ionicons name="bulb-outline" size={16} color="#805AD5" />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.ratingGrid}>
          <Text style={styles.aiSectionTitle}>Ratings</Text>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Atmosphere</Text>
            {renderRatingStars(aiSummary.atmosphere)}
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Family-Friendly</Text>
            {renderRatingStars(aiSummary.familyFriendliness)}
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Price-Value</Text>
            {renderRatingStars(aiSummary.priceValue)}
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Crowd Level</Text>
            {renderRatingStars(aiSummary.crowdLevel)}
          </View>
        </View>

        {aiSummary.tips && aiSummary.tips.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.aiSectionTitle}>Tips</Text>
            {aiSummary.tips.map((tip: string, index: number) => (
              <View key={index} style={styles.highlightItem}>
                <Ionicons name="information-circle-outline" size={16} color="#4299E1" />
                <Text style={styles.highlightText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {aiSummary.idealFor && aiSummary.idealFor.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.aiSectionTitle}>Ideal For</Text>
            <View style={styles.tagsContainer}>
              {aiSummary.idealFor.map((item: string, index: number) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {aiSummary.localInsights && (
          <View style={styles.sectionContainer}>
            <Text style={styles.aiSectionTitle}>Local Insights</Text>
            <Text style={styles.insightText}>{aiSummary.localInsights}</Text>
          </View>
        )}

        {aiSummary.bestTimeToVisit && (
          <View style={styles.bestTimeContainer}>
            <Text style={styles.bestTimeLabel}>Best Time to Visit:</Text>
            <Text style={styles.bestTimeValue}>{aiSummary.bestTimeToVisit}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  aiSummaryContainer: { backgroundColor: '#F0F5FF', marginTop: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#BEE3F8' },
  aiSummaryHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#BEE3F8' },
  aiSummaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginLeft: 8 },
  aiSummaryContent: { padding: 16, maxHeight: 500 }, // Set a max height to make it scrollable
  sectionContainer: { marginBottom: 16 },
  overviewContainer: { marginBottom: 16 },
  overviewText: { fontSize: 14, lineHeight: 20, color: '#4A5568' },
  aiSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#5A67D8', marginBottom: 8 },
  highlightItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  highlightText: { marginLeft: 8, fontSize: 14, color: '#4A5568', flex: 1 },
  ratingGrid: { marginTop: 12, marginBottom: 16 },
  ratingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ratingLabel: { fontSize: 14, color: '#4A5568' },
  ratingStars: { flexDirection: 'row' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tagItem: { backgroundColor: '#EBF4FF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 12, color: '#4A5568' },
  insightText: { fontSize: 14, fontStyle: 'italic', color: '#4A5568', lineHeight: 20 },
  bestTimeContainer: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  bestTimeLabel: { fontSize: 14, fontWeight: '600', color: '#4A5568' },
  bestTimeValue: { fontSize: 14, color: '#4A5568', marginLeft: 8 },
});

export default ActivityAISummary;