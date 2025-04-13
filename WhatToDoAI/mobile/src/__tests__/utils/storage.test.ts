import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  storeData,
  getData,
  removeData,
  clearAllData,
  cacheSearchResults,
  getCachedSearchResults,
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
} from '../../utils/storage';

// Mock the logError function
jest.mock('../../utils/errorHandling', () => ({
  logError: jest.fn(),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeData', () => {
    it('stores data with correct format', async () => {
      const testData = { test: 'value' };
      const testKey = 'test-key';
      
      await storeData(testKey, testData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        testKey,
        expect.stringContaining('"value":"test"')
      );
    });

    it('adds expiry when provided', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000);
      
      const testData = { test: 'value' };
      const testKey = 'test-key';
      const expiryTime = 5000; // 5 seconds
      
      await storeData(testKey, testData, expiryTime);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        testKey,
        expect.stringContaining('"expiry":6000')
      );
    });
  });

  describe('getData', () => {
    it('returns null for non-existent data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const result = await getData('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('returns parsed data for valid items', async () => {
      const mockStoredData = {
        value: { test: 'value' },
        timestamp: 1000,
        expiry: null,
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockStoredData));
      
      const result = await getData('test-key');
      
      expect(result).toEqual({ test: 'value' });
    });

    it('removes expired data and returns null', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 2000);
      
      const mockStoredData = {
        value: { test: 'value' },
        timestamp: 1000,
        expiry: 1500, // Already expired
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockStoredData));
      
      const result = await getData('test-key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(result).toBeNull();
    });
  });

  describe('removeData', () => {
    it('calls AsyncStorage.removeItem with correct key', async () => {
      await removeData('test-key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('clearAllData', () => {
    it('calls AsyncStorage.clear', async () => {
      await clearAllData();
      
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });

  describe('cacheSearchResults and getCachedSearchResults', () => {
    it('stores and retrieves search results with correct cache key', async () => {
      const searchParams = { query: 'test', location: { latitude: 40, longitude: -74 } };
      const results = [{ id: '1', name: 'Test Activity' }];
      
      // Mock storeData implementation for this test
      (AsyncStorage.setItem as jest.Mock).mockImplementation((key, value) => {
        // When getCachedSearchResults is called, return the stored data
        (AsyncStorage.getItem as jest.Mock).mockImplementation((getKey) => {
          if (getKey === key) {
            return Promise.resolve(value);
          }
          return Promise.resolve(null);
        });
      });
      
      await cacheSearchResults(searchParams, results);
      const cachedResults = await getCachedSearchResults(searchParams);
      
      expect(cachedResults).toEqual(results);
    });
  });

  describe('search history functions', () => {
    it('adds search query to history', async () => {
      // Mock empty history initially
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
        value: [],
        timestamp: 1000,
        expiry: null,
      }));
      
      await addToSearchHistory('test query');
      
      // Check that setItem was called with array containing the new query
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'search_history',
        expect.stringContaining('"value":["test query"]')
      );
    });

    it('removes duplicates when adding to search history', async () => {
      // Mock history with existing query
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
        value: ['existing query', 'test query', 'another query'],
        timestamp: 1000,
        expiry: null,
      }));
      
      await addToSearchHistory('test query');
      
      // Check that setItem was called with array containing the query at the beginning
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'search_history',
        expect.stringContaining('"value":["test query","existing query","another query"]')
      );
    });

    it('retrieves search history', async () => {
      const mockHistory = ['query1', 'query2'];
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
        value: mockHistory,
        timestamp: 1000,
        expiry: null,
      }));
      
      const history = await getSearchHistory();
      
      expect(history).toEqual(mockHistory);
    });

    it('clears search history', async () => {
      await clearSearchHistory();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('search_history');
    });
  });
});
