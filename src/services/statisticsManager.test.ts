import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  UserStatistics,
  DEFAULT_STATISTICS,
  STORAGE_KEY,
  loadStatistics,
  saveStatistics,
  checkDailyReset,
  updateAfterBurn,
} from './statisticsManager';

describe('Statistics Manager - Unit Tests', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Create a mock localStorage
    localStorageMock = {};
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadStatistics', () => {
    it('should return default statistics when localStorage is empty', () => {
      const stats = loadStatistics();
      expect(stats).toEqual(DEFAULT_STATISTICS);
    });

    it('should load statistics from localStorage', () => {
      const testStats: UserStatistics = {
        totalBurned: 1000,
        todayBurned: 500,
        totalClicks: 10,
        lastBurnTimestamp: Date.now(),
        lastResetDate: '2026-01-25',
      };
      
      localStorageMock[STORAGE_KEY] = JSON.stringify(testStats);
      
      const loaded = loadStatistics();
      expect(loaded).toEqual(testStats);
    });

    it('should return defaults on parse error', () => {
      localStorageMock[STORAGE_KEY] = 'invalid json';
      
      const stats = loadStatistics();
      expect(stats).toEqual(DEFAULT_STATISTICS);
    });

    it('should return defaults when data is invalid', () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify({ invalid: 'data' });
      
      const stats = loadStatistics();
      expect(stats).toEqual(DEFAULT_STATISTICS);
    });
  });

  describe('saveStatistics', () => {
    it('should save statistics to localStorage', () => {
      const testStats: UserStatistics = {
        totalBurned: 2000,
        todayBurned: 1000,
        totalClicks: 20,
        lastBurnTimestamp: Date.now(),
        lastResetDate: '2026-01-25',
      };
      
      saveStatistics(testStats);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(testStats)
      );
      expect(localStorageMock[STORAGE_KEY]).toBe(JSON.stringify(testStats));
    });
  });

  describe('checkDailyReset', () => {
    it('should reset todayBurned when date changes', () => {
      const oldDate = '2026-01-24';
      const stats: UserStatistics = {
        totalBurned: 5000,
        todayBurned: 1000,
        totalClicks: 50,
        lastBurnTimestamp: Date.now(),
        lastResetDate: oldDate,
      };
      
      const result = checkDailyReset(stats);
      
      expect(result.todayBurned).toBe(0);
      expect(result.lastResetDate).not.toBe(oldDate);
      expect(result.totalBurned).toBe(5000);
      expect(result.totalClicks).toBe(50);
    });

    it('should not reset when date is same', () => {
      const currentDate = new Date().toISOString().split('T')[0];
      const stats: UserStatistics = {
        totalBurned: 5000,
        todayBurned: 1000,
        totalClicks: 50,
        lastBurnTimestamp: Date.now(),
        lastResetDate: currentDate,
      };
      
      const result = checkDailyReset(stats);
      
      expect(result).toEqual(stats);
    });
  });

  describe('updateAfterBurn', () => {
    it('should update all statistics correctly', () => {
      const initialStats: UserStatistics = {
        totalBurned: 1000,
        todayBurned: 500,
        totalClicks: 10,
        lastBurnTimestamp: 1000000,
        lastResetDate: new Date().toISOString().split('T')[0],
      };
      
      localStorageMock[STORAGE_KEY] = JSON.stringify(initialStats);
      
      const burnAmount = 250;
      const result = updateAfterBurn(burnAmount);
      
      expect(result.totalBurned).toBe(1250);
      expect(result.todayBurned).toBe(750);
      expect(result.totalClicks).toBe(11);
      expect(result.lastBurnTimestamp).toBeGreaterThan(initialStats.lastBurnTimestamp);
    });
  });
});

describe('Statistics Manager - Property-Based Tests', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: solana-devnet-integration, Property 1: Statistics localStorage Round-Trip
  it('Property 1: Statistics localStorage Round-Trip - **Validates: Requirements 4.1, 4.2, 4.4, 4.5, 4.7**', () => {
    // Arbitrary for generating UserStatistics
    const userStatisticsArbitrary = fc.record({
      totalBurned: fc.nat(),
      todayBurned: fc.nat(),
      totalClicks: fc.nat(),
      lastBurnTimestamp: fc.nat(),
      lastResetDate: fc.date().map(d => d.toISOString().split('T')[0]),
    });

    fc.assert(
      fc.property(userStatisticsArbitrary, (stats) => {
        // Save to localStorage
        saveStatistics(stats);
        
        // Load back from localStorage
        const loaded = loadStatistics();
        
        // Verify all fields are preserved
        expect(loaded.totalBurned).toBe(stats.totalBurned);
        expect(loaded.todayBurned).toBe(stats.todayBurned);
        expect(loaded.totalClicks).toBe(stats.totalClicks);
        expect(loaded.lastBurnTimestamp).toBe(stats.lastBurnTimestamp);
        expect(loaded.lastResetDate).toBe(stats.lastResetDate);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: solana-devnet-integration, Property 2: Statistics Update After Burn
  it('Property 2: Statistics Update After Burn - **Validates: Requirements 3.4, 4.6**', () => {
    const userStatisticsArbitrary = fc.record({
      totalBurned: fc.nat(),
      todayBurned: fc.nat(),
      totalClicks: fc.nat(),
      lastBurnTimestamp: fc.nat(),
      lastResetDate: fc.constant(new Date().toISOString().split('T')[0]),
    });

    const burnAmountArbitrary = fc.integer({ min: 1, max: 1000000 });

    fc.assert(
      fc.property(userStatisticsArbitrary, burnAmountArbitrary, (initialStats, burnAmount) => {
        // Set up initial statistics
        localStorageMock[STORAGE_KEY] = JSON.stringify(initialStats);
        
        const beforeTimestamp = Date.now();
        
        // Call updateAfterBurn
        const result = updateAfterBurn(burnAmount);
        
        const afterTimestamp = Date.now();
        
        // Verify totalBurned increased by burn amount
        expect(result.totalBurned).toBe(initialStats.totalBurned + burnAmount);
        
        // Verify todayBurned increased by burn amount
        expect(result.todayBurned).toBe(initialStats.todayBurned + burnAmount);
        
        // Verify totalClicks increased by 1
        expect(result.totalClicks).toBe(initialStats.totalClicks + 1);
        
        // Verify lastBurnTimestamp was updated to current time
        expect(result.lastBurnTimestamp).toBeGreaterThanOrEqual(beforeTimestamp);
        expect(result.lastBurnTimestamp).toBeLessThanOrEqual(afterTimestamp);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: solana-devnet-integration, Property 3: Daily Reset Logic
  it('Property 3: Daily Reset Logic - **Validates: Requirements 4.3**', () => {
    const userStatisticsArbitrary = fc.record({
      totalBurned: fc.nat(),
      todayBurned: fc.integer({ min: 1, max: 1000000 }), // Ensure non-zero
      totalClicks: fc.nat(),
      lastBurnTimestamp: fc.nat(),
      lastResetDate: fc.date({ max: new Date(Date.now() - 86400000) }) // Past date
        .map(d => d.toISOString().split('T')[0]),
    });

    fc.assert(
      fc.property(userStatisticsArbitrary, (stats) => {
        // Call checkDailyReset
        const result = checkDailyReset(stats);
        
        // Verify todayBurned reset to 0
        expect(result.todayBurned).toBe(0);
        
        // Verify lastResetDate updated to today
        const today = new Date().toISOString().split('T')[0];
        expect(result.lastResetDate).toBe(today);
        
        // Verify other fields unchanged
        expect(result.totalBurned).toBe(stats.totalBurned);
        expect(result.totalClicks).toBe(stats.totalClicks);
        expect(result.lastBurnTimestamp).toBe(stats.lastBurnTimestamp);
      }),
      { numRuns: 100 }
    );
  });
});
