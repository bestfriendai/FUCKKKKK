// WhatToDoAI/web/src/screens/ItineraryPlannerPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { createItinerary, getItineraryById, updateItinerary } from '../services/itinerary';
import { Activity } from '../types/activity';
import { Itinerary, ItineraryItem } from '../types/itinerary';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0055aa;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }

  &.secondary {
    background-color: white;
    color: #0066cc;
    border: 1px solid #0066cc;

    &:hover {
      background-color: #f5f9ff;
    }
  }

  &.danger {
    background-color: #e53e3e;

    &:hover {
      background-color: #c53030;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const ActivitiesList = styled.div`
  margin-top: 24px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 8px;
  color: #a0aec0;

  &:active {
    cursor: grabbing;
  }
`;

const ActivityImage = styled.div`
  width: 80px;
  height: 60px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  margin-right: 16px;
  flex-shrink: 0;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
`;

const ActivityDetails = styled.div`
  font-size: 14px;
  color: #666;
`;

const ActivityActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 4px;

  &:hover {
    color: #4a5568;
  }

  &.delete:hover {
    color: #e53e3e;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
  margin-top: 24px;
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

const SidebarCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  position: sticky;
  top: 24px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
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
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const SuccessContainer = styled.div`
  background-color: #f0fff4;
  color: #38a169;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const ItineraryPlannerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    is_public: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authState.user) {
      navigate('/signin');
      return;
    }

    if (id) {
      fetchItinerary(id);
    }

    // Check if we have an activity from navigation state
    if (location.state && (location.state as any).activity) {
      const activity = (location.state as any).activity as Activity;
      // Only add the activity if we're not loading an existing itinerary
      // or if we've already loaded the itinerary
      if (!id || !loading) {
        addActivityToItinerary(activity);
        // Clear the location state to prevent adding the activity again on re-renders
        window.history.replaceState({}, document.title);
      }
    }
  }, [id, authState.user, location.state, loading]);

  const fetchItinerary = async (itineraryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getItineraryById(itineraryId);

      if (data) {
        // Format dates for input fields
        const formattedData = {
          ...data,
          start_date: new Date(data.start_date).toISOString().split('T')[0],
          end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : undefined,
        };

        // Ensure items are sorted by order
        if (formattedData.items) {
          formattedData.items = formattedData.items.sort((a, b) => a.order - b.order);
        }

        setItinerary(formattedData);
      } else {
        setError('Itinerary not found');
      }
    } catch (err: any) {
      console.error('Error fetching itinerary:', err);
      setError(err.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setItinerary(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setItinerary(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addActivityToItinerary = (activity: Activity) => {
    // Check if activity is already in the itinerary
    if (itinerary.items?.some(item => item.activity_id === activity.activity_id)) {
      setError('This activity is already in your itinerary');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newItem: Partial<ItineraryItem> = {
      activity_id: activity.activity_id,
      activity,
      order: itinerary.items?.length || 0,
      notes: '',
      start_time: undefined,
      end_time: undefined,
    };

    setItinerary(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem as ItineraryItem],
    }));

    setSuccess('Activity added to itinerary');
    setTimeout(() => setSuccess(null), 3000);
  };

  const removeActivityFromItinerary = (index: number) => {
    setItinerary(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(itinerary.items || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItinerary(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const validateItinerary = () => {
    if (!itinerary.title) {
      setError('Please enter a title for your itinerary');
      return false;
    }

    if (!itinerary.start_date) {
      setError('Please select a start date');
      return false;
    }

    if (itinerary.end_date && new Date(itinerary.end_date) < new Date(itinerary.start_date)) {
      setError('End date cannot be before start date');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!authState.user) {
      navigate('/signin');
      return;
    }

    if (!validateItinerary()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Sort items by order before saving
      const sortedItems = [...(itinerary.items || [])].sort((a, b) => a.order - b.order);
      const itineraryToSave = {
        ...itinerary,
        items: sortedItems
      };

      if (id) {
        // Update existing itinerary
        await updateItinerary(id, itineraryToSave as Itinerary);
        setSuccess('Itinerary updated successfully!');
      } else {
        // Create new itinerary
        const newItinerary = {
          ...itineraryToSave,
          user_id: authState.user.id,
        };

        await createItinerary(newItinerary as Omit<Itinerary, 'itinerary_id' | 'created_at' | 'updated_at'>);
        setSuccess('Itinerary created successfully!');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error saving itinerary:', err);
      setError(err.message || 'Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSearchActivities = () => {
    navigate('/discover');
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading itinerary...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{id ? 'Edit Itinerary' : 'Create New Itinerary'}</Title>
      </Header>

      {error && <ErrorContainer>{error}</ErrorContainer>}
      {success && <SuccessContainer>{success}</SuccessContainer>}

      <ContentGrid>
        <div>
          <FormSection>
            <FormTitle>Itinerary Details</FormTitle>

            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={itinerary.title || ''}
                onChange={handleInputChange}
                placeholder="Enter a title for your itinerary"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={itinerary.description || ''}
                onChange={handleInputChange}
                placeholder="Describe your itinerary"
              />
            </FormGroup>

            <DateInputGroup>
              <FormGroup>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={itinerary.start_date || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={itinerary.end_date || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </DateInputGroup>

            <FormGroup>
              <Label>
                <Input
                  type="checkbox"
                  name="is_public"
                  checked={itinerary.is_public || false}
                  onChange={handleInputChange}
                  style={{ width: 'auto', marginRight: '8px' }}
                />
                Make this itinerary public
              </Label>
            </FormGroup>
          </FormSection>

          <FormSection>
            <FormTitle>Activities</FormTitle>

            <Button className="secondary" onClick={handleSearchActivities}>
              Add Activities
            </Button>

            {itinerary.items && itinerary.items.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="activities">
                  {(provided) => (
                    <ActivitiesList
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {itinerary.items.map((item, index) => (
                        <Draggable
                          key={item.activity_id}
                          draggableId={item.activity_id}
                          index={index}
                        >
                          {(provided) => (
                            <ActivityItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <DragHandle {...provided.dragHandleProps}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 9H16M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </DragHandle>

                              <ActivityImage
                                style={{
                                  backgroundImage: `url(${
                                    item.activity?.image_urls?.[0] ||
                                    'https://via.placeholder.com/80x60?text=No+Image'
                                  })`,
                                }}
                              />

                              <ActivityInfo>
                                <ActivityTitle>
                                  {item.activity?.name || 'Unnamed Activity'}
                                </ActivityTitle>
                                <ActivityDetails>
                                  {item.activity?.venue?.name || 'Unknown Location'}
                                  {item.activity?.start_time && ` • ${new Date(item.activity.start_time).toLocaleDateString()}`}
                                </ActivityDetails>

                                {/* Activity time settings */}
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <div>
                                    <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                                      Start Time
                                    </label>
                                    <Input
                                      type="time"
                                      value={item.start_time ? new Date(item.start_time).toTimeString().slice(0, 5) : ''}
                                      onChange={(e) => {
                                        const newItems = [...(itinerary.items || [])];
                                        const index = newItems.findIndex(i => i.activity_id === item.activity_id);
                                        if (index !== -1) {
                                          const date = new Date(itinerary.start_date);
                                          const [hours, minutes] = e.target.value.split(':');
                                          date.setHours(parseInt(hours), parseInt(minutes));
                                          newItems[index] = {
                                            ...newItems[index],
                                            start_time: date.toISOString()
                                          };
                                          setItinerary(prev => ({ ...prev, items: newItems }));
                                        }
                                      }}
                                      style={{ width: '100px' }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                                      Notes
                                    </label>
                                    <Input
                                      type="text"
                                      placeholder="Add notes"
                                      value={item.notes || ''}
                                      onChange={(e) => {
                                        const newItems = [...(itinerary.items || [])];
                                        const index = newItems.findIndex(i => i.activity_id === item.activity_id);
                                        if (index !== -1) {
                                          newItems[index] = {
                                            ...newItems[index],
                                            notes: e.target.value
                                          };
                                          setItinerary(prev => ({ ...prev, items: newItems }));
                                        }
                                      }}
                                      style={{ width: '200px' }}
                                    />
                                  </div>
                                </div>
                              </ActivityInfo>

                              <ActivityActions>
                                <IconButton
                                  className="delete"
                                  onClick={() => removeActivityFromItinerary(index)}
                                  title="Remove activity"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </IconButton>
                              </ActivityActions>
                            </ActivityItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ActivitiesList>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <EmptyState>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <EmptyStateTitle>No Activities Added Yet</EmptyStateTitle>
                <EmptyStateText>Add activities to your itinerary to get started</EmptyStateText>
                <Button className="secondary" onClick={handleSearchActivities}>
                  Browse Activities
                </Button>
              </EmptyState>
            )}
          </FormSection>

          <ButtonGroup>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : id ? 'Update Itinerary' : 'Create Itinerary'}
            </Button>
            <Button className="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </div>

        <div>
          <SidebarCard>
            <CardTitle>Itinerary Summary</CardTitle>

            <div>
              <p><strong>Duration:</strong> {itinerary.end_date
                ? `${Math.ceil((new Date(itinerary.end_date).getTime() - new Date(itinerary.start_date || '').getTime()) / (1000 * 60 * 60 * 24))} days`
                : '1 day'
              }</p>
              <p><strong>Activities:</strong> {itinerary.items?.length || 0}</p>
              <p><strong>Visibility:</strong> {itinerary.is_public ? 'Public' : 'Private'}</p>

              {itinerary.items && itinerary.items.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <p><strong>Schedule:</strong></p>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>
                    {itinerary.items.map((item, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ color: '#0066cc', marginRight: '8px' }}>{index + 1}.</span>
                          <span>{item.activity?.name}</span>
                        </div>
                        {item.start_time && (
                          <div style={{ marginLeft: '20px', color: '#718096' }}>
                            {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                {itinerary.is_public
                  ? 'Public itineraries can be viewed by anyone. They will appear in search results and can be shared with others.'
                  : 'Private itineraries are only visible to you. They won\'t appear in search results or be accessible to others.'}
              </p>
            </div>
          </SidebarCard>

          <SidebarCard>
            <CardTitle>Tips</CardTitle>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
              <li>Drag and drop activities to reorder them</li>
              <li>Add notes to each activity for your reference</li>
              <li>Set specific times for each activity if needed</li>
              <li>Make your itinerary public to share with friends</li>
            </ul>

            {itinerary.items && itinerary.items.length > 0 && (
              <Button
                className="secondary"
                style={{ marginTop: '16px', width: '100%' }}
                onClick={() => {
                  // Sort items by order
                  const sortedItems = [...itinerary.items].sort((a, b) => a.order - b.order);

                  // Automatically assign times based on start date
                  const startDate = new Date(itinerary.start_date);
                  startDate.setHours(9, 0, 0, 0); // Start at 9 AM

                  const updatedItems = sortedItems.map((item, index) => {
                    const itemStartTime = new Date(startDate);
                    itemStartTime.setHours(itemStartTime.getHours() + index * 2); // 2 hours per activity

                    return {
                      ...item,
                      start_time: itemStartTime.toISOString()
                    };
                  });

                  setItinerary(prev => ({
                    ...prev,
                    items: updatedItems
                  }));

                  setSuccess('Schedule automatically generated!');
                  setTimeout(() => setSuccess(null), 3000);
                }}
              >
                Auto-Schedule Activities
              </Button>
            )}
          </SidebarCard>
        </div>
      </ContentGrid>
    </Container>
  );
};

export default ItineraryPlannerPage;
