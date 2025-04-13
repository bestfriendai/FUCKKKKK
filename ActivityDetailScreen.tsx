import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getActivity, addToFavorites, removeFromFavorites } from '../services/activities';
import { Activity } from '../types/activity';
import { MainStackParamList } from '../navigation/types';
import { formatDate, formatPrice, formatDistance, formatDuration } from '../utils/formatters';
import MapMarker from '../components/MapMarker';

type ActivityDetailScreenRouteProp = RouteProp<MainStackParamList, 'ActivityDetail'>;
type ActivityDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ActivityDetail'>;

const { width } = Dimensions.get('window');

const ActivityDetailScreen: React.FC = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const navigation = useNavigation<ActivityDetailScreenNavigationProp>();
  const { activityId } = route.params;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchActivityDetails();
  }, [activityId]);

  const fetchActivityDetails = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const activityData = await getActivity(activityId);
      setActivity(activityData);
      setIsFavorite(activityData.isFavorite || false);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      Alert.alert(
        'Error',
        'Failed to load activity details. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (): Promise<void> => {
    if (!activity) return;
    
    try {
      if (isFavorite) {
        await removeFromFavorites(activity.id);
      } else {
        await addToFavorites(activity.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const handleViewMap = (): void => {
    if (!activity) return;
    navigation.navigate('MapView', {
      initialRegion: {
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      markers: [activity],
    });
  };

  const handleGetDirections = (): void => {
    if (!activity) return;
    
    const { latitude, longitude } = activity.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert('Error', 'Could not open maps application');
      })
      .catch((error) => {
        console.error('Error opening directions:', error);
        Alert.alert('Error', 'Could not open maps application');
      });
  };

  const handleAddToItinerary = (): void => {
    if (!activity) return;
    navigation.navigate('ItineraryPlanner', { selectedActivity: activity });
  };

  if (isLoading || !activity) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with back button and favorite button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Text style={styles.favoriteButtonText}>{isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(newIndex);
            }}
          >
            {activity.images.map((image, index) => (
              <Image
                key={`image-${index}`}
                source={{ uri: image.url }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image Pagination Dots */}
          <View style={styles.paginationContainer}>
            {activity.images.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Title and Categories */}
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.categoriesContainer}>
            {activity.categories.map((category, index) => (
              <View key={`category-${index}`} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
          
          {/* Rating and Price */}
          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>★ {activity.rating.average.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({activity.rating.count} reviews)</Text>
            </View>
            
            {activity.priceRange && (
              <Text style={styles.priceText}>
                {formatPrice(activity.priceRange.min)} - {formatPrice(activity.priceRange.max)}
              </Text>
            )}
          </View>
          
          {/* Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>{activity.location.name}</Text>
            <Text style={styles.addressText}>{activity.location.address}</Text>
            <Text style={styles.addressText}>
              {activity.location.city}, {activity.location.state} {activity.location.zipCode}
            </Text>
            
            <View style={styles.mapPreviewContainer}>
              <MapMarker
                latitude={activity.location.latitude}
                longitude={activity.location.longitude}
                title={activity.title}
                onPress={handleViewMap}
              />
              <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsRow}>
              {activity.duration && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{formatDuration(activity.duration)}</Text>
                </View>
              )}
              
              {activity.distance && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Distance</Text>
                  <Text style={styles.detailValue}>{formatDistance(activity.distance)}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{activity.description}</Text>
          </View>
          
          {/* Opening Hours */}
          {activity.openingHours && activity.openingHours.length > 0 && (
            <View style={styles.openingHoursContainer}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              {activity.openingHours.map((hours, index) => (
                <View key={`hours-${index}`} style={styles.hoursRow}>
                  <Text style={styles.dayText}>{hours.day}</Text>
                  <Text style={styles.hoursText}>{hours.open} - {hours.close}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Add to Itinerary Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addToItineraryButton} onPress={handleAddToItinerary}>
          <Text style={styles.addToItineraryButtonText}>Add to Itinerary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width,
    height: 300,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#4A80F0',
    fontSize: 12,
    fontWeight: '500',
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingCount: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 4,
  },
  priceText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  mapPreviewContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#4A80F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  openingHoursContainer: {
    marginBottom: 24,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 16,
    color: '#333333',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  addToItineraryButton: {
    backgroundColor: '#4A80F0',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToItineraryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityDetailScreen;