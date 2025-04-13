// WhatToDoAI/mobile/src/screens/MapViewScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { YStack, XStack, Spinner, Text, H4, Button, View } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { searchActivities } from '../services/activities';
import { MapPin, Navigation, List, Grid, Search } from 'lucide-react-native';
import * as Location from 'expo-location';
import { MAP_CONFIG, MAPBOX_CONFIG } from '../config';
import MapboxGL from '@rnmapbox/maps';

type MapViewScreenProps = NativeStackScreenProps<MainStackParamList, 'MapView'>;

const { width, height } = Dimensions.get('window');

// Default zoom level for Mapbox
const DEFAULT_ZOOM = 12;

const MapViewScreen: React.FC<MapViewScreenProps> = ({ navigation, route }) => {
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState([
    MAP_CONFIG.DEFAULT_LONGITUDE,
    MAP_CONFIG.DEFAULT_LATITUDE,
  ]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      setCenter([userLocation.longitude, userLocation.latitude]);
      fetchActivities(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        // Fall back to default location
        fetchActivities(MAP_CONFIG.DEFAULT_LATITUDE, MAP_CONFIG.DEFAULT_LONGITUDE);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Could not get your location');
      setLoading(false);
      // Fall back to default location
      fetchActivities(MAP_CONFIG.DEFAULT_LATITUDE, MAP_CONFIG.DEFAULT_LONGITUDE);
    }
  };

  const fetchActivities = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchActivities({
        location: {
          latitude,
          longitude,
          radius: MAP_CONFIG.DEFAULT_RADIUS,
        },
        pageSize: 50,
      });

      if (result) {
        setActivities(result.filter(activity =>
          activity.latitude && activity.longitude ||
          (activity.venue?.latitude && activity.venue?.longitude)
        ));
      } else {
        setError('Failed to fetch activities');
      }
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      setError(error.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCalloutPress = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  const centerOnUserLocation = () => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.flyTo([userLocation.longitude, userLocation.latitude], 1000);
      cameraRef.current.zoomTo(14, 1000);
    }
  };

  const navigateToSearch = () => {
    navigation.navigate('Search', {});
  };

  const navigateToList = () => {
    navigation.navigate('Home');
  };

  if (loading && !activities.length) {
    return (
      <YStack style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
        <Text style={{ marginTop: 8 }}>Loading activities...</Text>
      </YStack>
    );
  }

  return (
    <View flex={1}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MAPBOX_CONFIG.STYLE_URL}
        onRegionDidChange={(feature: any) => {
          // Safely access properties with optional chaining
          if (feature?.properties?.center) {
            setCenter(feature.properties.center);
            setZoom(feature.properties.zoomLevel || zoom);
          }
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={zoom}
          centerCoordinate={center}
          animationMode="flyTo"
          animationDuration={1000}
        />
        
        {/* User location */}
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
        />
        
        {/* Activity markers */}
        {activities.map((activity) => {
          // Use venue coordinates if available, otherwise use activity coordinates
          const latitude = activity.venue?.latitude || activity.latitude;
          const longitude = activity.venue?.longitude || activity.longitude;

          // Skip if no coordinates
          if (!latitude || !longitude) return null;

          return (
            <MapboxGL.PointAnnotation
              key={activity.activity_id}
              id={`point-${activity.activity_id}`}
              coordinate={[longitude, latitude]}
              title={activity.name}
              onSelected={() => handleMarkerPress(activity)}
            >
              <MapboxGL.Callout title={activity.name}>
                <View width={200} p={8}>
                  <Text fontWeight="bold">{activity.name}</Text>
                  {activity.shortDescription && (
                    <Text numberOfLines={2} fontSize={12} color="#666" mt={4}>
                      {activity.shortDescription}
                    </Text>
                  )}
                  <Text fontSize={12} color="#4299E1" fontStyle="italic" mt={4} onPress={() => handleCalloutPress(activity)}>
                    Tap for details
                  </Text>
                </View>
              </MapboxGL.Callout>
            </MapboxGL.PointAnnotation>
          );
        })}
      </MapboxGL.MapView>

      {/* Floating action buttons */}
      <YStack
        position="absolute"
        style={{
          zIndex: 1000,
          right: 16,
          bottom: 100,
          gap: 8
        }}
      >
        <Button
          onPress={centerOnUserLocation}
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 30,
            elevation: 2
          }}
        >
          <Navigation color="#4299E1" size={24} />
        </Button>

        <Button
          onPress={navigateToSearch}
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 30,
            elevation: 2
          }}
        >
          <Search color="#4299E1" size={24} />
        </Button>

        <Button
          onPress={navigateToList}
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 30,
            elevation: 2
          }}
        >
          <List color="#4299E1" size={24} />
        </Button>
      </YStack>

      {/* Error message */}
      {error && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: 50,
            left: 16,
            right: 16,
            backgroundColor: '#FEE2E2',
            padding: 12,
            borderRadius: 8
          }}
        >
          <Text color="#B91C1C">{error}</Text>
        </View>
      )}

      {/* Activity count */}
      <View
        style={{
          position: 'absolute',
          zIndex: 1000,
          top: 16,
          left: 16,
          right: 16,
          backgroundColor: 'white',
          padding: 12,
          borderRadius: 8,
          elevation: 2
        }}
      >
        <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text fontWeight="bold">
            {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'} Found
          </Text>
          <XStack style={{ gap: 8 }}>
            <View
              style={{
                backgroundColor: activities.length > 0 ? '#DBEAFE' : '#F3F4F6',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8
              }}
            >
              <Text color={activities.length > 0 ? '#1E40AF' : '#4B5563'} fontSize={12}>
                {center[1].toFixed(2)}, {center[0].toFixed(2)}
              </Text>
            </View>
          </XStack>
        </XStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapViewScreen;
