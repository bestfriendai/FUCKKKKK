import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { searchActivities, getCategories } from '../services/activities';
import { Activity, Category, ActivityFilter } from '../types/activity';
import { MainStackParamList } from '../navigation/types';
import ActivityCard from '../components/ActivityCard';
import { getData, storeData, STORAGE_KEYS } from '../utils/storage';

type SearchScreenRouteProp = RouteProp<MainStackParamList, 'Search'>;
type SearchScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const initialCategory = route.params?.category;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>({});

  useEffect(() => {
    fetchCategories();
    loadRecentSearches();
    
    if (initialCategory) {
      handleSearch();
    }
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadRecentSearches = async (): Promise<void> => {
    try {
      const searches = await getData<string[]>(STORAGE_KEYS.RECENT_SEARCHES);
      if (searches) {
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query),
      ].slice(0, 5); // Keep only the 5 most recent searches
      
      await storeData(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSearch = async (): Promise<void> => {
    Keyboard.dismiss();
    setIsLoading(true);
    setIsSearching(true);
    
    try {
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
      }
      
      const searchFilter: ActivityFilter = {
        ...filter,
        searchQuery: searchQuery.trim(),
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      
      const results = await searchActivities(searchQuery, searchFilter);
      setActivities(results);
    } catch (error) {
      console.error('Error searching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string): void => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleRecentSearchPress = (query: string): void => {
    setSearchQuery(query);
    handleSearch();
  };

  const handleClearSearch = (): void => {
    setSearchQuery('');
    setIsSearching(false);
    setActivities([]);
  };

  const handleActivityPress = (activity: Activity): void => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  const toggleFilters = (): void => {
    setShowFilters(!showFilters);
  };

  const updateFilter = (key: keyof ActivityFilter, value: any): void => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderCategoryItem = ({ item }: { item: Category }): React.ReactElement => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategories.includes(item.id) && styles.categoryButtonSelected,
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategories.includes(item.id) && styles.categoryButtonTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentSearchItem = ({ item }: { item: string }): React.ReactElement => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: Activity }): React.ReactElement => (
    <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Implement filters UI here */}
          <Text style={styles.filtersTitle}>Filters</Text>
          {/* Add price range, rating, distance filters */}
        </View>
      )}
      
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
        </View>
      ) : isSearching ? (
        activities.length > 0 ? (
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={renderActivityItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.activitiesList}
          />
        ) : (
          <View style={styles.emptyResultsContainer}>
            <Image
              source={require('../assets/empty-search.png')}
              style={styles.emptyResultsImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyResultsTitle}>No Results Found</Text>
            <Text style={styles.emptyResultsText}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
          </View>
        )
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={renderRecentSearchItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.recentSearchesList}
            />
          ) : (
            <Text style={styles.noRecentSearchesText}>
              Your recent searches will appear here.
            </Text>
          )}
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999999',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filterButtonText: {
    fontSize: 16,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#4A80F0',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesList: {
    padding: 16,
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyResultsImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  emptyResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptyResultsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  recentSearchesContainer: {
    flex: 1,
    padding: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  recentSearchesList: {
    flexGrow: 1,
  },
  recentSearchItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333333',
  },
  noRecentSearchesText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default SearchScreen;