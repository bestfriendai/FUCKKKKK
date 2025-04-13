import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../screens/HomeScreen';
import { searchActivities } from '../../services/activities';

// Mock the activities service
jest.mock('../../services/activities', () => ({
  searchActivities: jest.fn(),
}));

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API response
    (searchActivities as jest.Mock).mockResolvedValue([
      {
        activity_id: '1',
        name: 'Test Activity',
        description: 'Test Description',
        image_urls: ['https://example.com/image.jpg'],
        venue: {
          name: 'Test Venue',
          address: '123 Test St',
        },
        rating: 4.5,
      },
    ]);
  });

  it('renders loading state initially', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation as any} />);
    
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders activities after loading', async () => {
    const { getByText, queryByTestId } = render(<HomeScreen navigation={mockNavigation as any} />);
    
    await waitFor(() => {
      expect(queryByTestId('loading-spinner')).toBeNull();
      expect(getByText('Test Activity')).toBeTruthy();
      expect(getByText('Test Venue')).toBeTruthy();
    });
  });

  it('calls searchActivities with correct parameters', async () => {
    render(<HomeScreen navigation={mockNavigation as any} />);
    
    await waitFor(() => {
      expect(searchActivities).toHaveBeenCalledWith(
        expect.objectContaining({
          location: expect.objectContaining({
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            radius: 10,
          }),
          pageSize: 20,
        })
      );
    });
  });

  it('handles activity press correctly', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);
    
    await waitFor(() => {
      const activityItem = getByText('Test Activity');
      activityItem.props.onPress();
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ActivityDetail', { activityId: '1' });
    });
  });

  it('renders error state when API fails', async () => {
    // Mock API failure
    (searchActivities as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const { getByText, queryByTestId } = render(<HomeScreen navigation={mockNavigation as any} />);
    
    await waitFor(() => {
      expect(queryByTestId('loading-spinner')).toBeNull();
      expect(getByText(/error/i)).toBeTruthy();
    });
  });
});
