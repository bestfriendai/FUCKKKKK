// WhatToDoAI/mobile/src/components/detail/ActivitySection.tsx
import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivitySectionProps {
  title: string;
  children: React.ReactNode;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', padding: 16, marginTop: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginBottom: 12 },
});

export default ActivitySection;