// Add any global setup for tests here
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: {
      enableLatestRenderer: jest.fn(),
    },
    Marker: jest.fn().mockImplementation(() => null),
    Callout: jest.fn().mockImplementation(() => null),
    MapView: jest.fn().mockImplementation(({ children, ...props }) => 
      React.createElement('MapView', props, children)
    ),
  };
});

// Mock Expo icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: jest.fn().mockImplementation(() => <View />),
    MaterialIcons: jest.fn().mockImplementation(() => <View />),
    FontAwesome: jest.fn().mockImplementation(() => <View />),
  };
});

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});
