# Implementation Plan: Solana Devnet Token Burning

## Overview

This implementation plan breaks down the Solana Devnet token burning feature into discrete coding tasks. The approach follows an incremental development pattern: first establishing the core Solana connection and wallet integration, then implementing token operations (minting and burning), followed by statistics management with localStorage persistence, and finally integrating everything into the UI with proper error handling and user feedback.

## Tasks

- [x] 1. Set up Solana Devnet connection and wallet integration
  - Create `src/services/solanaService.ts` with Connection to Devnet RPC endpoint
  - Implement Phantom wallet connection function
  - Add wallet state management (connected, publicKey)
  - Configure Devnet endpoint constant: `https://api.devnet.solana.com`
  - Define burn address constant: `1nc1nerator11111111111111111111111111111111`
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 1.1 Write unit tests for wallet connection
  - Test successful wallet connection
  - Test wallet not installed error
  - Test wallet rejection error
  - _Requirements: 1.1, 1.2_

- [ ] 2. Implement test token minting functionality
  - [x] 2.1 Create or configure test SPL token mint on Devnet
    - Define TEST_TOKEN_MINT constant (use existing or create new token)
    - Add function to get or create associated token account
    - _Requirements: 2.3_
  
  - [x] 2.2 Implement mintTestTokens function in solanaService
    - Create mint instruction for test tokens
    - Handle token account creation if needed
    - Return transaction signature on success
    - Add error handling for minting failures
    - _Requirements: 2.2, 2.5_
  
  - [x] 2.3 Write unit tests for token minting
    - Test successful minting
    - Test token account creation
    - Test minting error handling
    - _Requirements: 2.2, 2.5_

- [ ] 3. Implement token burning functionality
  - [x] 3.1 Implement getTokenBalance function
    - Use getAssociatedTokenAddress to find token account
    - Query token account balance
    - Return balance as number
    - _Requirements: 3.5_
  
  - [x] 3.2 Implement burnTokens function in solanaService
    - Check balance before creating transaction
    - Create transfer instruction to burn address
    - Submit transaction and wait for confirmation
    - Return transaction signature on success
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [x] 3.3 Write unit tests for token burning
    - Test successful burn transaction
    - Test insufficient balance error
    - Test transaction creation with correct burn address
    - _Requirements: 3.1, 3.2, 3.5_

- [ ] 4. Implement statistics management with localStorage
  - [x] 4.1 Create `src/services/statisticsManager.ts` with UserStatistics interface
    - Define UserStatistics type (totalBurned, todayBurned, totalClicks, lastBurnTimestamp, lastResetDate)
    - Define DEFAULT_STATISTICS constant
    - Define STORAGE_KEY constant
    - _Requirements: 4.1_
  
  - [x] 4.2 Implement loadStatistics function
    - Read from localStorage using STORAGE_KEY
    - Parse JSON to UserStatistics
    - Return default statistics if not found or parse error
    - Handle localStorage unavailable gracefully
    - _Requirements: 4.7_
  
  - [x] 4.3 Implement saveStatistics function
    - Serialize UserStatistics to JSON
    - Write to localStorage using STORAGE_KEY
    - Handle localStorage errors gracefully
    - _Requirements: 4.1_
  
  - [x] 4.4 Implement checkDailyReset function
    - Get current date as YYYY-MM-DD string
    - Compare with lastResetDate
    - If different, reset todayBurned to 0 and update lastResetDate
    - Return updated statistics
    - _Requirements: 4.3_
  
  - [x] 4.5 Implement updateAfterBurn function
    - Increment totalBurned by burn amount
    - Increment todayBurned by burn amount
    - Increment totalClicks by 1
    - Set lastBurnTimestamp to Date.now()
    - Save updated statistics to localStorage
    - Return updated statistics
    - _Requirements: 3.4, 4.6_
  
  - [x] 4.6 Write property test for statistics localStorage round-trip
    - **Property 1: Statistics localStorage Round-Trip**
    - **Validates: Requirements 4.1, 4.2, 4.4, 4.5, 4.7**
    - Generate random UserStatistics objects
    - Save to localStorage then load back
    - Verify all fields are preserved
  
  - [x] 4.7 Write property test for statistics update after burn
    - **Property 2: Statistics Update After Burn**
    - **Validates: Requirements 3.4, 4.6**
    - Generate random burn amounts and initial statistics
    - Call updateAfterBurn
    - Verify totalBurned, todayBurned, totalClicks, and lastBurnTimestamp updated correctly
  
  - [x] 4.8 Write property test for daily reset logic
    - **Property 3: Daily Reset Logic**
    - **Validates: Requirements 4.3**
    - Generate statistics with past dates
    - Call checkDailyReset
    - Verify todayBurned reset to 0, lastResetDate updated, other fields unchanged

