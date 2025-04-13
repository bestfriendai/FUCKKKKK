// WhatToDoAI/mobile/src/screens/SearchScreen.tsx

import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
    View,
    Text,
    Spinner,
    YStack,
    XStack,
    H1,
    H5,
    Button
} from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity, ActivityFilters } from '../types/activity';
import { searchActivities } from '../services/activities';
import ActivityCard from '../components/ActivityCard';
import SearchBar from '../components/SearchBar'; // Import the actual SearchBar component
// Placeholder for location context hook
// import { useLocation } from '../hooks/useLocation';



type SearchScreenProps = NativeStackScreenProps<MainStackParamList, 'Search'>;

// Placeholder useLocation hook
const useLocation = () => ({ location: { latitude: 40.7128, longitude: -74.0060 }, loading: false, errorMsg: null });

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Partial<ActivityFilters>>({}); // State for filters
    const [results, setResults] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { location, loading: locationLoading, errorMsg: locationError } = useLocation();

    const handleSearch = useCallback(async (query: string = searchQuery) => {
        if (!location) {
            setError("Location is not available to perform search.");
            return;
        }
        if (!query.trim()) {
                // Optionally clear results or show prompt if query is empty
                setResults([]);
                return;
        }

        console.log(`Performing search for: "${query}" with filters:`, filters);
        setLoading(true);
        setError(null);
        try {
            // Use the searchActivities function from the service
            const searchResult = await searchActivities({
                searchQuery: query,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: 10 // Default radius in km
                },
                ...filters,
                limit: 30
            });

            if (searchResult) {
                setResults(searchResult);
            } else {
                setResults([]);
            }
        } catch (err: any) {
            console.error('Error searching activities:', err);
            setError(err.message || 'Failed to perform search.');
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, location]); // Depend on query, filters, and location

    const handleActivityPress = (activity: Activity) => {
        navigation.navigate('ActivityDetail', { activity });
    };

    const renderActivity = ({ item }: { item: Activity }) => (
        <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
    );

    // TODO: Implement filter UI and update `filters` state

    return (
        <View flex={1} backgroundColor="$background">
            <YStack padding="$4" gap="$4">
                <H1>Search Activities</H1>
                <SearchBar
                    placeholder="Search events, places, keywords..."
                    onSearch={handleSearch} // Pass the search handler
                    initialQuery={searchQuery} // Control the input if needed
                    onChangeQuery={setSearchQuery} // Update query state on change
                />
                {/* Placeholder for Filter UI */}
                {/* <Text>Filters (TODO)</Text> */}
            </YStack>

            {loading ? (
                <YStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="large" />
                </YStack>
            ) : error ? (
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                    <Text color="red" textAlign="center">{error}</Text>
                </YStack>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderActivity}
                    keyExtractor={(item) => item.activity_id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        // Show message only if not loading and no error, and search was attempted
                        !loading && !error && searchQuery.trim() ? (
                            <YStack flex={1} justifyContent="center" alignItems="center" marginTop="$10">
                                <Text>No results found for "{searchQuery}".</Text>
                                <Button marginTop="$4" variant="outlined" onPress={() => setSearchQuery('')}>
                                    <Text>Clear Search</Text>
                                </Button>
                            </YStack>
                        ) : null
                    }
                />
            )}
        </View>
    );
};

// Removed local placeholder SearchBar component and styles

export default SearchScreen;
