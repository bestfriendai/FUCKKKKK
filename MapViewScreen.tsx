import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { getNearbyActivities } from '../services/activities';
import { Activity } from '../types/activity';
import { MainStackParamList } from '../navigation/types';
import ActivityCard from '../components/ActivityCard';

type MapViewScreenRouteProp = RouteProp<MainStackParamList, 'MapView'>;
type MapViewScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MapView'>;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapViewScreen: React.FC = () => {
  const route = useRoute<MapViewScreenRouteProp>();
  const navigation = useNavigation<MapViewScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  
  const initialRegion = route.params?.initialRegion || {
    latitude: 40.7128, // Default to NYC
    longitude: -74.0060,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
  
  const initialMarkers = route.params?.markers || [];
  
  const [region, setRegion] = useState<Region>(initialRegion);
  const [activities, setActivities] = useState<Activity[]>(initialMarkers);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialMarkers.length === 0) {
      fetchNearbyActivities();
    } else if (initialMarkers.length === 1) {
      setSelectedActivity(initialMarkers[0]);
    }
  }, []);

  const fetchNearbyActivities = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const nearbyActivities = await getNearbyActivities(
        region.latitude,
        region.longitude,
        5 // 5km radius
      );
      setActivities(nearbyActivities);
    } catch (error) {
      console.error('Error fetching nearby activities:', error);
      Alert.alert('Error', 'Failed to load nearby activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region): void => {
    setRegion(newRegion);
  };

  const handleMarkerPress = (activity: Activity): void => {
    setSelectedActivity(activity);
    
    // Animate to the selected marker
    mapRef.current?.animateToRegion({
      latitude: activity.location.latitude,
      longitude: activity.location.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    }, 500);
  };

  const handleActivityPress = (activity: Activity): void => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  const handleRefresh = (): void => {
    fetchNearbyActivities();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Map</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>↻</Text>
        </TouchableOpacity>
      </View>
      
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
        >
          {activities.map((activity) => (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.location.latitude,
                longitude: activity.location.longitude,
              }}
              title={activity.title}
              description={activity.location.address}
              onPress={() => handleMarkerPress(activity)}
            />
          ))}
        </MapView>
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4A80F0" />
          </View>
        )}
      </View>
      
      {/* Selected Activity Card */}
      {selectedActivity && (
        <View style={styles.cardContainer}>
          <ActivityCard
            activity={selectedActivity}
            onPress={() => handleActivityPress(selectedActivity)}
            style={styles.activityCard}
          />
        </View>
      )}
      
      {/* Search This Area Button */}
      {!selectedActivity && (
        <TouchableOpacity style={styles.searchAreaButton} onPress={handleRefresh}>
          <Text style={styles.searchAreaButtonText}>Search This Area</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'transparent',
  },
  activityCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchAreaButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#4A80F0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchAreaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapViewScreen;