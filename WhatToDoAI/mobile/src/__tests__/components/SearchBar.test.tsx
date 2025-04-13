import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const mockOnChangeQuery = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <SearchBar 
        placeholder="Search..." 
        onSearch={mockOnSearch}
        onChangeQuery={mockOnChangeQuery}
      />
    );
    
    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('calls onChangeQuery when text changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar 
        placeholder="Search..." 
        onSearch={mockOnSearch}
        onChangeQuery={mockOnChangeQuery}
      />
    );
    
    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'test query');
    
    expect(mockOnChangeQuery).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch when search button is pressed', () => {
    const { getByTestId } = render(
      <SearchBar 
        placeholder="Search..." 
        onSearch={mockOnSearch}
        onChangeQuery={mockOnChangeQuery}
        initialQuery="test query"
      />
    );
    
    const searchButton = getByTestId('search-button');
    fireEvent.press(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('renders with initial query', () => {
    const { getByDisplayValue } = render(
      <SearchBar 
        placeholder="Search..." 
        onSearch={mockOnSearch}
        onChangeQuery={mockOnChangeQuery}
        initialQuery="initial query"
      />
    );
    
    expect(getByDisplayValue('initial query')).toBeTruthy();
  });
});