- [ ] 5. Create React hook for token burning
  - [~] 5.1 Create `src/hooks/useBurnTokens.ts` with state management
    - Define UseBurnTokensResult interface
    - Initialize state: isConnected, walletAddress, tokenBalance, statistics, isLoading, error
    - Load statistics on mount and check for daily reset
    - _Requirements: 4.7, 4.3_
  
  - [~] 5.2 Implement connectWallet action
    - Set isLoading to true
    - Call solanaService.connectWallet()
    - Update walletAddress and isConnected state
    - Load token balance after connection
    - Handle errors and set error state
    - Set isLoading to false
    - _Requirements: 1.1, 1.2_
  
  - [~] 5.3 Implement burnTokens action
    - Clear any existing errors
    - Set isLoading to true
    - Call solanaService.burnTokens()
    - On success: update statistics, refresh balance, clear error
    - On failure: set error message
    - Set isLoading to false
    - _Requirements: 3.2, 3.4, 7.1, 7.2, 7.3, 7.5_
  
  - [~] 5.4 Implement getTestTokens action
    - Clear any existing errors
    - Set isLoading to true
    - Call solanaService.mintTestTokens()
    - On success: refresh balance, clear error
    - On failure: set error message
    - Set isLoading to false
    - _Requirements: 2.2, 2.4, 2.5, 7.5_
  
  - [~] 5.5 Write property test for error state clearing
    - **Property 5: Error State Clearing**
    - **Validates: Requirements 7.5**
    - Generate random error states
    - Initiate new transaction
    - Verify error is cleared before transaction begins
  
  - [~] 5.6 Write property test for button state during transactions
    - **Property 6: Button State During Transactions**
    - **Validates: Requirements 8.4, 8.5**
    - Test that isLoading=true disables buttons
    - Test that isLoading=false enables buttons
    - Verify this holds for both success and failure cases

- [~] 6. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Build UI components
  - [~] 7.1 Create WalletConnection component
    - Show "Connect Wallet" button when not connected
    - Show wallet address when connected
    - Display connection errors
    - _Requirements: 8.3_
  
  - [~] 7.2 Create TokenBalance component
    - Display current token balance
    - Format numbers with appropriate decimals
    - _Requirements: 2.4_
  
  - [~] 7.3 Create BurnButton component
    - Disable when not connected or loading
    - Show loading spinner when isLoading=true
    - Handle burn amount input
    - Call burnTokens on click
    - _Requirements: 3.3, 8.1, 8.4, 8.5_
  
  - [~] 7.4 Create TestTokenButton component
    - Show "Get Test Tokens" button
    - Disable when not connected or loading
    - Call getTestTokens on click
    - _Requirements: 2.1, 8.4, 8.5_
  
  - [~] 7.5 Create UserStatistics component
    - Display totalBurned from statistics
    - Display todayBurned from statistics
    - Display totalClicks from statistics
    - Display lastBurnTimestamp formatted as readable date
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [~] 7.6 Create GlobalStatistics component with demo data
    - Display mock global statistics
    - Add "DEMO DATA" label prominently
    - Visually distinguish from real user statistics
    - _Requirements: 6.1, 6.3_
  
  - [~] 7.7 Create ErrorMessage component
    - Display error message when error is not null
    - Add dismiss button to clear error
    - Style for visibility
    - _Requirements: 3.6, 7.1, 7.2, 7.3_
  
  - [~] 7.8 Create LoadingSpinner component
    - Show spinner animation
    - Display during transaction processing
    - _Requirements: 8.1_
  
  - [~] 7.9 Write property test for UI reactivity to statistics
    - **Property 4: UI Reactivity to Statistics**
    - **Validates: Requirements 5.5**
    - Generate two different UserStatistics objects
    - Update statistics state
    - Verify UI reflects all changed values immediately

- [ ] 8. Integrate components into main BurnInterface
  - [~] 8.1 Create `src/components/BurnInterface.tsx`
    - Use useBurnTokens hook
    - Compose all sub-components
    - Pass state and actions to components
    - _Requirements: All_
  
  - [~] 8.2 Add error handling with user-friendly messages
    - Map error types to user-friendly messages
    - Display errors using ErrorMessage component
    - Log errors for debugging
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [~] 8.3 Add success feedback after transactions
    - Display success message after burn
    - Display success message after minting
    - Auto-dismiss or allow manual dismiss
    - _Requirements: 8.2_

- [~] 9. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- All Solana operations use Devnet (no real money)
- Property tests should run minimum 100 iterations
- Use fast-check library for property-based testing in TypeScript
- Checkpoints ensure incremental validation of functionality
- All tests are required for comprehensive coverage
