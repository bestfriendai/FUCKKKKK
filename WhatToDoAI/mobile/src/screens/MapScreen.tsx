// WhatToDoAI/mobile/src/screens/MapScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text as RNText, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { YStack } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { searchActivities } from '../services/activities';
import { MAPBOX_CONFIG } from '../config';

// Initialize Mapbox with the access token
Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);

// Placeholder Text component (using RNText) - This is fine
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

type MapScreenProps = NativeStackScreenProps<MainStackParamList, 'MapView'>;

// Placeholder useLocation hook - replace with actual implementation later
const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLocation({ latitude: 40.7128, longitude: -74.0060 }); // Example: NYC
      setLoading(false);
    }, 1000);
  }, []);

  return { location, loading, errorMsg };
};

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerCoordinate, setCenterCoordinate] = useState<[number, number]>([-74.0060, 40.7128]); // [longitude, latitude]
  const [zoomLevel, setZoomLevel] = useState(11);
  const { location, loading: locationLoading, errorMsg: locationError } = useLocation();
  const mapRef = useRef<Mapbox.MapView>(null);

  useEffect(() => {
    if (!locationLoading && location && !locationError) {
      setCenterCoordinate([location.longitude, location.latitude]); // Note: Mapbox uses [longitude, latitude] order
      fetchActivities(location.latitude, location.longitude);
    } else if (locationError) {
      setError(`Location Error: ${locationError}. Cannot fetch nearby activities.`);
      setLoading(false);
    } else if (!locationLoading && !location) {
      setError("Could not determine location. Cannot fetch nearby activities.");
      setLoading(false);
    }
  }, [location, locationLoading, locationError]);

  const fetchActivities = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchActivities({
        location: {
          latitude,
          longitude,
          radius: 10 // Default radius in km
        },
        pageSize: 50
      });
      if (result) {
        setActivities(result);
      } else {
        setError('Failed to fetch activities.');
        setActivities([]);
      }
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (activity: Activity) => {
    // Optional: You can navigate to the detail screen here or let the callout handle it
  };

  const handleCalloutPress = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  if (loading || locationLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
        <Text style={styles.loadingText}>
          {locationLoading ? 'Getting location...' : 'Loading activities...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <YStack style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
      >
        <Mapbox.Camera
          zoomLevel={zoomLevel}
          centerCoordinate={centerCoordinate}
          animationMode="flyTo"
          animationDuration={300}
        />
        
        {activities.map((activity) => {
          // Skip if no coordinates
          if (!activity.latitude || !activity.longitude) return null;

          return (
            <Mapbox.PointAnnotation
              key={activity.activity_id}
              id={`point-${activity.activity_id}`}
              coordinate={[activity.longitude, activity.latitude]} // Note: Mapbox uses [longitude, latitude] order
              title={activity.name}
            >
              {/* PointAnnotation requires children, even if empty */}
              <View style={styles.markerContainer}>
                <View style={styles.marker} />
              </View>
              
              {/* Custom callout */}
              <Mapbox.Callout title={activity.name}>
                <TouchableOpacity 
                  style={styles.callout}
                  onPress={() => handleCalloutPress(activity)}
                >
                  <Text style={styles.calloutTitle}>{activity.name}</Text>
                  {activity.shortDescription && (
                    <Text style={styles.calloutDescription} numberOfLines={2}>
                      {activity.shortDescription}
                    </Text>
                  )}
                  <Text style={styles.calloutAction}>Tap for details</Text>
                </TouchableOpacity>
              </Mapbox.Callout>
            </Mapbox.PointAnnotation>
          );
        })}
      </Mapbox.MapView>
    </YStack>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4299E1',
    borderWidth: 2,
    borderColor: 'white',
  },
  callout: {
    width: 200,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutAction: {
    fontSize: 12,
    color: '#4299E1',
    fontStyle: 'italic',
  },
});

export default MapScreen;
