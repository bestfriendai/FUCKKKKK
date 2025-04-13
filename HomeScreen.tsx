import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPopularActivities, getRecommendations, getNearbyActivities } from '../services/activities';
import { Activity } from '../types/activity';
import { MainStackParamList } from '../navigation/types';
import ActivityCard from '../components/ActivityCard';
import SearchBar from '../components/SearchBar';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [popularActivities, setPopularActivities] = useState<Activity[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);
  const [nearbyActivities, setNearbyActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 40.7128, // Default to NYC
    longitude: -74.0060,
  });

  useEffect(() => {
    fetchActivities();
    // In a real app, we would get the user's location here
    // using React Native's Geolocation API
  }, []);

  const fetchActivities = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [popular, recommended, nearby] = await Promise.all([
        getPopularActivities(),
        getRecommendations(),
        getNearbyActivities(currentLocation.latitude, currentLocation.longitude),
      ]);
      
      setPopularActivities(popular);
      setRecommendedActivities(recommended);
      setNearbyActivities(nearby);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    fetchActivities();
  };

  const handleSearch = (): void => {
    navigation.navigate('Search');
  };

  const handleActivityPress = (activity: Activity): void => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  const handleViewAllPress = (category: string): void => {
    navigation.navigate('Search', { category });
  };

  const renderActivityItem = ({ item }: { item: Activity }): React.ReactElement => (
    <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
  );

  const renderSectionHeader = (title: string, onViewAll: () => void): React.ReactElement => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello there!</Text>
          <Text style={styles.subtitle}>Discover amazing activities</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={require('../assets/default-avatar.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      
      <SearchBar onPress={handleSearch} placeholder="Search activities..." />
      
      <FlatList
        data={[1]} // Dummy data for single render
        keyExtractor={() => 'main-content'}
        renderItem={() => (
          <View style={styles.content}>
            {/* Popular Activities */}
            {renderSectionHeader('Popular Activities', () => handleViewAllPress('popular'))}
            <FlatList
              horizontal
              data={popularActivities}
              keyExtractor={(item) => `popular-${item.id}`}
              renderItem={renderActivityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
            
            {/* Recommended For You */}
            {renderSectionHeader('Recommended For You', () => handleViewAllPress('recommended'))}
            <FlatList
              horizontal
              data={recommendedActivities}
              keyExtractor={(item) => `recommended-${item.id}`}
              renderItem={renderActivityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
            
            {/* Nearby Activities */}
            {renderSectionHeader('Nearby Activities', () => handleViewAllPress('nearby'))}
            <FlatList
              horizontal
              data={nearbyActivities}
              keyExtractor={(item) => `nearby-${item.id}`}
              renderItem={renderActivityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4A80F0',
    fontWeight: '500',
  },
  horizontalListContent: {
    paddingRight: 24,
  },
});

export default HomeScreen;