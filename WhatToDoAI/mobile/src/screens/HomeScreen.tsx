// WhatToDoAI/mobile/src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native';
import {
    YStack,
    XStack,
    Text,
    Spinner,
    Button,
    H1,
    H5
} from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { searchActivities } from '../services/activities'; // Import the specific function
import ActivityCard from '../components/ActivityCard';
// Placeholder for location context hook - create this context later based on instructions.md
// import { useLocation } from '../hooks/useLocation';

type HomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Home'>;

// Placeholder useLocation hook - replace with actual implementation later
const useLocation = () => {
        const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
        const [loading, setLoading] = useState(true);
        const [errorMsg, setErrorMsg] = useState<string | null>(null);

        useEffect(() => {
                setTimeout(() => {
                        setLocation({ latitude: 40.7128, longitude: -74.0060 }); // Example: NYC
                        setLoading(false);
                }, 1500);
        }, []);

        return { location, loading, errorMsg };
};



const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
        const [activities, setActivities] = useState<Activity[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const { location, loading: locationLoading, errorMsg: locationError } = useLocation(); // Use the placeholder location hook

        useEffect(() => {
                if (!locationLoading && location && !locationError) {
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
                        // Use the searchActivities function from the service
                        const result = await searchActivities({ location: { latitude, longitude }, pageSize: 20 });
                        if (result) {
                                setActivities(result);
                        } else {
                                setError('Failed to fetch activities.');
                                setActivities([]); // Clear activities on error
                        }
                } catch (err: any) {
                        console.error('Error fetching activities:', err);
                        setError(err.message || 'Failed to fetch activities.');
                } finally {
                        setLoading(false);
                }
        };

        const handleActivityPress = (activity: Activity) => {
                navigation.navigate('ActivityDetail', { activity });
        };

        const renderActivity = ({ item }: { item: Activity }) => (
                <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
        );

        if (loading || locationLoading) {
            return (
                <YStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="large" />
                    <Text marginTop="$2">{locationLoading ? 'Getting location...' : 'Loading activities...'}</Text>
                </YStack>
            );
        }

        if (error) {
            return (
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                    <Text color="red" textAlign="center">{error}</Text>
                    <Button onPress={() => fetchActivities(40.7128, -74.0060)} marginTop="$4">
                        <Text>Retry</Text>
                    </Button>
                </YStack>
            );
        }

        return (
            <YStack flex={1} backgroundColor="$background">
                <FlatList
                    data={activities}
                    renderItem={renderActivity}
                    keyExtractor={(item) => item.activity_id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <YStack padding="$4">
                            <H1>Discover Nearby</H1>
                            <Text color="gray" marginTop="$2" marginBottom="$4">
                                Find exciting activities near you
                            </Text>
                        </YStack>
                    }
                    ListEmptyComponent={
                        <YStack justifyContent="center" alignItems="center" padding="$8">
                            <Text>No activities found nearby.</Text>
                            <Button onPress={() => fetchActivities(40.7128, -74.0060)} marginTop="$4">
                                <Text>Refresh</Text>
                            </Button>
                        </YStack>
                    }
                />
            </YStack>
        );
};

export default HomeScreen;
