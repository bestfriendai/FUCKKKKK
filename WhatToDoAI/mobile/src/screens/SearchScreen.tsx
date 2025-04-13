// WhatToDoAI/mobile/src/screens/SearchScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import {
    View,
    Text,
    Spinner,
    YStack,
    XStack,
    H1,
    H2,
    H4,
    H5,
    Button,
    ScrollView,
    Separator,
    Select,
    Sheet,
    Input,
    Paragraph
} from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Activity, ActivityFilters } from '../types/activity';
import { searchActivities } from '../services/activities';
import ActivityCard from '../components/ActivityCard';
import SearchBar from '../components/SearchBar'; // Import the actual SearchBar component
// Placeholder for location context hook
// import { useLocation } from '../hooks/useLocation';



type SearchScreenProps = NativeStackScreenProps<MainStackParamList, 'Search'>;

// Placeholder useLocation hook - replace with actual implementation later
const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setLocation({ latitude: 40.7128, longitude: -74.0060 }); // Example: NYC
            setLoading(false);
        }, 1000);
    }, []);

    return { location, loading, errorMsg };
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
    // Get any params passed from other screens
    const initialCategory = route.params?.initialCategory;
    const initialQuery = route.params?.initialQuery;
    const featured = route.params?.featured;

    // Categories for filtering
    const [categories] = useState<{id: string, name: string, icon: string}[]>([
        { id: 'cat-1', name: 'Arts & Culture', icon: '🎭' },
        { id: 'cat-2', name: 'Food & Drink', icon: '🍽️' },
        { id: 'cat-3', name: 'Outdoors', icon: '🏞️' },
        { id: 'cat-4', name: 'Music', icon: '🎵' },
        { id: 'cat-5', name: 'Sports', icon: '⚽' },
        { id: 'cat-6', name: 'Nightlife', icon: '🌃' },
        { id: 'cat-7', name: 'Family-Friendly', icon: '👨‍👩‍👧‍👦' },
        { id: 'cat-8', name: 'Tours', icon: '🧭' },
    ]);

    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [radiusFilter, setRadiusFilter] = useState<number>(10);
    const [sortBy, setSortBy] = useState<string>('relevance');
    const [results, setResults] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const { location, loading: locationLoading, errorMsg: locationError } = useLocation();

    // Effect to perform initial search based on route params
    useEffect(() => {
        if (location && !locationLoading) {
            if (featured) {
                // Search for featured activities
                handleSearch('', true);
            } else if (initialCategory) {
                // Search by category
                handleSearch('', true);
            } else if (initialQuery) {
                // Search by query
                handleSearch(initialQuery, true);
            }
        }
    }, [location, locationLoading, initialCategory, initialQuery, featured]);

    const onRefresh = useCallback(async () => {
        if (location) {
            setRefreshing(true);
            try {
                await handleSearch(searchQuery, false, true);
            } catch (error) {
                console.error('Error refreshing data:', error);
            } finally {
                setRefreshing(false);
            }
        }
    }, [location, searchQuery]);

    const handleSearch = useCallback(async (query: string = searchQuery, isInitial: boolean = false, isRefresh: boolean = false) => {
        if (!location) {
            setError("Location is not available to perform search.");
            return;
        }

        // Don't show loading if refreshing
        if (!isRefresh) setLoading(true);
        setError(null);

        try {
            // Build search params
            const searchParams: any = {
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: radiusFilter
                },
                pageSize: 30
            };

            // Add query if provided
            if (query.trim()) {
                searchParams.query = query.trim();
            }

            // Add category filter if selected
            if (selectedCategory) {
                searchParams.categories = [selectedCategory];
            }

            // Add price filter
            if (priceFilter === 'free') {
                searchParams.filters = { ...searchParams.filters, isFree: true };
            }

            // Add sort option
            if (sortBy) {
                // In a real implementation, this would be passed to the API
                // For now, we'll just log it
                console.log(`Sorting by: ${sortBy}`);
            }

            console.log('Search params:', searchParams);

            // Use the searchActivities function from the service
            const searchResult = await searchActivities(searchParams);

            if (searchResult) {
                // For featured search, filter client-side for 4+ star ratings
                if (featured && !isInitial) {
                    const featuredResults = searchResult.filter(activity =>
                        activity.rating && activity.rating >= 4
                    );
                    setResults(featuredResults);
                } else {
                    setResults(searchResult);
                }
            } else {
                setResults([]);
            }
        } catch (err: any) {
            console.error('Error searching activities:', err);
            setError(err.message || 'Failed to perform search.');
            setResults([]); // Clear results on error
        } finally {
            if (!isRefresh) setLoading(false);
        }
    }, [searchQuery, selectedCategory, priceFilter, radiusFilter, sortBy, location, featured]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const handleActivityPress = (activity: Activity) => {
        navigation.navigate('ActivityDetail', { activity });
    };

    const renderActivity = ({ item }: { item: Activity }) => (
        <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
    );

    const renderCategoryItem = ({ item }: { item: {id: string, name: string, icon: string} }) => (
        <Button
            onPress={() => {
                setSelectedCategory(selectedCategory === item.id ? null : item.id);
            }}
            style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategoryItem]}
            chromeless
        >
            <Text fontSize={20}>{item.icon}</Text>
            <Text fontSize={12} marginTop={4} textAlign="center" color={selectedCategory === item.id ? 'blue' : 'gray'}>
                {item.name}
            </Text>
        </Button>
    );

    return (
        <View flex={1} backgroundColor="$background">
            <YStack padding={16} gap={16}>
                <XStack justifyContent="space-between" alignItems="center">
                    <H1>Search</H1>
                    <Button onPress={toggleFilters} chromeless>
                        <XStack alignItems="center" gap={4}>
                            <Text color="blue">{filtersVisible ? 'Hide Filters' : 'Show Filters'}</Text>
                            <Ionicons name={filtersVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#4299E1" />
                        </XStack>
                    </Button>
                </XStack>

                <SearchBar
                    placeholder="Search events, places, keywords..."
                    onSearch={(query) => handleSearch(query)}
                    initialQuery={searchQuery}
                    onChangeQuery={setSearchQuery}
                />

                {filtersVisible && (
                    <View marginTop={8}>
                        <Separator marginVertical={8} />

                        <Text fontWeight="bold" marginBottom={8}>Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <XStack gap={8} paddingVertical={8}>
                                {categories.map(category => renderCategoryItem({ item: category }))}
                            </XStack>
                        </ScrollView>

                        <XStack marginTop={16} gap={16} flexWrap="wrap">
                            <View flex={1} minWidth="45%">
                                <Text marginBottom={4}>Price</Text>
                                <Select
                                    value={priceFilter}
                                    onValueChange={value => setPriceFilter(value)}
                                    items={[
                                        { name: 'All Prices', value: 'all' },
                                        { name: 'Free Only', value: 'free' }
                                    ]}
                                >
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select price" />
                                    </Select.Trigger>

                                    <Select.Content>
                                        <Select.ScrollUpButton />
                                        <Select.Viewport>
                                            <Select.Group>
                                                <Select.Item value="all">
                                                    <Select.ItemText>All Prices</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="free">
                                                    <Select.ItemText>Free Only</Select.ItemText>
                                                </Select.Item>
                                            </Select.Group>
                                        </Select.Viewport>
                                        <Select.ScrollDownButton />
                                    </Select.Content>
                                </Select>
                            </View>

                            <View flex={1} minWidth="45%">
                                <Text marginBottom={4}>Distance</Text>
                                <Select
                                    value={radiusFilter.toString()}
                                    onValueChange={value => setRadiusFilter(parseInt(value))}
                                    items={[
                                        { name: '5 km', value: '5' },
                                        { name: '10 km', value: '10' },
                                        { name: '25 km', value: '25' },
                                        { name: '50 km', value: '50' }
                                    ]}
                                >
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select radius" />
                                    </Select.Trigger>

                                    <Select.Content>
                                        <Select.ScrollUpButton />
                                        <Select.Viewport>
                                            <Select.Group>
                                                <Select.Item value="5">
                                                    <Select.ItemText>5 km</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="10">
                                                    <Select.ItemText>10 km</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="25">
                                                    <Select.ItemText>25 km</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="50">
                                                    <Select.ItemText>50 km</Select.ItemText>
                                                </Select.Item>
                                            </Select.Group>
                                        </Select.Viewport>
                                        <Select.ScrollDownButton />
                                    </Select.Content>
                                </Select>
                            </View>
                        </XStack>

                        <XStack marginTop={16} gap={16}>
                            <View flex={1}>
                                <Text marginBottom={4}>Sort By</Text>
                                <Select
                                    value={sortBy}
                                    onValueChange={value => setSortBy(value)}
                                    items={[
                                        { name: 'Relevance', value: 'relevance' },
                                        { name: 'Distance', value: 'distance' },
                                        { name: 'Rating', value: 'rating' }
                                    ]}
                                >
                                    <Select.Trigger>
                                        <Select.Value placeholder="Sort by" />
                                    </Select.Trigger>

                                    <Select.Content>
                                        <Select.ScrollUpButton />
                                        <Select.Viewport>
                                            <Select.Group>
                                                <Select.Item value="relevance">
                                                    <Select.ItemText>Relevance</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="distance">
                                                    <Select.ItemText>Distance</Select.ItemText>
                                                </Select.Item>
                                                <Select.Item value="rating">
                                                    <Select.ItemText>Rating</Select.ItemText>
                                                </Select.Item>
                                            </Select.Group>
                                        </Select.Viewport>
                                        <Select.ScrollDownButton />
                                    </Select.Content>
                                </Select>
                            </View>
                        </XStack>

                        <XStack marginTop={16} gap={16}>
                            <Button flex={1} onPress={() => handleSearch()} theme="blue">
                                Apply Filters
                            </Button>
                            <Button
                                flex={1}
                                variant="outlined"
                                onPress={() => {
                                    setSelectedCategory(null);
                                    setPriceFilter('all');
                                    setRadiusFilter(10);
                                    setSortBy('relevance');
                                    setSearchQuery('');
                                    handleSearch('', true);
                                }}
                            >
                                Reset
                            </Button>
                        </XStack>

                        <Separator marginVertical={16} />
                    </View>
                )}

                {/* Results title */}
                <XStack justifyContent="space-between" alignItems="center" marginTop={filtersVisible ? 0 : 16}>
                    <H5>
                        {featured ? 'Featured Activities' :
                         selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Activities` :
                         searchQuery ? `Results for "${searchQuery}"` : 'All Activities'}
                    </H5>
                    {results.length > 0 && <Text color="gray">{results.length} found</Text>}
                </XStack>
            </YStack>

            {loading ? (
                <YStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="large" />
                </YStack>
            ) : error ? (
                <YStack flex={1} justifyContent="center" alignItems="center" padding={16}>
                    <Text color="red" textAlign="center">{error}</Text>
                </YStack>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderActivity}
                    keyExtractor={(item) => item.activity_id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4299E1']}
                        />
                    }
                    ListEmptyComponent={
                        <YStack flex={1} justifyContent="center" alignItems="center" marginTop={40}>
                            <Text textAlign="center">
                                {searchQuery.trim() ?
                                    `No results found for "${searchQuery}".` :
                                    featured ?
                                        'No featured activities found nearby.' :
                                        selectedCategory ?
                                            `No ${categories.find(c => c.id === selectedCategory)?.name || 'category'} activities found nearby.` :
                                            'Search for activities or apply filters to see results.'}
                            </Text>
                            {(searchQuery.trim() || selectedCategory || featured) && (
                                <Button marginTop={16} variant="outlined" onPress={() => {
                                    setSelectedCategory(null);
                                    setPriceFilter('all');
                                    setRadiusFilter(10);
                                    setSortBy('relevance');
                                    setSearchQuery('');
                                    handleSearch('', true);
                                }}>
                                    Clear Search
                                </Button>
                            )}
                        </YStack>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        width: 70,
        padding: 8,
        borderRadius: 8,
    },
    selectedCategoryItem: {
        backgroundColor: '#E6F0FF',
    },
});

export default SearchScreen;
