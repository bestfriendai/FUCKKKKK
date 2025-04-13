// WhatToDoAI/mobile/src/components/detail/ActivityLocationMap.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform, Text as RNText } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { Venue } from '../../types/activity'; // Assuming Venue type is in activity.ts
import { MAPBOX_CONFIG } from '../../config';

// Initialize Mapbox with the access token
Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivityLocationMapProps {
  venue: Venue | undefined; // Venue can be optional
  activityName: string;
}

const ActivityLocationMap: React.FC<ActivityLocationMapProps> = ({ venue, activityName }) => {
  if (!venue?.latitude || !venue?.longitude) {
    return <Text style={styles.noLocationText}>Location map not available.</Text>; // Handle missing coordinates
  }

  const { latitude, longitude, name: venueName } = venue;
  const displayName = venueName ?? activityName ?? 'Destination';

  const handleDirections = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(displayName)}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(displayName)})`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.mapContainer}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
      >
        <Mapbox.Camera
          zoomLevel={14}
          centerCoordinate={[longitude, latitude]}
          animationMode="flyTo"
          animationDuration={0}
        />
        <Mapbox.PointAnnotation
          id="destinationMarker"
          coordinate={[longitude, latitude]}
          title={displayName}
        >
          {/* PointAnnotation requires children, even if empty */}
          <View />
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={handleDirections}
      >
        <Ionicons name="navigate-outline" size={16} color="#fff" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { height: 200, marginTop: 12, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  directionsButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#4299E1', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  directionsText: { color: '#fff', marginLeft: 4, fontWeight: '600' },
  noLocationText: { padding: 16, fontStyle: 'italic', color: '#718096' },
});

export default ActivityLocationMap;