// WhatToDoAI/web/src/screens/ActivityDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getActivityDetails } from '../services/activities';
import { Activity } from '../types/activity';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 0;
  
  &:hover {
    color: #0066cc;
  }
  
  svg {
    margin-right: 8px;
  }
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

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 200px 200px;
  gap: 16px;
  margin-bottom: 32px;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 300px;
  }
`;

const MainImage = styled.div`
  grid-row: span 2;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    grid-row: span 1;
  }
`;

const SmallImage = styled.div`
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const MoreImagesOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  white-space: pre-line;
`;

const SidebarCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background-color 0.2s;
  
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

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  display: flex;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  width: 120px;
  color: #666;
`;

const InfoValue = styled.span`
  flex: 1;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  background-color: #f0f4f8;
  color: #4a5568;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #e53e3e;
  text-align: center;
  
  h2 {
    margin-bottom: 16px;
  }
`;

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  
  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!id) {
        setError('Activity ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        // Extract source from the composite ID (e.g., "eventbrite-123456")
        const [source, actualId] = id.split('-', 2);
        
        const activityData = await getActivityDetails(id, source as any);
        
        if (activityData) {
          setActivity(activityData);
        } else {
          setError('Activity not found');
        }
      } catch (err) {
        console.error('Error fetching activity details:', err);
        setError('Failed to load activity details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityDetails();
  }, [id]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleBookNow = () => {
    if (activity?.bookingUrl || activity?.activity_url) {
      window.open(activity.bookingUrl || activity.activity_url, '_blank');
    }
  };
  
  const handleAddToItinerary = () => {
    navigate('/planner', { state: { activity } });
  };
  
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          Loading activity details...
        </LoadingContainer>
      </Container>
    );
  }
  
  if (error || !activity) {
    return (
      <Container>
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error || 'Activity not found'}</p>
          <BackButton onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go Back
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }
  
  // Prepare images for gallery
  const images = activity.image_urls || activity.imageUrls || [];
  const mainImage = images[0] || 'https://via.placeholder.com/800x600?text=No+Image';
  const galleryImages = images.slice(1, 5);
  const hasMoreImages = images.length > 5;
  
  return (
    <Container>
      <BackButton onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </BackButton>
      
      <Header>
        <Title>{activity.name}</Title>
        
        <MetaInfo>
          {activity.venue && (
            <MetaItem>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.4299C13.7231 13.4299 15.12 12.0331 15.12 10.3099C15.12 8.58681 13.7231 7.18994 12 7.18994C10.2769 7.18994 8.88 8.58681 8.88 10.3099C8.88 12.0331 10.2769 13.4299 12 13.4299Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {activity.venue.name}
              {activity.venue.city && `, ${activity.venue.city}`}
              {activity.venue.country && `, ${activity.venue.country}`}
            </MetaItem>
          )}
          
          {activity.start_time && (
            <MetaItem>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {formatDate(activity.start_time)}
            </MetaItem>
          )}
          
          {activity.average_rating && (
            <MetaItem>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFA000" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {activity.average_rating.toFixed(1)}
              {activity.review_count && ` (${activity.review_count} reviews)`}
            </MetaItem>
          )}
          
          <MetaItem>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8.5H14.5M6 16.5H8M10.5 16.5H14.5M22 14.5V8.5C22 5.78 22 4.42 21.21 3.5C20.42 2.58 19.27 2.5 17 2.5H7C4.73 2.5 3.58 2.58 2.79 3.5C2 4.42 2 5.78 2 8.5V14.5C2 18.09 2 19.89 3.25 20.94C4.5 22 6.3 22 10 22H14C17.7 22 19.5 22 20.75 20.94C22 19.89 22 18.09 22 14.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {activity.source}
          </MetaItem>
        </MetaInfo>
      </Header>
      
      {images.length > 0 && (
        <ImageGallery>
          <MainImage style={{ backgroundImage: `url(${mainImage})` }} />
          
          {galleryImages.map((image, index) => (
            <SmallImage 
              key={index} 
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          
          {hasMoreImages && (
            <SmallImage as={MoreImagesOverlay}>
              +{images.length - 5} more
            </SmallImage>
          )}
        </ImageGallery>
      )}
      
      <ContentGrid>
        <div>
          <Section>
            <SectionTitle>About</SectionTitle>
            <Description>
              {activity.description || 'No description available.'}
            </Description>
            
            {activity.tags && activity.tags.length > 0 && (
              <TagsContainer>
                {activity.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
            )}
          </Section>
          
          {activity.aiSummary && (
            <Section>
              <SectionTitle>AI Insights</SectionTitle>
              <Description>
                {activity.aiSummary.overview}
              </Description>
              
              {activity.aiSummary.highlights && (
                <>
                  <h4>Highlights</h4>
                  <ul>
                    {activity.aiSummary.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {activity.aiSummary.tips && (
                <>
                  <h4>Tips</h4>
                  <ul>
                    {activity.aiSummary.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </>
              )}
            </Section>
          )}
        </div>
        
        <div>
          <SidebarCard>
            <CardTitle>Booking Information</CardTitle>
            
            {(activity.bookingUrl || activity.activity_url) && (
              <Button onClick={handleBookNow}>
                Book Now
              </Button>
            )}
            
            {authState.user && (
              <Button className="secondary" onClick={handleAddToItinerary}>
                Add to Itinerary
              </Button>
            )}
            
            <InfoList>
              {activity.price_info && (
                <InfoItem>
                  <InfoLabel>Price:</InfoLabel>
                  <InfoValue>{activity.is_free ? 'Free' : activity.price_info}</InfoValue>
                </InfoItem>
              )}
              
              {activity.start_time && (
                <InfoItem>
                  <InfoLabel>Date:</InfoLabel>
                  <InfoValue>{formatDate(activity.start_time)}</InfoValue>
                </InfoItem>
              )}
              
              {activity.organizer_name && (
                <InfoItem>
                  <InfoLabel>Organizer:</InfoLabel>
                  <InfoValue>{activity.organizer_name}</InfoValue>
                </InfoItem>
              )}
            </InfoList>
          </SidebarCard>
          
          {activity.venue && (
            <SidebarCard>
              <CardTitle>Location</CardTitle>
              
              <InfoList>
                <InfoItem>
                  <InfoLabel>Venue:</InfoLabel>
                  <InfoValue>{activity.venue.name}</InfoValue>
                </InfoItem>
                
                {activity.venue.address && (
                  <InfoItem>
                    <InfoLabel>Address:</InfoLabel>
                    <InfoValue>{activity.venue.address}</InfoValue>
                  </InfoItem>
                )}
                
                {activity.venue.city && (
                  <InfoItem>
                    <InfoLabel>City:</InfoLabel>
                    <InfoValue>
                      {activity.venue.city}
                      {activity.venue.state && `, ${activity.venue.state}`}
                    </InfoValue>
                  </InfoItem>
                )}
                
                {activity.venue.country && (
                  <InfoItem>
                    <InfoLabel>Country:</InfoLabel>
                    <InfoValue>{activity.venue.country}</InfoValue>
                  </InfoItem>
                )}
              </InfoList>
              
              {/* Map placeholder - would integrate with Google Maps */}
              <div 
                style={{ 
                  height: '200px', 
                  backgroundColor: '#f0f4f8', 
                  borderRadius: '4px',
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#666'
                }}
              >
                Map View
              </div>
            </SidebarCard>
          )}
        </div>
      </ContentGrid>
    </Container>
  );
};

export default ActivityDetailPage;
