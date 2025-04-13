// WhatToDoAI/web/src/screens/ActivityDiscoveryPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchActivities } from '../services/activities';
import { Activity, ActivitySearchParams } from '../types/activity';
import ActivityCard from '../components/ActivityCard';
import { APP_CONSTANTS } from '../config';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

const FiltersSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #4a5568;
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const CategoryTag = styled.div<{ selected: boolean }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.selected ? '#0066cc' : '#e2e8f0'};
  color: ${props => props.selected ? 'white' : '#4a5568'};

  &:hover {
    background-color: ${props => props.selected ? '#0055aa' : '#cbd5e0'};
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AppliedFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: #e6f0ff;
  border-radius: 16px;
  font-size: 13px;
  color: #0066cc;

  button {
    background: none;
    border: none;
    color: #0066cc;
    margin-left: 6px;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover {
    background-color: #0055aa;
  }

  &.secondary {
    background-color: white;
    color: #0066cc;
    border: 1px solid #0066cc;

    &:hover {
      background-color: #f5f9ff;
    }
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const LoadMoreButton = styled.button`
  display: block;
  width: 200px;
  margin: 32px auto;
  padding: 12px 24px;
  background-color: white;
  color: #0066cc;
  border: 1px solid #0066cc;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f9ff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: #fff5f5;
  border-radius: 8px;
  color: #e53e3e;
  text-align: center;

  h2 {
    margin-bottom: 16px;
  }
`;

const SuccessContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #f0fff4;
  color: #38a169;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px 32px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;

  h2 {
    margin-bottom: 16px;
    color: #4a5568;
  }

  p {
    color: #718096;
    margin-bottom: 24px;
  }
`;

// Predefined categories for filtering
const ACTIVITY_CATEGORIES = [
  { category_id: 'cat-1', name: 'Arts & Culture', icon: '🎭' },
  { category_id: 'cat-2', name: 'Food & Drink', icon: '🍽️' },
  { category_id: 'cat-3', name: 'Outdoors', icon: '🏞️' },
  { category_id: 'cat-4', name: 'Music', icon: '🎵' },
  { category_id: 'cat-5', name: 'Sports', icon: '⚽' },
  { category_id: 'cat-6', name: 'Nightlife', icon: '🌃' },
  { category_id: 'cat-7', name: 'Family-Friendly', icon: '👨‍👩‍👧‍👦' },
  { category_id: 'cat-8', name: 'Tours', icon: '🧭' },
];

const ActivityDiscoveryPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<ActivitySearchParams>({
    location: {
      latitude: APP_CONSTANTS.DEFAULT_LOCATION.latitude,
      longitude: APP_CONSTANTS.DEFAULT_LOCATION.longitude,
      radius: APP_CONSTANTS.DEFAULT_RADIUS,
    },
    page: 1,
    pageSize: APP_CONSTANTS.DEFAULT_PAGE_SIZE,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{startDate?: string, endDate?: string}>({});
  const [hasMore, setHasMore] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  useEffect(() => {
    // Get user's location if available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchParams(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        }));
      },
      (error) => {
        console.warn('Error getting location:', error.message);
        // Continue with default location
      }
    );
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [searchParams.location.latitude, searchParams.location.longitude]);

  const fetchActivities = async (loadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...searchParams,
        page: loadMore ? searchParams.page + 1 : 1,
      };

      const results = await searchActivities(params);

      if (results) {
        if (loadMore) {
          setActivities(prev => [...prev, ...results]);
          setSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
        } else {
          setActivities(results);
          setSearchParams(prev => ({ ...prev, page: 1 }));
        }

        // Check if we have more results to load
        setHasMore(results.length >= (searchParams.pageSize || APP_CONSTANTS.DEFAULT_PAGE_SIZE));
      } else {
        setError('Failed to fetch activities');
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('An error occurred while fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchActivities();
  };

  const handleLoadMore = () => {
    fetchActivities(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'radius') {
      setSearchParams(prev => ({
        ...prev,
        location: {
          ...prev.location,
          radius: parseInt(value) || APP_CONSTANTS.DEFAULT_RADIUS,
        }
      }));
    } else if (name === 'query') {
      setSearchParams(prev => ({
        ...prev,
        query: value,
      }));
    } else if (name === 'sortBy') {
      setSearchParams(prev => ({
        ...prev,
        sortBy: value as any,
      }));
    } else if (name === 'isFree') {
      setSearchParams(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          isFree: value === 'true',
        }
      }));
    } else if (name === 'startDate' || name === 'endDate') {
      setDateRange(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === 'startDate') {
        setSearchParams(prev => ({
          ...prev,
          startDate: value ? new Date(value) : undefined,
        }));
      } else {
        setSearchParams(prev => ({
          ...prev,
          endDate: value ? new Date(value) : undefined,
        }));
      }
    } else if (name === 'minRating') {
      setSearchParams(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          minRating: parseInt(value) || undefined,
        }
      }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const applyFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    }));

    handleSearch();
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDateRange({});
    setSearchParams(prev => ({
      ...prev,
      query: '',
      categories: undefined,
      startDate: undefined,
      endDate: undefined,
      filters: {
        isFree: false,
        minRating: undefined,
      },
      sortBy: 'relevance',
    }));

    // Reset form elements
    const queryInput = document.getElementById('query') as HTMLInputElement;
    if (queryInput) queryInput.value = '';

    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    if (startDateInput) startDateInput.value = '';

    const endDateInput = document.getElementById('endDate') as HTMLInputElement;
    if (endDateInput) endDateInput.value = '';

    handleSearch();
  };

  const addToItinerary = (activity: Activity) => {
    if (!authState.user) {
      navigate('/signin');
      return;
    }

    navigate('/planner', { state: { activity } });
  };

  return (
    <Container>
      <Header>
        <Title>Discover Activities</Title>
        <Subtitle>Find exciting things to do near you</Subtitle>
      </Header>

      {success && (
        <SuccessContainer>
          {success}
          <button onClick={() => setSuccess(null)} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        </SuccessContainer>
      )}

      <FiltersContainer>
        <FiltersSection>
          <FiltersSectionTitle>Search & Sort</FiltersSectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <FilterGroup style={{ flex: '2 1 300px' }}>
              <FilterLabel htmlFor="query">Search</FilterLabel>
              <Input
                type="text"
                id="query"
                name="query"
                placeholder="Keywords..."
                defaultValue={searchParams.query || ''}
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup style={{ flex: '1 1 150px' }}>
              <FilterLabel htmlFor="radius">Distance (km)</FilterLabel>
              <Select
                id="radius"
                name="radius"
                value={searchParams.location.radius || APP_CONSTANTS.DEFAULT_RADIUS}
                onChange={handleFilterChange}
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </Select>
            </FilterGroup>

            <FilterGroup style={{ flex: '1 1 150px' }}>
              <FilterLabel htmlFor="sortBy">Sort By</FilterLabel>
              <Select
                id="sortBy"
                name="sortBy"
                value={searchParams.sortBy || 'relevance'}
                onChange={handleFilterChange}
              >
                <option value="relevance">Relevance</option>
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </Select>
            </FilterGroup>
          </div>
        </FiltersSection>

        <FiltersSection>
          <FiltersSectionTitle>Categories</FiltersSectionTitle>
          <CategoryTags>
            {ACTIVITY_CATEGORIES.map(category => (
              <CategoryTag
                key={category.category_id}
                selected={selectedCategories.includes(category.category_id)}
                onClick={() => handleCategoryToggle(category.category_id)}
              >
                {category.icon} {category.name}
              </CategoryTag>
            ))}
          </CategoryTags>
        </FiltersSection>

        <FiltersSection>
          <FiltersSectionTitle>Additional Filters</FiltersSectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <FilterGroup style={{ flex: '1 1 200px' }}>
              <FilterLabel htmlFor="isFree">Price</FilterLabel>
              <Select
                id="isFree"
                name="isFree"
                value={searchParams.filters?.isFree ? 'true' : 'false'}
                onChange={handleFilterChange}
              >
                <option value="false">All Prices</option>
                <option value="true">Free Only</option>
              </Select>
            </FilterGroup>

            <FilterGroup style={{ flex: '1 1 200px' }}>
              <FilterLabel htmlFor="minRating">Minimum Rating</FilterLabel>
              <Select
                id="minRating"
                name="minRating"
                value={searchParams.filters?.minRating || ''}
                onChange={handleFilterChange}
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </Select>
            </FilterGroup>

            <FilterGroup style={{ flex: '1 1 200px' }}>
              <FilterLabel htmlFor="startDate">Start Date</FilterLabel>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate || ''}
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup style={{ flex: '1 1 200px' }}>
              <FilterLabel htmlFor="endDate">End Date</FilterLabel>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate || ''}
                onChange={handleFilterChange}
              />
            </FilterGroup>
          </div>
        </FiltersSection>

        {/* Applied filters section */}
        {(selectedCategories.length > 0 || searchParams.filters?.isFree || searchParams.filters?.minRating || dateRange.startDate || dateRange.endDate) && (
          <AppliedFilters>
            {selectedCategories.map(catId => {
              const category = ACTIVITY_CATEGORIES.find(c => c.category_id === catId);
              return (
                <FilterBadge key={catId}>
                  {category?.icon} {category?.name}
                  <button onClick={() => handleCategoryToggle(catId)}>✕</button>
                </FilterBadge>
              );
            })}

            {searchParams.filters?.isFree && (
              <FilterBadge>
                Free Only
                <button onClick={() => setSearchParams(prev => ({ ...prev, filters: { ...prev.filters, isFree: false } }))}>✕</button>
              </FilterBadge>
            )}

            {searchParams.filters?.minRating && (
              <FilterBadge>
                {searchParams.filters.minRating}+ Stars
                <button onClick={() => setSearchParams(prev => ({ ...prev, filters: { ...prev.filters, minRating: undefined } }))}>✕</button>
              </FilterBadge>
            )}

            {dateRange.startDate && (
              <FilterBadge>
                From: {new Date(dateRange.startDate).toLocaleDateString()}
                <button onClick={() => {
                  setDateRange(prev => ({ ...prev, startDate: undefined }));
                  setSearchParams(prev => ({ ...prev, startDate: undefined }));
                  const input = document.getElementById('startDate') as HTMLInputElement;
                  if (input) input.value = '';
                }}>✕</button>
              </FilterBadge>
            )}

            {dateRange.endDate && (
              <FilterBadge>
                To: {new Date(dateRange.endDate).toLocaleDateString()}
                <button onClick={() => {
                  setDateRange(prev => ({ ...prev, endDate: undefined }));
                  setSearchParams(prev => ({ ...prev, endDate: undefined }));
                  const input = document.getElementById('endDate') as HTMLInputElement;
                  if (input) input.value = '';
                }}>✕</button>
              </FilterBadge>
            )}
          </AppliedFilters>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Button onClick={applyFilters}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button className="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </FiltersContainer>

      {loading && activities.length === 0 ? (
        <LoadingContainer>
          Loading activities...
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error}</p>
          <Button className="secondary" onClick={handleSearch}>Try Again</Button>
        </ErrorContainer>
      ) : activities.length === 0 ? (
        <NoResultsContainer>
          <h2>No Activities Found</h2>
          <p>Try adjusting your search filters or exploring a different area.</p>
          <Button onClick={handleSearch}>Reset Filters</Button>
        </NoResultsContainer>
      ) : (
        <>
          <ActivitiesGrid>
            {activities.map((activity) => (
              <div key={activity.activity_id} style={{ position: 'relative' }}>
                <ActivityCard
                  activity={activity}
                />
                {authState.user && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToItinerary(activity);
                    setSuccess(`Added ${activity.name} to itinerary`);
                    setTimeout(() => setSuccess(null), 3000);
                  }}
                  title="Add to itinerary"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </ActivitiesGrid>

          {hasMore && (
            <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivityDiscoveryPage;
