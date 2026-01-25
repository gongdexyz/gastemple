# Implementation Plan: Pixel Buddha Quotes

## Overview

This implementation plan focuses on modifying the CSS classes in the PoisonousReport component to apply 8-bit pixel font styling to Buddha quotes. The changes are minimal and localized to a single component file, requiring only CSS class modifications without any logic changes.

## Tasks

- [x] 1. Modify Buddha quote CSS classes in PoisonousReport component
  - Open `src/components/PoisonousReport.tsx`
  - Locate the Buddha quote text element (around line 56-66)
  - Remove the `italic` class from the className string
  - Add the `font-pixel` class to the className string
  - Ensure `text-lg`, `font-bold`, and color classes remain unchanged
  - Verify the quote text element maintains its conditional color logic: `${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 4.1_

- [x] 2. Write property tests for CSS class application
  - [x] 2.1 Write property test for pixel font application
    - **Property 1: Pixel Font Application**
    - Test that for any render, the quote text has "font-pixel" class
    - **Validates: Requirements 1.1, 1.2**
  
  - [x] 2.2 Write property test for bold text styling
    - **Property 2: Bold Text Styling**
    - Test that for any render, the quote text has "font-bold" class
    - **Validates: Requirements 2.1**
  
  - [x] 2.3 Write property test for theme-based color application
    - **Property 3: Theme-Based Color Application**
    - Test that color class matches theme mode (degen-yellow or goldman-gold)
    - **Validates: Requirements 3.1**
  
  - [x] 2.4 Write property test for attribution text presence
    - **Property 4: Attribution Text Presence**
    - Test that attribution text contains correct language-specific text
    - **Validates: Requirements 3.3**
  
  - [x] 2.5 Write property test for layout structure preservation
    - **Property 5: Layout Structure Preservation**
    - Test that structural CSS classes (text-lg, text-center, margins) are maintained
    - **Validates: Requirements 3.4, 5.3, 6.1**
  
  - [x] 2.6 Write property test for italic class removal
    - **Property 6: Italic Class Removal**
    - Test that quote text does NOT have "italic" class
    - **Validates: Requirements 4.1**

- [ ] 3. Write example tests for specific scenarios
  - [ ] 3.1 Write test for degen mode styling
    - Test that font-pixel is applied when isDegen=true
    - _Requirements: 1.3_
  
  - [ ] 3.2 Write test for goldman mode styling
    - Test that font-pixel is applied when isDegen=false
    - _Requirements: 1.4_
  
  - [ ] 3.3 Write test for Buddha emoji preservation
    - Test that emoji (🐸) is present in rendered output
    - _Requirements: 3.2_

- [ ] 4. Checkpoint - Verify implementation and run tests
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test the component in both degen and goldman modes
  - Verify Chinese and English quotes both display correctly with pixel font
  - Check that the quote section maintains proper spacing and layout

## Notes

- All tasks are required for comprehensive implementation
- The core implementation (Task 1) is a simple CSS class change
- Property tests validate that styling is correctly applied across all scenarios
- Manual visual testing is recommended to verify the aesthetic quality
- No logic changes or new dependencies are required
