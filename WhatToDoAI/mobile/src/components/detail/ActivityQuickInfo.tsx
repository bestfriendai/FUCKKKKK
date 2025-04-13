// WhatToDoAI/mobile/src/components/detail/ActivityQuickInfo.tsx
import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Activity } from '../../types/activity';

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivityQuickInfoProps {
  activity: Activity;
}

const ActivityQuickInfo: React.FC<ActivityQuickInfoProps> = ({ activity }) => {

  const renderPriceRange = () => {
    // First check if we have price_info from the API
    if (activity.price_info) return activity.price_info;
    if (activity.is_free) return 'Free';

    // Fall back to priceRange object
    const priceRange = activity?.priceRange;
    if (!priceRange) return 'Price not available';
    const { min, max, currency = '$' } = priceRange;
    if (min === undefined || min === null) return 'Price not available';
    if (min === 0 && (max === 0 || max === undefined || max === null)) return 'Free';
    let priceString = `${currency}${min}`;
    if (max !== undefined && max !== null && max > min) {
      priceString += ` - ${currency}${max}`;
    }
    return priceString;
  };

  const renderOpeningHours = () => {
    const openingHours = activity?.openingHours;
    if (!openingHours || openingHours.length === 0) return 'Hours not available';
    const today = new Date().getDay();
    const todayHours = openingHours.find(h => h.day === today);
    if (!todayHours) return 'Closed today';
    return `Today: ${todayHours.open ?? '?'} - ${todayHours.close ?? '?'}`;
  };

  return (
    <View style={styles.quickInfoContainer}>
      <View style={styles.infoItem}>
        <Ionicons name="calendar-outline" size={20} color="#4A5568" />
        <Text style={styles.infoText}>
          {activity.start_time ? format(new Date(activity.start_time), 'MMM d, yyyy') :
           activity.startDate ? format(new Date(activity.startDate), 'MMM d, yyyy') : 'Date not specified'}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Ionicons name="time-outline" size={20} color="#4A5568" />
        <Text style={styles.infoText}>{renderOpeningHours()}</Text>
      </View>
      <View style={styles.infoItem}>
        <Ionicons name="cash-outline" size={20} color="#4A5568" />
        <Text style={styles.infoText}>{renderPriceRange()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickInfoContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: 8, fontSize: 14, color: '#4A5568' },
});

export default ActivityQuickInfo;