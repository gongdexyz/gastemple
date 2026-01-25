/**
 * Statistics Manager for Solana Token Burning
 * 
 * Manages localStorage persistence for user burn statistics.
 * Handles daily resets and statistics updates after burn transactions.
 */

/**
 * User burn statistics stored in localStorage
 */
export interface UserStatistics {
  /** Total tokens burned across all time */
  totalBurned: number;
  
  /** Tokens burned today (resets at midnight) */
  todayBurned: number;
  
  /** Total number of burn transactions */
  totalClicks: number;
  
  /** Unix timestamp (milliseconds) of last burn */
  lastBurnTimestamp: number;
  
  /** Date string for daily reset (YYYY-MM-DD) */
  lastResetDate: string;
}

/**
 * Default statistics values for new users
 */
export const DEFAULT_STATISTICS: UserStatistics = {
  totalBurned: 0,
  todayBurned: 0,
  totalClicks: 0,
  lastBurnTimestamp: 0,
  lastResetDate: new Date().toISOString().split('T')[0],
};

/**
 * localStorage key for storing user statistics
 */
export const STORAGE_KEY = 'solana_burn_statistics';

/**
 * Load statistics from localStorage
 * @returns UserStatistics - Loaded statistics or default values
 */
export function loadStatistics(): UserStatistics {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available, using default statistics');
      return { ...DEFAULT_STATISTICS };
    }

    // Read from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    
    // If no data found, return defaults
    if (!stored) {
      return { ...DEFAULT_STATISTICS };
    }

    // Parse JSON
    const parsed = JSON.parse(stored) as UserStatistics;
    
    // Validate that all required fields exist
    if (
      typeof parsed.totalBurned === 'number' &&
      typeof parsed.todayBurned === 'number' &&
      typeof parsed.totalClicks === 'number' &&
      typeof parsed.lastBurnTimestamp === 'number' &&
      typeof parsed.lastResetDate === 'string'
    ) {
      return parsed;
    }
    
    // If validation fails, return defaults
    console.warn('Invalid statistics data in localStorage, using defaults');
    return { ...DEFAULT_STATISTICS };
  } catch (error) {
    // Handle parse errors or other exceptions
    console.error('Error loading statistics from localStorage:', error);
    return { ...DEFAULT_STATISTICS };
  }
}

/**
 * Save statistics to localStorage
 * @param stats - UserStatistics to save
 */
export function saveStatistics(stats: UserStatistics): void {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available, cannot save statistics');
      return;
    }

    // Serialize to JSON
    const serialized = JSON.stringify(stats);
    
    // Write to localStorage
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Error saving statistics to localStorage:', error);
  }
}

/**
 * Check if daily reset is needed and perform reset if necessary
 * @param stats - Current UserStatistics
 * @returns UserStatistics - Updated statistics (with reset if needed)
 */
export function checkDailyReset(stats: UserStatistics): UserStatistics {
  // Get current date as YYYY-MM-DD string
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Compare with lastResetDate
  if (stats.lastResetDate !== currentDate) {
    // Different date, perform reset
    return {
      ...stats,
      todayBurned: 0,
      lastResetDate: currentDate,
    };
  }
  
  // Same date, no reset needed
  return stats;
}

/**
 * Update statistics after a burn transaction
 * @param burnAmount - Amount of tokens burned
 * @returns UserStatistics - Updated statistics
 */
export function updateAfterBurn(burnAmount: number): UserStatistics {
  // Load current statistics
  const currentStats = loadStatistics();
  
  // Check for daily reset
  const resetStats = checkDailyReset(currentStats);
  
  // Update statistics
  const updatedStats: UserStatistics = {
    totalBurned: resetStats.totalBurned + burnAmount,
    todayBurned: resetStats.todayBurned + burnAmount,
    totalClicks: resetStats.totalClicks + 1,
    lastBurnTimestamp: Date.now(),
    lastResetDate: resetStats.lastResetDate,
  };
  
  // Save to localStorage
  saveStatistics(updatedStats);
  
  return updatedStats;
}
