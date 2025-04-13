import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Share,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  generateItinerary,
  createItinerary,
  shareItinerary,
  exportItinerary,
  reorderItineraryItems
} from '../services/itinerary';
import { getCategories, searchLocations } from '../services/activities';
import { Activity, Category, Location } from '../types/activity';
import {
  ItineraryPreferences,
  TransportationMode,
  Itinerary,
  ItineraryItem,
  ItineraryExportFormat,
  ItineraryShareOptions
} from '../types/itinerary';
import { MainStackParamList } from '../navigation/types';
import { formatDate, formatTime, formatDuration } from '../utils/formatters';
import { isValidDate, isValidTime } from '../utils/validation';

type ItineraryPlannerScreenRouteProp = RouteProp<MainStackParamList, 'ItineraryPlanner'>;
type ItineraryPlannerScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ItineraryPlanner'>;

const ItineraryPlannerScreen: React.FC = () => {
  const route = useRoute<ItineraryPlannerScreenRouteProp>();
  const navigation = useNavigation<ItineraryPlannerScreenNavigationProp>();
  const selectedActivity = route.params?.selectedActivity;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Form state
  const [title, setTitle] = useState('My Itinerary');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 8 * 60 * 60 * 1000)); // 8 hours later
  const [location, setLocation] = useState(
    selectedActivity
      ? {
          id: selectedActivity.location.id,
          name: selectedActivity.location.name,
          address: selectedActivity.location.address,
          city: selectedActivity.location.city,
          state: selectedActivity.location.state,
          country: selectedActivity.location.country,
          zipCode: selectedActivity.location.zipCode,
          latitude: selectedActivity.location.latitude,
          longitude: selectedActivity.location.longitude,
        }
      : {
          id: '',
          name: '',
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          latitude: 40.7128, // Default to NYC
          longitude: -74.0060,
        }
  );
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    selectedActivity ? selectedActivity.categories.map(cat => cat.id) : []
  );
  const [transportationModes, setTransportationModes] = useState<TransportationMode[]>([
    TransportationMode.WALKING,
    TransportationMode.PUBLIC_TRANSPORT,
  ]);
  const [budget, setBudget] = useState({
    min: 0,
    max: 200,
    currency: 'USD',
  });
  
  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Effects
  useEffect(() => {
    fetchCategories();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  useEffect(() => {
    if (generatedItinerary && generatedItinerary.items) {
      setItineraryItems(generatedItinerary.items);
    }
  }, [generatedItinerary]);
  
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (locationSearchQuery.length > 2 && showLocationModal) {
        searchLocationsByQuery(locationSearchQuery);
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [locationSearchQuery]);

  // Data fetching methods
  const fetchCategories = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const searchLocationsByQuery = async (query: string): Promise<void> => {
    if (query.length < 3) return;
    
    try {
      const locations = await searchLocations(query);
      setLocationSuggestions(locations);
    } catch (error) {
      console.error('Error searching locations:', error);
      // Don't show alert for search errors to avoid disrupting the UX
    }
  };

  // Event handlers
  const handleInterestToggle = (categoryId: string): void => {
    setSelectedInterests(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleTransportationToggle = (mode: TransportationMode): void => {
    setTransportationModes(prev => {
      if (prev.includes(mode)) {
        return prev.filter(m => m !== mode);
      } else {
        return [...prev, mode];
      }
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date): void => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date): void => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };
  
  const handleLocationSelect = (selectedLocation: Location): void => {
    setLocation(selectedLocation);
    setShowLocationModal(false);
    setLocationSuggestions([]);
    setLocationSearchQuery('');
  };
  
  const handleDragEnd = ({ data }: { data: ItineraryItem[] }): void => {
    setItineraryItems(data);
    
    if (generatedItinerary) {
      const updatedItinerary = {
        ...generatedItinerary,
        items: data
      };
      setGeneratedItinerary(updatedItinerary);
    }
  };
  
  const handleShareItinerary = async (): Promise<void> => {
    if (!generatedItinerary) return;
    
    try {
      const shareOptions: ItineraryShareOptions = {
        includeActivities: true,
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      };
      
      const { shareUrl } = await shareItinerary(generatedItinerary.id, shareOptions);
      
      await Share.share({
        message: `Check out my itinerary: ${generatedItinerary.title}`,
        url: shareUrl,
        title: generatedItinerary.title,
      });
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      Alert.alert('Error', 'Failed to share itinerary. Please try again.');
    }
  };
  
  const handleExportItinerary = async (format: ItineraryExportFormat): Promise<void> => {
    if (!generatedItinerary) return;
    
    try {
      setIsLoading(true);
      const result = await exportItinerary(generatedItinerary.id, format);
      
      if ('exportUrl' in result) {
        // Handle URL export
        Alert.alert(
          'Export Successful',
          `Your itinerary has been exported. You can download it from the provided link.`,
          [{ text: 'OK', onPress: () => setShowShareModal(false) }]
        );
      } else {
        // Handle blob export (would need additional handling for file saving)
        Alert.alert(
          'Export Successful',
          `Your itinerary has been exported.`,
          [{ text: 'OK', onPress: () => setShowShareModal(false) }]
        );
      }
    } catch (error) {
      console.error('Error exporting itinerary:', error);
      Alert.alert('Error', 'Failed to export itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation and submission
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an itinerary title');
      return false;
    }

    if (!location.name.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return false;
    }

    if (transportationModes.length === 0) {
      Alert.alert('Error', 'Please select at least one transportation mode');
      return false;
    }

    if (startTime >= endTime) {
      Alert.alert('Error', 'End time must be after start time');
      return false;
    }
    
    if (budget.min > budget.max) {
      Alert.alert('Error', 'Minimum budget cannot be greater than maximum budget');
      return false;
    }

    return true;
  };

  const handleGenerateItinerary = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    try {
      const preferences: ItineraryPreferences = {
        title,
        date: formatDate(date.toISOString(), { year: 'numeric', month: '2-digit', day: '2-digit' }),
        startTime: formatTime(startTime.toTimeString().substring(0, 5)),
        endTime: formatTime(endTime.toTimeString().substring(0, 5)),
        location,
        interests: selectedInterests,
        budget,
        transportationModes,
        maxActivities: 5, // Default to 5 activities
        includeRestaurants: true,
        includeFreeActivities: budget.min === 0,
        accessibilityNeeds: [], // No accessibility needs by default
      };

      const itinerary = await generateItinerary(preferences);
      
      // Animate the transition
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setGeneratedItinerary(itinerary);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      Alert.alert('Error', 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = async (): Promise<void> => {
    if (!generatedItinerary) {
      return;
    }

    setIsLoading(true);

    try {
      // If items were reordered, update the itinerary with the new order
      if (itineraryItems.length > 0 &&
          JSON.stringify(itineraryItems) !== JSON.stringify(generatedItinerary.items)) {
        const itemIds = itineraryItems.map(item => item.id);
        await reorderItineraryItems(generatedItinerary.id, itemIds);
      }
      
      // Create/save the itinerary
      const savedItinerary = await createItinerary({
        ...generatedItinerary,
        items: itineraryItems
      });
      
      Alert.alert(
        'Success',
        'Itinerary saved successfully!',
        [
          {
            text: 'View Itineraries',
            onPress: () => navigation.navigate('Home', { screen: 'Itineraries' }),
          },
          {
            text: 'Share',
            onPress: () => setShowShareModal(true)
          },
          { text: 'Done', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      console.error('Error saving itinerary:', error);
      Alert.alert('Error', 'Failed to save itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rendering methods
  const renderCategoryItem = (category: Category): React.ReactElement => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.interestButton,
        selectedInterests.includes(category.id) && styles.interestButtonSelected,
      ]}
      onPress={() => handleInterestToggle(category.id)}
    >
      <Text
        style={[
          styles.interestButtonText,
          selectedInterests.includes(category.id) && styles.interestButtonTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTransportationItem = (mode: TransportationMode, label: string): React.ReactElement => (
    <TouchableOpacity
      key={mode}
      style={[
        styles.transportButton,
        transportationModes.includes(mode) && styles.transportButtonSelected,
      ]}
      onPress={() => handleTransportationToggle(mode)}
    >
      <Text
        style={[
          styles.transportButtonText,
          transportationModes.includes(mode) && styles.transportButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderLocationItem = ({ item }: { item: Location }): React.ReactElement => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationItemContent}>
        <Text style={styles.locationItemName}>{item.name}</Text>
        <Text style={styles.locationItemAddress}>
          {item.address}, {item.city}, {item.state || ''} {item.zipCode || ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderItineraryItem = ({ item, drag, isActive }: {
    item: ItineraryItem;
    drag: () => void;
    isActive: boolean;
  }): React.ReactElement => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={[
        styles.draggableItem,
        isActive && styles.draggableItemActive
      ]}
    >
      <View style={styles.itineraryItem}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
        </View>
        
        <View style={styles.itemContent}>
          <View style={styles.itemTimeContainer}>
            <Text style={styles.itemTime}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
          
          <View style={styles.itemDetailsContainer}>
            <Text style={styles.itemTitle}>{item.activity.title}</Text>
            <Text style={styles.itemLocation}>{item.activity.location.name}</Text>
            {item.notes && (
              <Text style={styles.itemNotes}>{item.notes}</Text>
            )}
            {item.transportationMode && item.transportationMode !== TransportationMode.NONE && (
              <View style={styles.transportBadge}>
                <Text style={styles.transportBadgeText}>
                  {item.transportationMode.charAt(0).toUpperCase() + item.transportationMode.slice(1)}
                  {item.transportationDuration && ` (${item.transportationDuration} min)`}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.dragHandle}>
          <Ionicons name="menu" size={24} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderShareModal = (): React.ReactElement => (
    <Modal
      visible={showShareModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Itinerary</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowShareModal(false)}
            >
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.shareOptions}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={handleShareItinerary}
            >
              <Ionicons name="share-social" size={32} color="#4A80F0" />
              <Text style={styles.shareOptionText}>Share Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleExportItinerary(ItineraryExportFormat.PDF)}
            >
              <Ionicons name="document-text" size={32} color="#4A80F0" />
              <Text style={styles.shareOptionText}>Export as PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleExportItinerary(ItineraryExportFormat.CALENDAR)}
            >
              <Ionicons name="calendar" size={32} color="#4A80F0" />
              <Text style={styles.shareOptionText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  const renderLocationModal = (): React.ReactElement => (
    <Modal
      visible={showLocationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLocationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Location</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={locationSearchQuery}
              onChangeText={setLocationSearchQuery}
              placeholder="Search for a location..."
              autoFocus
            />
          </View>
          
          {locationSearchQuery.length > 0 && (
            <FlatList
              data={locationSuggestions}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.id}
              style={styles.locationList}
              ListEmptyComponent={
                locationSearchQuery.length > 2 ? (
                  <Text style={styles.emptyListText}>
                    {isLoading ? 'Searching...' : 'No locations found'}
                  </Text>
                ) : (
                  <Text style={styles.emptyListText}>
                    Type at least 3 characters to search
                  </Text>
                )
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Itinerary Planner</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        >
          {!generatedItinerary ? (
            <View style={styles.formContainer}>
              {/* Title */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Itinerary Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter a title for your itinerary"
                />
              </View>
              
              {/* Date */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => {
                    setDatePickerMode('date');
                    setShowDatePicker(true);
                  }}
                >
                  <Text style={styles.dateInputText}>
                    {formatDate(date.toISOString())}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#666666" />
                </TouchableOpacity>
              </View>
              
              {/* Time Range */}
              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Start Time</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setDatePickerMode('time');
                      setShowStartTimePicker(true);
                    }}
                  >
                    <Text style={styles.dateInputText}>
                      {formatTime(startTime.toTimeString().substring(0, 5))}
                    </Text>
                    <Ionicons name="time" size={20} color="#666666" />
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>End Time</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setDatePickerMode('time');
                      setShowEndTimePicker(true);
                    }}
                  >
                    <Text style={styles.dateInputText}>
                      {formatTime(endTime.toTimeString().substring(0, 5))}
                    </Text>
                    <Ionicons name="time" size={20} color="#666666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Location */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TouchableOpacity
                  style={styles.locationInput}
                  onPress={() => setShowLocationModal(true)}
                >
                  <Text style={styles.locationInputText}>
                    {location.name || "Search for a location"}
                  </Text>
                  <Ionicons name="search" size={20} color="#666666" />
                </TouchableOpacity>
              </View>
              
              {/* Interests */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Interests</Text>
                <View style={styles.interestsContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#4A80F0" />
                  ) : (
                    categories.map(renderCategoryItem)
                  )}
                </View>
              </View>
              
              {/* Transportation */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Transportation</Text>
                <View style={styles.transportContainer}>
                  {renderTransportationItem(TransportationMode.WALKING, 'Walking')}
                  {renderTransportationItem(TransportationMode.PUBLIC_TRANSPORT, 'Public Transit')}
                  {renderTransportationItem(TransportationMode.DRIVING, 'Driving')}
                  {renderTransportationItem(TransportationMode.CYCLING, 'Cycling')}
                  {renderTransportationItem(TransportationMode.TAXI, 'Taxi')}
                </View>
              </View>
              
              {/* Budget */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Budget Range</Text>
                <View style={styles.rowContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    value={budget.min.toString()}
                    onChangeText={(text) => setBudget({ ...budget, min: parseInt(text) || 0 })}
                    placeholder="Min"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    value={budget.max.toString()}
                    onChangeText={(text) => setBudget({ ...budget, max: parseInt(text) || 0 })}
                    placeholder="Max"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              {/* Generate Button */}
              <TouchableOpacity
                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                onPress={handleGenerateItinerary}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="flash" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.generateButtonText}>Generate Itinerary</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itineraryContainer}>
              <View style={styles.itineraryHeader}>
                <Text style={styles.itineraryTitle}>{generatedItinerary.title}</Text>
                <Text style={styles.itineraryDate}>
                  {formatDate(generatedItinerary.date)}
                </Text>
                <View style={styles.itineraryLocation}>
                  <Ionicons name="location" size={16} color="#666666" style={{ marginRight: 4 }} />
                  <Text style={styles.itineraryLocationText}>{location.name}</Text>
                </View>
              </View>
              
              <View style={styles.itineraryItems}>
                <DraggableFlatList
                  data={itineraryItems}
                  renderItem={renderItineraryItem}
                  keyExtractor={(item) => item.id}
                  onDragEnd={handleDragEnd}
                  activationDistance={10}
                  containerStyle={{ flex: 1 }}
                />
              </View>
              
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={handleSaveItinerary}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="save" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.saveButtonText}>Save Itinerary</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <View style={styles.secondaryButtonsRow}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.shareButton]}
                    onPress={() => setShowShareModal(true)}
                  >
                    <Ionicons name="share-social" size={20} color="#4A80F0" style={{ marginRight: 4 }} />
                    <Text style={styles.secondaryButtonText}>Share</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.regenerateButton]}
                    onPress={() => setGeneratedItinerary(null)}
                  >
                    <Ionicons name="refresh" size={20} color="#4A80F0" style={{ marginRight: 4 }} />
                    <Text style={styles.secondaryButtonText}>Modify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      
      {/* Modals */}
      {renderLocationModal()}
      {renderShareModal()}
      
      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333333',
  },
  locationInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  locationInputText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  interestButtonSelected: {
    backgroundColor: '#4A80F0',
  },
  interestButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  interestButtonTextSelected: {
    color: '#FFFFFF',
  },
  transportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  transportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  transportButtonSelected: {
    backgroundColor: '#4A80F0',
  },
  transportButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  transportButtonTextSelected: {
    color: '#FFFFFF',
  },
  generateButton: {
    height: 50,
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
    shadowColor: '#4A80F0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  generateButtonDisabled: {
    backgroundColor: '#A0BDF8',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itineraryContainer: {
    width: '100%',
  },
  itineraryHeader: {
    marginBottom: 24,
  },
  itineraryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  itineraryDate: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  itineraryLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itineraryLocationText: {
    fontSize: 14,
    color: '#666666',
  },
  itineraryItems: {
    marginBottom: 24,
    minHeight: 200,
  },
  draggableItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  draggableItemActive: {
    backgroundColor: '#F0F7FF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itineraryItem: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  timelineContainer: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A80F0',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#4A80F0',
    marginTop: 4,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemTimeContainer: {
    marginBottom: 8,
  },
  itemTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A80F0',
  },
  itemDetailsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4A80F0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  itemNotes: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  transportBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  transportBadgeText: {
    fontSize: 12,
    color: '#4A80F0',
  },
  dragHandle: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    marginBottom: 16,
  },
  saveButton: {
    height: 50,
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#4A80F0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0BDF8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    height: 44,
    flex: 1,
    borderWidth: 1,
    borderColor: '#4A80F0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    marginRight: 8,
  },
  regenerateButton: {
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#4A80F0',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalCloseButton: {
    padding: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  locationList: {
    maxHeight: 300,
  },
  locationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  locationItemContent: {
    paddingHorizontal: 8,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  locationItemAddress: {
    fontSize: 14,
    color: '#666666',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 16,
    color: '#666666',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingBottom: 16,
  },
  shareOption: {
    alignItems: 'center',
    padding: 16,
  },
  shareOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333333',
  },
});

export default ItineraryPlannerScreen;