// WhatToDoAI/web/src/screens/MapViewPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { searchActivities } from '../services/activities';
import { Activity } from '../types/activity';
import { APP_CONSTANTS } from '../config';
import { useAuth } from '../contexts/AuthContext';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Styled components
const Container = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  position: relative;
`;

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;
  z-index: 1;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '350px' : '0'};
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: width 0.3s ease;
  z-index: 2;
`;

const SidebarToggle = styled.button`
  position: absolute;
  top: 20px;
  right: ${props => props.theme.isOpen ? '360px' : '20px'};
  z-index: 3;
  background-color: white;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 8px;
  cursor: pointer;
  transition: right 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActivityList = styled.div`
  padding: 16px;
`;

const ActivityItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const ActivityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const ActivityAddress = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-size: 18px;
  color: #333;
`;

const FilterBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 3;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 12px;
  display: flex;
  gap: 12px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
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

// Map center update component
const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const MapViewPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    APP_CONSTANTS.DEFAULT_LOCATION.latitude,
    APP_CONSTANTS.DEFAULT_LOCATION.longitude
  ]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [radius, setRadius] = useState(APP_CONSTANTS.DEFAULT_RADIUS);
  const [category, setCategory] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { state: authState } = useAuth();
  
  useEffect(() => {
    // Get user's location if available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.warn('Error getting location:', error.message);
        // Continue with default location
      }
    );
    
    // Check if we have an activity from the location state
    if (location.state && location.state.activity) {
      const activity = location.state.activity as Activity;
      if (activity.venue?.latitude && activity.venue?.longitude) {
        setMapCenter([activity.venue.latitude, activity.venue.longitude]);
        setSelectedActivity(activity);
      }
    }
  }, [location.state]);
  
  useEffect(() => {
    fetchActivities();
  }, [mapCenter, radius, category]);
  
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        location: {
          latitude: mapCenter[0],
          longitude: mapCenter[1],
          radius: radius,
        },
        categories: category ? [category] : undefined,
        pageSize: 50,
      };
      
      const results = await searchActivities(params);
      
      if (results) {
        // Filter activities that have coordinates
        const activitiesWithCoordinates = results.filter(activity => 
          (activity.venue?.latitude && activity.venue?.longitude) || 
          (activity.latitude && activity.longitude)
        );
        setActivities(activitiesWithCoordinates);
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
  
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    
    // Set map center to activity location
    if (activity.venue?.latitude && activity.venue?.longitude) {
      setMapCenter([activity.venue.latitude, activity.venue.longitude]);
    } else if (activity.latitude && activity.longitude) {
      setMapCenter([activity.latitude, activity.longitude]);
    }
  };
  
  const handleMarkerClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setSidebarOpen(true);
  };
  
  const handleViewDetails = (activity: Activity) => {
    navigate(`/activity/${activity.activity_id}`);
  };
  
  const handleAddToItinerary = (activity: Activity) => {
    if (!authState.user) {
      navigate('/signin');
      return;
    }
    
    navigate('/planner', { state: { activity } });
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Container>
      <MapWrapper>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapCenterUpdater center={mapCenter} />
          
          {activities.map((activity) => {
            // Use venue coordinates if available, otherwise use activity coordinates
            const latitude = activity.venue?.latitude || activity.latitude;
            const longitude = activity.venue?.longitude || activity.longitude;
            
            // Skip if no coordinates
            if (!latitude || !longitude) return null;
            
            return (
              <Marker 
                key={activity.activity_id}
                position={[latitude, longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(activity),
                }}
              >
                <Popup>
                  <div>
                    <h3>{activity.name}</h3>
                    {activity.venue && (
                      <p>{activity.venue.name}</p>
                    )}
                    <button onClick={() => handleViewDetails(activity)}>View Details</button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        <FilterBar>
          <FilterSelect 
            value={radius} 
            onChange={(e) => setRadius(parseInt(e.target.value))}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
          </FilterSelect>
          
          <FilterSelect 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="cat-1">Arts & Culture</option>
            <option value="cat-2">Food & Drink</option>
            <option value="cat-3">Outdoors</option>
            <option value="cat-4">Music</option>
            <option value="cat-5">Sports</option>
            <option value="cat-6">Nightlife</option>
            <option value="cat-7">Family-Friendly</option>
            <option value="cat-8">Tours</option>
          </FilterSelect>
          
          <Button onClick={fetchActivities}>
            Refresh
          </Button>
        </FilterBar>
      </MapWrapper>
      
      <SidebarToggle 
        onClick={toggleSidebar}
        theme={{ isOpen: sidebarOpen }}
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </SidebarToggle>
      
      <Sidebar isOpen={sidebarOpen}>
        <ActivityList>
          <h2 style={{ padding: '0 16px' }}>Activities Near You</h2>
          
          {selectedActivity && (
            <div style={{ padding: '16px', borderBottom: '2px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ marginTop: 0 }}>Selected Activity</h3>
              <ActivityTitle>{selectedActivity.name}</ActivityTitle>
              {selectedActivity.venue && (
                <ActivityAddress>
                  {selectedActivity.venue.name}
                  {selectedActivity.venue.address && `, ${selectedActivity.venue.address}`}
                </ActivityAddress>
              )}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <Button onClick={() => handleViewDetails(selectedActivity)}>
                  View Details
                </Button>
                {authState.user && (
                  <Button className="secondary" onClick={() => handleAddToItinerary(selectedActivity)}>
                    Add to Itinerary
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {activities.length === 0 ? (
            <p style={{ padding: '0 16px' }}>No activities found in this area.</p>
          ) : (
            activities.map((activity) => (
              <ActivityItem 
                key={activity.activity_id}
                onClick={() => handleActivityClick(activity)}
                style={{
                  backgroundColor: selectedActivity?.activity_id === activity.activity_id ? '#f0f9ff' : 'transparent',
                  borderLeft: selectedActivity?.activity_id === activity.activity_id ? '4px solid #0066cc' : 'none',
                }}
              >
                <ActivityTitle>{activity.name}</ActivityTitle>
                {activity.venue && (
                  <ActivityAddress>
                    {activity.venue.name}
                    {activity.venue.address && `, ${activity.venue.address}`}
                  </ActivityAddress>
                )}
              </ActivityItem>
            ))
          )}
        </ActivityList>
      </Sidebar>
      
      {loading && (
        <LoadingOverlay>
          Loading activities...
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default MapViewPage;
