// WhatToDoAI/web/src/screens/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { searchActivities } from '../services/activities';
import { getUserItineraries } from '../services/itinerary';
import { Activity } from '../types/activity';
import { Itinerary } from '../types/itinerary';
import ActivityCard from '../components/ActivityCard';
import { APP_CONSTANTS } from '../config';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #333;
`;

const ActionButton = styled(Link)`
  padding: 10px 16px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    background-color: #0055aa;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const ViewAllLink = styled(Link)`
  font-size: 14px;
  color: #0066cc;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const ItineraryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  text-decoration: none;
  color: inherit;
  height: 280px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ItineraryImage = styled.div`
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ItineraryContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ItineraryTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ItineraryDetails = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const ItineraryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 13px;
  color: #666;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background-color: #f0f4f8;
  color: #4a5568;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: #4a5568;
`;

const EmptyStateText = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 0 0 24px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DashboardPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingItineraries, setLoadingItineraries] = useState(true);
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authState.user) {
      navigate('/signin');
      return;
    }
    
    fetchRecommendedActivities();
    fetchUserItineraries();
  }, [authState.user]);
  
  const fetchRecommendedActivities = async () => {
    setLoadingActivities(true);
    
    try {
      // Get user's location if available
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const params = {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              radius: APP_CONSTANTS.DEFAULT_RADIUS,
            },
            pageSize: 6,
          };
          
          const results = await searchActivities(params);
          
          if (results) {
            setActivities(results);
          }
          setLoadingActivities(false);
        },
        async (error) => {
          console.warn('Error getting location:', error.message);
          // Continue with default location
          const params = {
            location: {
              latitude: APP_CONSTANTS.DEFAULT_LOCATION.latitude,
              longitude: APP_CONSTANTS.DEFAULT_LOCATION.longitude,
              radius: APP_CONSTANTS.DEFAULT_RADIUS,
            },
            pageSize: 6,
          };
          
          const results = await searchActivities(params);
          
          if (results) {
            setActivities(results);
          }
          setLoadingActivities(false);
        }
      );
    } catch (error) {
      console.error('Error fetching recommended activities:', error);
      setLoadingActivities(false);
    }
  };
  
  const fetchUserItineraries = async () => {
    if (!authState.user) return;
    
    setLoadingItineraries(true);
    
    try {
      const results = await getUserItineraries(authState.user.id);
      setItineraries(results);
    } catch (error) {
      console.error('Error fetching user itineraries:', error);
    } finally {
      setLoadingItineraries(false);
    }
  };
  
  const getItineraryImage = (itinerary: Itinerary) => {
    if (itinerary.cover_image_url) {
      return itinerary.cover_image_url;
    }
    
    // Try to get an image from the first activity
    if (itinerary.items && itinerary.items.length > 0 && itinerary.items[0].activity) {
      const activity = itinerary.items[0].activity;
      if (activity.image_urls && activity.image_urls.length > 0) {
        return activity.image_urls[0];
      }
    }
    
    // Default image
    return 'https://source.unsplash.com/random/400x200/?travel';
  };
  
  return (
    <Container>
      <Header>
        <WelcomeSection>
          <Title>
            Welcome, {authState.profile?.username || authState.user?.email?.split('@')[0] || 'Explorer'}
          </Title>
          <ActionButton to="/planner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Itinerary
          </ActionButton>
        </WelcomeSection>
      </Header>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Your Itineraries</SectionTitle>
          <ViewAllLink to="/itineraries">View All</ViewAllLink>
        </SectionHeader>
        
        {loadingItineraries ? (
          <LoadingContainer>Loading your itineraries...</LoadingContainer>
        ) : itineraries.length === 0 ? (
          <EmptyState>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <EmptyStateTitle>No Itineraries Yet</EmptyStateTitle>
            <EmptyStateText>Create your first itinerary to start planning your adventures</EmptyStateText>
            <ActionButton to="/planner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Itinerary
            </ActionButton>
          </EmptyState>
        ) : (
          <Grid>
            {itineraries.slice(0, 3).map((itinerary) => (
              <ItineraryCard key={itinerary.itinerary_id} to={`/itinerary/${itinerary.itinerary_id}`}>
                <ItineraryImage style={{ backgroundImage: `url(${getItineraryImage(itinerary)})` }} />
                <ItineraryContent>
                  <ItineraryTitle>{itinerary.title}</ItineraryTitle>
                  <ItineraryDetails>
                    {formatDate(itinerary.start_date)}
                    {itinerary.end_date && ` - ${formatDate(itinerary.end_date)}`}
                  </ItineraryDetails>
                  {itinerary.tags && itinerary.tags.length > 0 && (
                    <TagsContainer>
                      {itinerary.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                      {itinerary.tags.length > 3 && <Tag>+{itinerary.tags.length - 3}</Tag>}
                    </TagsContainer>
                  )}
                  <ItineraryMeta>
                    <span>{itinerary.items?.length || 0} activities</span>
                    <span>{itinerary.is_public ? 'Public' : 'Private'}</span>
                  </ItineraryMeta>
                </ItineraryContent>
              </ItineraryCard>
            ))}
          </Grid>
        )}
      </Section>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Recommended For You</SectionTitle>
          <ViewAllLink to="/discover">View All</ViewAllLink>
        </SectionHeader>
        
        {loadingActivities ? (
          <LoadingContainer>Loading recommendations...</LoadingContainer>
        ) : activities.length === 0 ? (
          <EmptyState>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <EmptyStateTitle>No Recommendations Yet</EmptyStateTitle>
            <EmptyStateText>We're working on finding the perfect activities for you</EmptyStateText>
            <ActionButton to="/discover">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Discover Activities
            </ActionButton>
          </EmptyState>
        ) : (
          <Grid>
            {activities.slice(0, 6).map((activity) => (
              <ActivityCard key={activity.activity_id} activity={activity} compact />
            ))}
          </Grid>
        )}
      </Section>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Explore</SectionTitle>
        </SectionHeader>
        
        <Grid>
          <ActionButton to="/discover" style={{ height: '100px', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Discover Activities
          </ActionButton>
          
          <ActionButton to="/map" style={{ height: '100px', justifyContent: 'center', backgroundColor: '#38A169' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 20L3.55 17.78C3.21 17.61 3 17.28 3 16.91V5.09C3 4.47 3.64 4.06 4.21 4.32L9 6.5M9 20L15 17M9 20V6.5M15 17L20.45 19.22C20.79 19.39 21 19.72 21 20.09V8.27C21 7.65 20.36 7.24 19.79 7.5L15 9.5M15 17V9.5M15 9.5L9 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore Map
          </ActionButton>
          
          <ActionButton to="/planner" style={{ height: '100px', justifyContent: 'center', backgroundColor: '#805AD5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Plan Itinerary
          </ActionButton>
        </Grid>
      </Section>
    </Container>
  );
};

export default DashboardPage;
