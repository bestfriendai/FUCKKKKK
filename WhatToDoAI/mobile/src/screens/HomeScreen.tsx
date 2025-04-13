// WhatToDoAI/mobile/src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native';
import {
    YStack,
    XStack,
    Text,
    Spinner,
    Button,
    Image,
    H1, H5
} from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { searchActivities } from '../services/activities';
import ActivityCard from '../components/ActivityCard';

// Placeholder useLocation hook
const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setLocation({ latitude: 40.7128, longitude: -74.0060 });
            setLoading(false);
        }, 1000);
    }, []);

    return { location, loading, errorMsg };
};

type HomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
    const [popularCategories] = useState<{id: string, name: string, icon: string}[]>([
        { id: 'cat-1', name: 'Arts & Culture', icon: '🎭' },
        { id: 'cat-2', name: 'Food & Drink', icon: '🍽️' },
        { id: 'cat-3', name: 'Outdoors', icon: '🏞️' },
        { id: 'cat-4', name: 'Music', icon: '🎵' },
        { id: 'cat-5', name: 'Sports', icon: '⚽' },
    ]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { location, loading: locationLoading, errorMsg: locationError } = useLocation();

    useEffect(() => {
        if (!locationLoading && location && !locationError) {
            fetchActivities(location.latitude, location.longitude);
            fetchFeaturedActivities(location.latitude, location.longitude);
        } else if (locationError) {
            setError(`Location Error: ${locationError}. Cannot fetch nearby activities.`);
            setLoading(false);
        } else if (!locationLoading && !location) {
            setError("Could not determine location. Cannot fetch nearby activities.");
            setLoading(false);
        }
    }, [location, locationLoading, locationError]);

    const onRefresh = useCallback(async () => {
        if (location) {
            setRefreshing(true);
            try {
                await Promise.all([
                    fetchActivities(location.latitude, location.longitude),
                    fetchFeaturedActivities(location.latitude, location.longitude)
                ]);
            } catch (err) { // Use err instead of error which shadows state variable
                console.error('Error refreshing data:', err);
            } finally {
                setRefreshing(false);
            }
        }
    }, [location]);

    const fetchActivities = async (latitude: number, longitude: number) => {
        if (!refreshing) setLoading(true);
        setError(null);
        try {
            const result = await searchActivities({
                location: { latitude, longitude, radius: 10 },
                pageSize: 20
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
            if (!refreshing) setLoading(false);
        }
    };

    const fetchFeaturedActivities = async (latitude: number, longitude: number) => {
        try {
            const result = await searchActivities({
                location: { latitude, longitude, radius: 25 },
                pageSize: 10
            });
            const featuredResults = result?.filter(activity =>
                activity.rating && activity.rating >= 4
            ).slice(0, 5);
            if (featuredResults && featuredResults.length > 0) {
                setFeaturedActivities(featuredResults);
            }
        } catch (err: any) {
            console.error('Error fetching featured activities:', err);
        }
    };

    const handleCategoryPress = (categoryId: string) => {
        navigation.navigate('Search', { initialCategory: categoryId });
    };

    const handleActivityPress = (activity: Activity) => {
        navigation.navigate('ActivityDetail', { activity });
    };

    const renderActivity = ({ item }: { item: Activity }) => (
        <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
    );

    if (loading || locationLoading) {
        return (
            // Use full prop names
            <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
                {/* Use full prop name */}
                <Text marginTop="$2">{locationLoading ? 'Getting location...' : 'Loading activities...'}</Text>
            </YStack>
        );
    }

    if (error) {
        return (
             // Use full prop names, standard color/textAlign
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                <Text color="red" textAlign="center">{error}</Text>
            </YStack>
        );
    }

    const renderFeaturedItem = ({ item }: { item: Activity }) => (
        <Pressable
            onPress={() => handleActivityPress(item)}
            style={styles.featuredItem}
        >
            <Image
                source={{ uri: item.image_urls?.[0] || 'https://via.placeholder.com/300x200' }}
                alt={item.name}
                style={styles.featuredImage}
            />
            {/* Use full prop names, standard color/fontSize */}
            <YStack padding="$2" backgroundColor="$background" style={styles.featuredContent}>
                <Text numberOfLines={1} fontWeight="bold">{item.name}</Text>
                <Text numberOfLines={1} fontSize={12} color="grey">
                    {item.venue?.name || 'Various locations'}
                </Text>
            </YStack>
        </Pressable>
    );

    const renderCategoryItem = ({ item }: { item: {id: string, name: string, icon: string} }) => (
        <Pressable
            onPress={() => handleCategoryPress(item.id)}
            style={styles.categoryItem}
        >
            <YStack style={styles.categoryIcon}>
                 {/* Use standard fontSize */}
                <Text fontSize={24}>{item.icon}</Text>
            </YStack>
             {/* Use full prop names, standard fontSize/textAlign */}
            <Text fontSize={12} marginTop="$1" textAlign="center">{item.name}</Text>
        </Pressable>
    );

    return (
        // Use full prop name
        <YStack flex={1} backgroundColor="$background">
            <FlatList
                data={activities}
                renderItem={renderActivity}
                keyExtractor={(item) => item.activity_id}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4299E1']}
                    />
                }
                ListHeaderComponent={
                    <YStack>
                         {/* Use full prop names */}
                        <YStack padding="$4" paddingBottom="$2">
                             {/* Use full prop names */}
                            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                                <H1>Discover</H1>
                                <Pressable onPress={() => navigation.navigate('Search', {})}>
                                     {/* Use full prop name */}
                                    <XStack alignItems="center">
                                         {/* Use full prop names, standard color */}
                                        <Text color="blue" marginRight="$1">Search</Text>
                                        <Ionicons name="search" size={18} color="#4299E1" />
                                    </XStack>
                                </Pressable>
                            </XStack>

                             {/* Use full prop names, standard color */}
                            <Text color="grey" marginBottom="$4">
                                Find exciting activities near you
                            </Text>

                            {/* Categories */}
                             {/* Use full prop name */}
                            <H5 marginBottom="$2">Categories</H5>
                            <FlatList
                                data={popularCategories}
                                renderItem={renderCategoryItem}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 8 }}
                            />

                            {/* Featured Activities */}
                            {featuredActivities.length > 0 && (
                                 // Use full prop name
                                <YStack marginTop="$4">
                                     {/* Use full prop names */}
                                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                                        <H5>Featured</H5>
                                        <Pressable onPress={() => navigation.navigate('Search', { featured: true })}>
                                             {/* Use full prop name, standard color/fontSize */}
                                            <Text color="blue" fontSize={12}>See All</Text>
                                        </Pressable>
                                    </XStack>
                                    <FlatList
                                        data={featuredActivities}
                                        renderItem={renderFeaturedItem}
                                        keyExtractor={(item) => item.activity_id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingVertical: 8 }}
                                    />
                                </YStack>
                            )}

                             {/* Use full prop names */}
                            <H5 marginTop="$4" marginBottom="$2">Nearby Activities</H5>
                        </YStack>

                        {activities.length === 0 && !loading && (
                             // Use full prop names
                            <YStack justifyContent="center" alignItems="center" padding="$8">
                                <Text>No activities found nearby.</Text>
                                 {/* Use full prop name */}
                                <Button onPress={onRefresh} marginTop="$4" variant="outlined">
                                    <Text>Refresh</Text>
                                </Button>
                            </YStack>
                        )}
                    </YStack>
                }
            />
        </YStack>
    );
};

// Keep StyleSheet for complex styles or styles applied via the `style` prop
const styles = StyleSheet.create({
    featuredItem: {
        width: 200,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'white', // Consider using Tamagui theme tokens later
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    featuredImage: {
        width: '100%',
        height: 120,
    },
    featuredContent: {
        // padding: 8, // Handled by Tamagui YStack padding prop
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 70,
    },
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E6F0FF', // Consider using Tamagui theme tokens later
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default HomeScreen;
