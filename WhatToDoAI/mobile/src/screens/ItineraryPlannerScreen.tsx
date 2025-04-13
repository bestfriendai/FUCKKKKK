// WhatToDoAI/mobile/src/screens/ItineraryPlannerScreen.tsx

import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Pressable, StyleSheet } from 'react-native'; // Import Pressable, StyleSheet
import {
  YStack, // Replaces Box, VStack, Center
  XStack, // Replaces HStack
  H2, H5, // Replaces Heading
  Text,
  Button,
  Input,
  TextArea,
  Spinner,
  Divider, // Keep Divider if needed, or replace with styled YStack/XStack
} from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Itinerary, ItineraryItem } from '../types/itinerary';
import { Activity } from '../types/activity';
import { createItinerary, updateItinerary, getItineraryById } from '../services/itinerary';
import { Calendar, PlusCircle, Trash2, MapPin, Clock } from 'lucide-react-native'; // Keep icons
import DateTimePicker from '@react-native-community/datetimepicker';

type ItineraryPlannerScreenProps = NativeStackScreenProps<MainStackParamList, 'ItineraryPlanner'>;

const ItineraryPlannerScreen: React.FC<ItineraryPlannerScreenProps> = ({ navigation, route }) => {
  const { itineraryId, activity } = route.params || {};
  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({
    title: '',
    description: '',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    items: [],
    is_public: false,
  });
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (itineraryId) {
      fetchItinerary(itineraryId);
    }
  }, [itineraryId]);

  useEffect(() => {
    if (activity) {
      addActivityToItinerary(activity);
    }
  }, [activity]);

  const fetchItinerary = async (id: string) => {
    setLoading(true);
    try {
      const data = await getItineraryById(id);
      if (data) {
        setItinerary(data);
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      Alert.alert('Error', 'Failed to load itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addActivityToItinerary = (activity: Activity) => {
    const newItem: Partial<ItineraryItem> = {
      activity_id: activity.activity_id,
      activity,
      order: itinerary.items?.length || 0,
    };

    setItinerary(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem as ItineraryItem],
    }));
  };

  const removeActivityFromItinerary = (index: number) => {
    setItinerary(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSaveItinerary = async () => {
    if (!itinerary.title) {
      Alert.alert('Error', 'Please enter a title for your itinerary.');
      return;
    }

    setLoading(true);
    try {
      if (itineraryId) {
        await updateItinerary(itineraryId, itinerary as Itinerary);
        Alert.alert('Success', 'Itinerary updated successfully!');
      } else {
        await createItinerary(itinerary as Omit<Itinerary, 'itinerary_id' | 'created_at' | 'updated_at'>);
        Alert.alert('Success', 'Itinerary created successfully!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      Alert.alert('Error', 'Failed to save itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setItinerary(prev => ({
        ...prev,
        start_date: selectedDate.toISOString(),
      }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setItinerary(prev => ({
        ...prev,
        end_date: selectedDate.toISOString(),
      }));
    }
  };

  if (loading && itineraryId) {
    return (
      // Use YStack with standard props
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
        {/* Use Text with standard props */}
        <Text marginTop="$2">Loading itinerary...</Text>
      </YStack>
    );
  }

  return (
    // Use YStack with standard props
    <YStack flex={1} backgroundColor="$background" paddingTop={40}> {/* Added paddingTop for safe area */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Use H2 with standard props */}
        <H2 marginBottom="$4">
          {itineraryId ? 'Edit Itinerary' : 'Create Itinerary'}
        </H2>

        {/* Use YStack with standard props */}
        <YStack space="$4" marginBottom="$6">
          {/* Form Control replacement */}
          <YStack space="$1">
            <Text>Title</Text>
            <Input
              placeholder="Enter itinerary title"
              value={itinerary.title}
              onChangeText={(text) => setItinerary(prev => ({ ...prev, title: text }))}
            />
          </YStack>

          {/* Form Control replacement */}
          <YStack space="$1">
            <Text>Description</Text>
            <TextArea
              placeholder="Enter description"
              value={itinerary.description}
              onChangeText={(text) => setItinerary(prev => ({ ...prev, description: text }))}
            />
          </YStack>

          {/* Use XStack with standard props */}
          <XStack space="$4" justifyContent="space-between">
            {/* Form Control replacement */}
            <YStack flex={1} space="$1">
              <Text>Start Date</Text>
              <Pressable onPress={() => setShowStartDatePicker(true)}>
                {/* Use XStack with standard props */}
                <XStack
                  borderWidth={1}
                  borderColor="$borderColor" // Use theme token if available, else string
                  borderRadius={8} // Use number
                  padding="$3"
                  alignItems="center"
                  space="$2" // Add space between icon and text
                >
                  <Calendar size={16} color="grey" /> {/* Direct icon usage */}
                  <Text>
                    {new Date(itinerary.start_date || Date.now()).toLocaleDateString()}
                  </Text>
                </XStack>
              </Pressable>
            </YStack>

            {/* Form Control replacement */}
            <YStack flex={1} space="$1">
              <Text>End Date</Text>
              <Pressable onPress={() => setShowEndDatePicker(true)}>
                 {/* Use XStack with standard props */}
                <XStack
                  borderWidth={1}
                  borderColor="$borderColor" // Use theme token if available, else string
                  borderRadius={8} // Use number
                  padding="$3"
                  alignItems="center"
                  space="$2" // Add space between icon and text
                >
                  <Calendar size={16} color="grey" /> {/* Direct icon usage */}
                  <Text>
                    {new Date(itinerary.end_date || Date.now()).toLocaleDateString()}
                  </Text>
                </XStack>
              </Pressable>
            </YStack>
          </XStack>
        </YStack>

        {/* Use H5 with standard props */}
        <H5 marginBottom="$2">Activities</H5>

        {itinerary.items && itinerary.items.length > 0 ? (
          // Use YStack with standard props
          <YStack space="$3" marginBottom="$4">
            {itinerary.items.map((item, index) => (
              // Use YStack with standard props
              <YStack
                key={index}
                borderWidth={1}
                borderColor="$borderColor" // Use theme token if available, else string
                borderRadius={8} // Use number
                padding="$3"
              >
                {/* Use XStack with standard props */}
                <XStack justifyContent="space-between" alignItems="center">
                  {/* Use YStack with standard props */}
                  <YStack flex={1} space="$1">
                    <Text fontWeight="bold">{item.activity?.name || 'Unnamed Activity'}</Text>
                    {item.activity?.venue && (
                      // Use XStack with standard props
                      <XStack alignItems="center" space="$1">
                        <MapPin size={12} color="grey" /> {/* Direct icon usage */}
                        {/* Use Text with standard props */}
                        <Text fontSize={12} color="grey">
                          {item.activity.venue.name || 'Unknown Location'}
                        </Text>
                      </XStack>
                    )}
                    {item.start_time && (
                       // Use XStack with standard props
                      <XStack alignItems="center" space="$1">
                        <Clock size={12} color="grey" /> {/* Direct icon usage */}
                         {/* Use Text with standard props */}
                        <Text fontSize={12} color="grey">
                          {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                  <Pressable onPress={() => removeActivityFromItinerary(index)}>
                    <Trash2 color="red" size={18} /> {/* Direct icon usage */}
                  </Pressable>
                </XStack>
              </YStack>
            ))}
          </YStack>
        ) : (
          // Use YStack with standard props
          <YStack
            borderWidth={1}
            borderColor="$borderColor" // Use theme token if available, else string
            borderRadius={8} // Use number
            padding="$4"
            marginBottom="$4"
            alignItems="center"
            space="$2" // Add space
          >
            {/* Use Text with standard props */}
            <Text color="grey">No activities added yet</Text>
            <Button
              variant="outlined" // Use correct variant name
              onPress={() => navigation.navigate('Search', {})}
              size="$3" // Use theme token if available, else number
              icon={<PlusCircle size={12} />} // Use icon prop
            >
              Add Activities
            </Button>
          </YStack>
        )}

        <Button
          onPress={handleSaveItinerary}
          marginBottom="$4"
          disabled={loading}
          theme="blue" // Use theme prop
        >
          {loading ? <Spinner color="white" /> : <Text>{itineraryId ? 'Update Itinerary' : 'Create Itinerary'}</Text>}
        </Button>
      </ScrollView>

      {showStartDatePicker && (
        <DateTimePicker
          value={new Date(itinerary.start_date || Date.now())}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={new Date(itinerary.end_date || Date.now())}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </YStack>
  );
};

// Minimal StyleSheet needed now
const styles = StyleSheet.create({});

export default ItineraryPlannerScreen;
