// WhatToDoAI/mobile/src/navigation/MainNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, MainBottomTabParamList } from './types';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
import MapViewScreen from '../screens/MapViewScreen';
import ItineraryScreen from '../screens/ItineraryScreen';
import ItineraryPlannerScreen from '../screens/ItineraryPlannerScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';

// Create the navigators
const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainBottomTabParamList>();

// Bottom Tab Navigator
const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'ItineraryTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4299E1',
        tabBarInactiveTintColor: '#718096',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{ title: 'Map' }}
      />
      <Tab.Screen
        name="ItineraryTab"
        component={ItineraryScreen}
        options={{ title: 'Itinerary' }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={MainTabs} />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{
          headerShown: true,
          headerTitle: 'Map View',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ItineraryPlanner"
        component={ItineraryPlannerScreen}
        options={{
          headerShown: true,
          headerTitle: 'Plan Itinerary',
          headerBackTitleVisible: false,
        }}
      />
      {/* Add other main screens here */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
