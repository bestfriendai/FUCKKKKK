// WhatToDoAI/mobile/src/screens/ActivityDetailScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text as RNText // Use RNText alias
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import MapView, { Marker } from 'react-native-maps';

import { Activity } from '../types/activity';
import { getActivityDetails /*, searchActivities */ } from '../services/activities'; // Import specific functions
import { getErrorMessage } from '../utils/errorHandling';
import { MainStackParamList } from '../navigation/types'; // Import navigation types

// Import the new detail components
import ActivityImageGallery from '../components/detail/ActivityImageGallery';
import ActivityHeader from '../components/detail/ActivityHeader';
import ActivityQuickInfo from '../components/detail/ActivityQuickInfo';
import ActivitySection from '../components/detail/ActivitySection';
import ActivityLocationMap from '../components/detail/ActivityLocationMap';
import ActivityAISummary from '../components/detail/ActivityAISummary';
import SimilarActivities from '../components/detail/SimilarActivities';
import ActivityActionButtons from '../components/detail/ActivityActionButtons';

// Placeholder Text and Button components (can be removed if using a UI library)
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;
const Button = ({ onPress, title, icon, style, ...props }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.buttonBase, style]} {...props}>
    {icon && <Ionicons name={icon as any} size={20} color="#fff" style={{ marginRight: 8 }} />}
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
// --- End Placeholders ---

// Correctly type the route prop based on MainStackParamList
type ActivityDetailScreenRouteProp = RouteProp<MainStackParamList, 'ActivityDetail'>;

const ActivityDetailScreen: React.FC = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const navigation = useNavigation<any>(); // Use 'any' or define specific navigation prop type

  // Get the activity object passed via navigation params
  const initialActivity = route.params?.activity;
  const activityId = initialActivity?.activity_id; // Use activity_id

  // State for the activity details (use initialActivity if passed)
  const [activity, setActivity] = useState<Activity | null>(initialActivity || null);
  const [similarActivities, setSimilarActivities] = useState<Activity[]>([]);
  // Loading state: true only if we need to fetch (i.e., initialActivity was not passed)
  const [loading, setLoading] = useState(!initialActivity);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityDetails = useCallback(async () => {
    // If activity was passed via params, we might still want to refresh or fetch similar
    // For now, if we have the activity, assume it's fresh enough.
    if (activity && activity.activity_id === activityId) {
        setLoading(false); // Already have main data
        // try {
        //     console.log(`Fetching similar activities for already loaded activity: ${activityId}`);
        //     if (activityId) { // Ensure activityId is valid before fetching similar
        //        // TODO: Implement fetching similar activities
        //        // const similar = await fetchSimilarActivities(activityId); // Example
        //        // setSimilarActivities(similar);
        //     }
        // } catch (simErr) {
        //     console.error("Error fetching similar activities:", simErr);
        // }
        return; // Skip fetching main details if we already have the matching activity
    }

    // If only ID was somehow passed (or initialActivity was null), fetch everything
    if (!activityId) {
        setError("Activity data is missing in navigation params.");
        setLoading(false);
        return;
    }

    console.log(`Fetching details for activity ID: ${activityId}`);
    setLoading(true);
    setError(null);

    try {
      // Fetch main activity details
      // Determine source (assuming Eventbrite if ID starts with 'eventbrite-')
      // This is a simplification; a more robust solution might pass the source or use a lookup
      const source = activityId.startsWith('eventbrite-') ? 'Eventbrite' : 'TripAdvisor'; // Default or determine otherwise
      const activityData = await getActivityDetails(activityId, source);
      setActivity(activityData); // Set the fetched activity data

      if (!activityData) {
        setError("Activity not found."); // Set error if fetch returns null
      }
      // else { // Only fetch similar if main activity was found
      //   // Fetch similar activities
      //   console.log(`Fetching similar activities for fetched activity: ${activityId}`);
      //   // TODO: Implement fetching similar activities
      //   // const similar = await fetchSimilarActivities(activityId); // Example
      //   // setSimilarActivities(similar);
      // }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [activityId, activity]); // Dependencies for useCallback

  useEffect(() => {
    fetchActivityDetails();
  }, [fetchActivityDetails]); // Dependency array for useEffect

  const handleShare = async () => {
    if (!activity) return;
    try {
      await Share.share({
        title: activity.name,
        message: `Check out ${activity.name} on WhatToDoAI! ${activity.shortDescription ?? ''}`,
        url: activity.activity_url || `https://whattodoai.com/activities/${activity.activity_id}`, // Use activity_url if available, fallback
      });
    } catch (error) {
      console.error('Error sharing activity:', error);
    }
   };

  const handleBooking = () => {
    if (!activity?.bookingUrl && !activity?.activity_url) return;
    Linking.openURL(activity.bookingUrl || activity.activity_url || '');
   };

  const handleDirections = () => {
    const venue = activity?.venue;
    const latitude = venue?.latitude;
    const longitude = venue?.longitude;
    const name = venue?.name ?? activity?.name ?? 'Destination';

    if (!latitude || !longitude) return;

    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(name)}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(name)})`,
    });

    if (url) {
      Linking.openURL(url);
    }
   };

  const handleSimilarActivityPress = (selectedActivity: Activity) => {
     navigation.push('ActivityDetail', { activity: selectedActivity });
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
        <Text style={styles.loadingText}>Loading activity details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#E53E3E" />
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={fetchActivityDetails} icon="refresh-outline" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Activity not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} icon="arrow-back-outline" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ActivityImageGallery imageUrls={activity.image_urls ?? activity.imageUrls ?? []} />
      <ActivityHeader activity={activity} />
      <ActivityQuickInfo activity={activity} />

      {activity.description && (
        <ActivitySection title="About">
          <Text style={styles.description}>{activity.description}</Text>
        </ActivitySection>
      )}

      {activity.features && activity.features.length > 0 && (
        <ActivitySection title="Features">
          <View style={styles.featuresList}>
            {activity.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#48BB78" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </ActivitySection>
      )}

      {activity.venue && (
        <ActivitySection title="Location">
          {activity.venue.address && <Text style={styles.address}>{activity.venue.address}</Text>}
          <Text style={styles.address}>
            {activity.venue.city ?? ''}{activity.venue.state ? `, ${activity.venue.state}` : ''} {activity.venue.postalCode ?? ''}
          </Text>
          <ActivityLocationMap venue={activity.venue} activityName={activity.name} />
        </ActivitySection>
      )}

      <ActivityAISummary aiSummary={activity.aiSummary} />

      <SimilarActivities activities={similarActivities} onActivityPress={handleSimilarActivityPress} />

      <ActivityActionButtons
        activity={activity}
        onShare={handleShare}
        onBook={handleBooking}
        onAddToItinerary={() => navigation.navigate('ItineraryPlanner', { activity })}
      />

    </ScrollView>
  );
};

// Keep only essential styles, others are in components
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#4A5568' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC', padding: 20 },
  errorText: { marginTop: 12, marginBottom: 20, fontSize: 16, color: '#E53E3E', textAlign: 'center' },
  description: { fontSize: 16, lineHeight: 24, color: '#4A5568' },
  featuresList: { flexDirection: 'row', flexWrap: 'wrap' },
  featureItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 },
  featureText: { marginLeft: 8, fontSize: 14, color: '#4A5568' },
  address: { fontSize: 16, color: '#4A5568', marginBottom: 4 },
  // Base styles for the placeholder Button
  buttonBase: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ActivityDetailScreen;