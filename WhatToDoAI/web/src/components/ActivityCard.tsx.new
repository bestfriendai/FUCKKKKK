// WhatToDoAI/web/src/components/ActivityCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  compact?: boolean;
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  height: ${props => props.compact ? '280px' : '360px'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: ${props => props.compact ? '140px' : '200px'};
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const SourceBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: ${props => props.compact ? '16px' : '18px'};
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Location = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isFree ? '#4CAF50' : '#333'};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #FFA000;
  
  svg {
    margin-right: 4px;
  }
`;

const DateInfo = styled.div`
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, compact = false }) => {
  // Format date if available
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get location name
  const locationName = activity.venue?.city || activity.venue?.name || 'Unknown location';
  
  // Get image URL
  const imageUrl = activity.image_urls?.[0] || 
                  activity.imageUrls?.[0] || 
                  'https://via.placeholder.com/400x200?text=No+Image';

  // Get price info
  const priceDisplay = activity.is_free ? 'Free' : activity.price_info || 'Check website';

  return (
    <Card as={Link} to={`/activity/${activity.activity_id}`} onClick={onClick} compact={compact}>
      <ImageContainer compact={compact}>
        <Image src={imageUrl} alt={activity.name} />
        <SourceBadge>{activity.source}</SourceBadge>
      </ImageContainer>
      <Content>
        <Title compact={compact}>{activity.name}</Title>
        {!compact && activity.shortDescription && (
          <Description>{activity.shortDescription}</Description>
        )}
        
        {activity.start_time && (
          <DateInfo>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {formatDate(activity.start_time)}
          </DateInfo>
        )}
        
        <MetaInfo>
          <Location>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13.4299C13.7231 13.4299 15.12 12.0331 15.12 10.3099C15.12 8.58681 13.7231 7.18994 12 7.18994C10.2769 7.18994 8.88 8.58681 8.88 10.3099C8.88 12.0331 10.2769 13.4299 12 13.4299Z" stroke="#666" strokeWidth="1.5"/>
              <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="#666" strokeWidth="1.5"/>
            </svg>
            {locationName}
          </Location>
          
          {activity.average_rating ? (
            <Rating>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFA000"/>
              </svg>
              {activity.average_rating.toFixed(1)}
            </Rating>
          ) : (
            <Price isFree={activity.is_free}>{priceDisplay}</Price>
          )}
        </MetaInfo>
      </Content>
    </Card>
  );
};

export default ActivityCard;
