# Enhanced Product Definition and Requirements (PDR): WhatToDoAI

## Table of Contents
1. [Introduction & Product Vision](#1-introduction--product-vision)
2. [Functional Requirements](#2-functional-requirements)
3. [Technical Architecture & Stack](#3-technical-architecture--stack)
4. [UI/UX Design & Libraries](#4-uiux-design--libraries)
5. [Data Model](#5-data-model)
6. [API Integrations](#6-api-integrations)
7. [AI & Machine Learning Capabilities](#7-ai--machine-learning-capabilities)
8. [Non-Functional Requirements (NFRs)](#8-non-functional-requirements-nfrs)
9. [Development Roadmap & Phasing](#9-development-roadmap--phasing)
10. [Success Metrics](#10-success-metrics)
11. [Risks & Mitigation](#11-risks--mitigation)
12. [Conclusion](#12-conclusion)

## 1. Introduction & Product Vision

### 1.1. Purpose

This Product Definition and Requirements (PDR) document provides a comprehensive blueprint for the WhatToDoAI application. It outlines the product's vision, target audience, core functionalities, technical specifications, design principles, and strategic roadmap. This document serves as the foundational reference for the development team (web, mobile, backend), designers, product managers, and all other stakeholders, ensuring alignment, clarity, and a shared understanding of the project goals and specifications throughout the development lifecycle.

### 1.2. Product Overview

WhatToDoAI is envisioned as a sophisticated, cross-platform application designed to operate seamlessly on both web (React.js) and mobile (React Native Expo) environments. Its primary function is to serve as an intelligent aggregator and recommendation engine for local activities, events, and points of interest. By consolidating diverse information streams and leveraging AI-driven personalization techniques, the application aims to simplify the process of discovering and planning engaging experiences for its users.

### 1.3. Product Vision Statement

To be the go-to intelligent companion for discovering and planning engaging local experiences, tailored to individual preferences and context through cutting-edge AI.

### 1.4. Core Value Proposition

WhatToDoAI differentiates itself and provides value to users through three primary pillars:

- **Comprehensive Aggregation**: The application consolidates information about a wide array of local activities from multiple authoritative sources, normalized and presented within a single, intuitive interface.

- **AI-Driven Personalization**: WhatToDoAI delivers highly relevant activity recommendations through machine learning models that understand user preferences, interaction history, location, time, and contextual factors.

- **Simplified Planning**: The application provides intuitive tools for saving favorite activities, creating structured itineraries with AI assistance, and sharing plans with others.

### 1.5. Target User Personas

To ensure the application effectively meets user needs, development will focus on serving the following primary user personas:

- **Persona 1: The Single Urban Explorer (Sarah, 28)**
- **Persona 2: The Established Couple (Mark & Lisa, 35)**
- **Persona 3: The Visitor/Tourist (David, 45)**

## 2. Functional Requirements

### 2.1. Activity Discovery

#### 2.1.1. Location-Based Feed

Upon opening the app, the default view will present a feed of activities geographically close to the user, using the device's GPS capabilities (requiring user permission).

**Code Example:**
```typescript
// context/LocationContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';

type LocationType = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  location: LocationType | null;
  errorMsg: string | null;
  loading: boolean;
  updateLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Failed to get location');
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocation();
    
    // Set up location updates when app is in foreground
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100, // Update if user moves by 100 meters
        timeInterval: 60000, // Or update every minute
      },
      (newLocation) => {
        setLocation({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        });
      }
    );

    return () => {
      subscription.then(sub => sub.remove());
    };
  }, []);

  const value = {
    location,
    errorMsg,
    loading,
    updateLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
```

#### 2.1.2. AI-Powered Personalized Feed

Authenticated users will have access to a feed curated specifically for them using machine learning models that analyze user preferences, interaction history, and contextual signals.

**Personalization Engine Example:**

```typescript
// api/recommendationService.ts
import { supabase } from './supabase';
import { Activity, UserInteraction, UserPreferences } from '../types';

export const recommendationService = {
  // Get personalized recommendations for a user
  getPersonalizedRecommendations: async (
    userId: string,
    latitude: number,
    longitude: number,
    limit: number = 20
  ): Promise<{ data: Activity[] | null; error: any }> => {
    try {
      // This would call our ML recommendation endpoint in production
      // Here we're using a simplified RPC function in Supabase
      const { data, error } = await supabase.rpc('get_personalized_recommendations', {
        user_id: userId,
        lat: latitude, 
        lng: longitude,
        limit_count: limit
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { data: null, error };
    }
  },

  // Track user interaction with an activity (view, click, save, attend)
  trackInteraction: async (
    userId: string,
    activityId: string,
    interactionType: 'view' | 'click' | 'save' | 'attend'
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          activity_id: activityId,
          interaction_type: interactionType,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error tracking user interaction:', error);
      return { success: false, error };
    }
  },
  
  // Update user preferences
  updateUserPreferences: async (
    userId: string, 
    preferences: UserPreferences
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return { success: false, error };
    }
  }
};
```

#### 2.1.3. Smart Category Browsing

Users can browse activities based on predefined categories, with AI-enhanced categorization that improves over time.

#### 2.1.4. Map View with Smart Clustering

An interactive map interface, powered by Mapbox, will provide an alternative discovery method, with activities displayed as markers and intelligently clustered for better visualization.

**Map Implementation Example:**

```typescript
// components/SmartMapView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Mapbox, { Camera, MarkerView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { Activity } from '../types';
import { mapboxClustering } from '../utils/mapboxHelpers';

interface SmartMapViewProps {
  activities: Activity[];
  userLocation?: { latitude: number; longitude: number };
  onActivitySelect: (activity: Activity) => void;
  onClusterPress: (coordinates: [number, number], pointCount: number) => void;
  zoomLevel?: number;
}

const SmartMapView: React.FC<SmartMapViewProps> = ({
  activities,
  userLocation,
  onActivitySelect,
  onClusterPress,
  zoomLevel = 12
}) => {
  const mapRef = useRef(null);
  const [clusterData, setClusterData] = useState(null);
  
  useEffect(() => {
    if (activities?.length > 0) {
      // Generate GeoJSON feature collection for clustering
      const features = activities
        .filter(a => a.venue?.latitude && a.venue?.longitude)
        .map(activity => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [activity.venue.longitude, activity.venue.latitude]
          },
          properties: {
            id: activity.activity_id,
            name: activity.name,
            category: activity.category?.name || 'Uncategorized',
            imageUrl: activity.image_urls?.[0] || null,
            activity: JSON.stringify(activity)
          }
        }));
        
      setClusterData({
        type: 'FeatureCollection',
        features
      });
    }
  }, [activities]);

  const handleClusterPress = (event) => {
    const feature = event.features[0];
    if (feature.properties.cluster) {
      // It's a cluster, handle zoom or expansion
      const clusterId = feature.properties.cluster_id;
      const pointCount = feature.properties.point_count;
      const coordinates = feature.geometry.coordinates;
      
      onClusterPress(coordinates, pointCount);
      
      // Optional: Zoom into cluster
      mapRef.current?.getClusterExpansionZoom(clusterId).then(nextZoom => {
        mapRef.current?.setCamera({
          centerCoordinate: coordinates,
          zoomLevel: nextZoom,
          animationDuration: 500
        });
      });
    } else {
      // It's a single activity
      const activity = JSON.parse(feature.properties.activity);
      onActivitySelect(activity);
    }
  };

  return (
    <Mapbox.MapView
      ref={mapRef}
      style={styles.map}
      styleURL={Mapbox.StyleURL.Street}
      onPress={handleClusterPress}
    >
      {/* Camera */}
      {userLocation && (
        <Camera
          zoomLevel={zoomLevel}
          centerCoordinate={[userLocation.longitude, userLocation.latitude]}
          animationDuration={300}
        />
      )}
      
      {/* User location marker */}
      {userLocation && (
        <MarkerView
          id="userLocation"
          coordinate={[userLocation.longitude, userLocation.latitude]}
        >
          <View style={styles.userMarker} />
        </MarkerView>
      )}
      
      {/* Clustered activities */}
      {clusterData && (
        <ShapeSource
          id="activities"
          shape={clusterData}
          cluster
          clusterMaxZoomLevel={14}
          clusterRadius={50}
        >
          {/* Clustered circles */}
          <SymbolLayer
            id="clusteredPoints"
            filter={['has', 'point_count']}
            style={{
              iconImage: 'cluster',
              iconSize: [
                'interpolate',
                ['linear'],
                ['get', 'point_count'],
                10, 20,
                50, 30,
                100, 40
              ],
              iconColor: '#2196F3',
              textField: '{point_count}',
              textSize: 12,
              textColor: '#FFFFFF',
              textAllowOverlap: true,
              textIgnorePlacement: true
            }}
          />
          
          {/* Individual point markers */}
          <SymbolLayer
            id="singlePoints"
            filter={['!', ['has', 'point_count']]}
            style={{
              iconImage: 'marker',
              iconSize: 0.8,
              iconAllowOverlap: true,
              iconColor: [
                'match',
                ['get', 'category'],
                'Music', '#E91E63',
                'Sports', '#4CAF50',
                'Arts & Theatre', '#9C27B0',
                'Food', '#FF9800',
                '#2196F3' // default color
              ],
              textField: '{name}',
              textSize: 10,
              textOffset: [0, 1.5],
              textAnchor: 'top',
              textAllowOverlap: false,
              textOptional: true
            }}
          />
        </ShapeSource>
      )}
    </Mapbox.MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default SmartMapView;
```

### 2.2. Advanced Search with Natural Language Processing

#### 2.2.1. NLP-Powered Search

The application will feature a natural language search capability that understands complex queries like "outdoor activities for kids this weekend" or "romantic dining spots with a view."

**NLP Search Implementation:**

```typescript
// api/nlpSearchService.ts
import axios from 'axios';
import { Activity, SearchQuery } from '../types';

const AI_API_ENDPOINT = process.env.EXPO_PUBLIC_AI_API_ENDPOINT;

export const nlpSearchService = {
  // Parse natural language query into structured search parameters
  parseNaturalLanguageQuery: async (
    query: string,
    userId?: string, // Optional user ID for personalized parsing
  ): Promise<{ data: SearchQuery | null; error: any }> => {
    try {
      const response = await axios.post(`${AI_API_ENDPOINT}/parse-query`, {
        query,
        userId,
      });
      
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error parsing natural language query:', error);
      return { data: null, error };
    }
  },
  
  // Execute search using parsed parameters
  executeStructuredSearch: async (
    searchParams: SearchQuery,
    latitude: number,
    longitude: number,
  ): Promise<{ data: Activity[] | null; error: any }> => {
    try {
      const response = await axios.post(`${AI_API_ENDPOINT}/execute-search`, {
        params: searchParams,
        location: { latitude, longitude },
      });
      
      return { data: response.data.activities, error: null };
    } catch (error) {
      console.error('Error executing structured search:', error);
      return { data: null, error };
    }
  },
  
  // Combined function to search directly with natural language
  searchWithNaturalLanguage: async (
    query: string,
    latitude: number,
    longitude: number,
    userId?: string,
  ): Promise<{ data: Activity[] | null; parsedQuery: SearchQuery | null; error: any }> => {
    try {
      // Step 1: Parse the query
      const { data: parsedQuery, error: parseError } = await this.parseNaturalLanguageQuery(query, userId);
      
      if (parseError) throw parseError;
      if (!parsedQuery) throw new Error('Failed to parse query');
      
      // Step 2: Execute search with parsed parameters
      const { data: activities, error: searchError } = await this.executeStructuredSearch(
        parsedQuery,
        latitude,
        longitude
      );
      
      if (searchError) throw searchError;
      
      return { 
        data: activities, 
        parsedQuery,
        error: null 
      };
    } catch (error) {
      console.error('Error in natural language search:', error);
      return { data: null, parsedQuery: null, error };
    }
  }
};
```

**Natural Language Search UI Component:**

```tsx
// components/NLPSearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, Text, Icon, HStack, VStack } from 'gluestack-ui';
import { Ionicons } from '@expo/vector-icons';
import { nlpSearchService } from '../api/nlpSearchService';
import { useLocation } from '../context/LocationContext';
import { SearchQuery } from '../types';

interface NLPSearchBarProps {
  onSearch: (results: any[], parsedQuery: SearchQuery) => void;
  userId?: string;
}

const NLPSearchBar: React.FC<NLPSearchBarProps> = ({ onSearch, userId }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { location } = useLocation();

  const handleSearch = async () => {
    if (!query.trim() || !location) return;
    
    setLoading(true);
    try {
      const { data, parsedQuery, error } = await nlpSearchService.searchWithNaturalLanguage(
        query,
        location.latitude,
        location.longitude,
        userId
      );
      
      if (error) throw error;
      
      if (data && parsedQuery) {
        onSearch(data, parsedQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };

  // Provide real-time suggestions as user types
  const getSuggestions = async (text: string) => {
    if (!text || text.length < 3) {
      setSuggestions([]);
      return;
    }
    
    // API call to get search suggestions based on partial input
    // This could use a simpler/faster endpoint than the full search
    const suggestedQueries = [
      `${text} for this weekend`,
      `${text} with kids`,
      `${text} near me`,
      `best ${text}`,
    ];
    
    setSuggestions(suggestedQueries);
  };

  return (
    <VStack space="sm" w="100%">
      <HStack 
        alignItems="center" 
        space="sm" 
        bg="white" 
        borderRadius="lg" 
        py="sm" 
        px="md"
        shadow="2"
      >
        <Icon 
          as={Ionicons} 
          name="search-outline" 
          size="lg" 
          color="gray.400" 
        />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            getSuggestions(text);
          }}
          placeholder="Try 'romantic dinner spots for tonight'"
          placeholderTextColor="#A0AEC0"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#4299E1" />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon as={Ionicons} name="close-circle" size="md" color="gray.400" />
          </TouchableOpacity>
        ) : null}
      </HStack>
      
      {/* Query suggestions */}
      {suggestions.length > 0 && (
        <Box bg="white" borderRadius="md" py="xs" overflow="hidden" shadow="1">
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setQuery(suggestion);
                setSuggestions([]);
                handleSearch();
              }}
            >
              <HStack alignItems="center" space="sm">
                <Icon as={Ionicons} name="search-outline" size="sm" color="gray.400" />
                <Text size="sm">{suggestion}</Text>
              </HStack>
            </TouchableOpacity>
          ))}
        </Box>
      )}
    </VStack>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A202C',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
});

export default NLPSearchBar;
```

### 2.3. Rich Activity Details

#### 2.3.1. Enhanced Activity Details with AI-Generated Summaries

The application will provide comprehensive details about activities, including AI-generated summaries that highlight key aspects like atmosphere, family-friendliness, and price-value ratio.

**AI Summary Component Example:**

```tsx
// components/AISummary.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Box, Text, VStack, HStack, Icon } from 'gluestack-ui';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { aiService } from '../api/aiService';

interface AISummaryProps {
  activity: Activity;
}

const AISummary: React.FC<AISummaryProps> = ({ activity }) => {
  const [summary, setSummary] = useState<{
    overview: string;
    highlights: string[];
    atmosphereRating: number;
    familyFriendliness: number;
    priceValue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateSummary();
  }, [activity]);

  const generateSummary = async () => {
    if (!activity) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await aiService.generateActivitySummary(activity);
      
      if (error) throw new Error(error);
      
      setSummary(data);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Unable to generate summary at this time');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p="md">
        <HStack space="sm" alignItems="center">
          <ActivityIndicator size="small" color="#4299E1" />
          <Text>Generating insights...</Text>
        </HStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!summary) return null;

  // Helper to render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon 
          key={i}
          as={Ionicons} 
          name={i <= rating ? "star" : "star-outline"} 
          size="sm" 
          color={i <= rating ? "yellow.500" : "gray.400"} 
        />
      );
    }
    return stars;
  };

  return (
    <VStack space="md" p="md" bg="blue.50" borderRadius="md">
      <Text fontWeight="bold" size="lg" color="blue.800">
        AI-Generated Insights
      </Text>
      
      <Text>{summary.overview}</Text>
      
      <VStack space="xs" mt="xs">
        <Text fontWeight="bold" size="md">Highlights:</Text>
        {summary.highlights.map((highlight, index) => (
          <HStack key={index} space="xs" alignItems="center">
            <Icon as={Ionicons} name="checkmark-circle" size="sm" color="green.500" />
            <Text>{highlight}</Text>
          </HStack>
        ))}
      </VStack>
      
      <VStack space="sm" mt="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Text>Atmosphere:</Text>
          <HStack>{renderRating(summary.atmosphereRating)}</HStack>
        </HStack>
        
        <HStack justifyContent="space-between" alignItems="center">
          <Text>Family-Friendly:</Text>
          <HStack>{renderRating(summary.familyFriendliness)}</HStack>
        </HStack>
        
        <HStack justifyContent="space-between" alignItems="center">
          <Text>Price-Value:</Text>
          <HStack>{renderRating(summary.priceValue)}</HStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default AISummary;
```

### 2.4. AI-Enhanced Planning Tools

#### 2.4.1. Smart Itinerary Creation

The application will feature AI-powered itinerary suggestions based on user preferences, time constraints, and logistics (like travel time between activities).

**Smart Itinerary Generator Example:**

```tsx
// components/SmartItineraryGenerator.tsx
import React, { useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  FormControl, 
  Input, 
  Checkbox,
  Select,
  Icon,
  Divider,
  Card
} from 'gluestack-ui';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { itineraryService } from '../api/itineraryService';
import { Activity, Itinerary, ItineraryPreferences } from '../types';
import ItineraryDayCard from './ItineraryDayCard';

interface SmartItineraryGeneratorProps {
  userLocation: { latitude: number; longitude: number };
  onItineraryCreated: (itinerary: Itinerary) => void;
  userId: string;
}

const SmartItineraryGenerator: React.FC<SmartItineraryGeneratorProps> = ({
  userLocation,
  onItineraryCreated,
  userId
}) => {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<ItineraryPreferences>({
    name: 'My Trip',
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    budget: 'medium', // low, medium, high
    interests: [],
    includeFood: true,
    transportMode: 'walking', // walking, driving, public
    pacePreference: 'balanced', // relaxed, balanced, intensive
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);

  const interestOptions = [
    { label: 'Arts & Culture', value: 'arts' },
    { label: 'Outdoors & Nature', value: 'outdoors' },
    { label: 'Food & Dining', value: 'food' },
    { label: 'Nightlife', value: 'nightlife' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Family-Friendly', value: 'family' },
    { label: 'History', value: 'history' },
    { label: 'Sports', value: 'sports' },
  ];

  const handleInterestToggle = (value: string) => {
    if (preferences.interests.includes(value)) {
      setPreferences({
        ...preferences,
        interests: preferences.interests.filter(i => i !== value)
      });
    } else {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, value]
      });
    }
  };

  const generateItinerary = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const { data, error } = await itineraryService.generateSmartItinerary(
        userId,
        preferences,
        userLocation.latitude,
        userLocation.longitude
      );
      
      if (error) throw error;
      
      setGeneratedItinerary(data);
      
      if (data) {
        onItineraryCreated(data);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async () => {
    if (!generatedItinerary) return;
    
    try {
      const { success, error } = await itineraryService.saveItinerary(
        userId,
        generatedItinerary
      );
      
      if (error) throw error;
      
      if (success) {
        // Show success toast
        onItineraryCreated(generatedItinerary);
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      // Show error toast
    }
  };

  const regenerateItinerary = () => {
    setGeneratedItinerary(null);
    generateItinerary();
  };

  return (
    <ScrollView>
      <VStack space="lg" p="md">
        {!generatedItinerary ? (
          <>
            <Text size="xl" fontWeight="bold">Create Smart Itinerary</Text>
            <Text color="gray.600">
              Let AI create a personalized itinerary based on your preferences
            </Text>
            
            <FormControl>
              <FormControl.Label>Itinerary Name</FormControl.Label>
              <Input
                value={preferences.name}
                onChangeText={(value) => setPreferences({...preferences, name: value})}
                placeholder="E.g., Weekend in New York"
              />
            </FormControl>
            
            <HStack space="md" justifyContent="