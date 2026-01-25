# Design Document: Pixel Buddha Quotes

## Overview

This feature enhances the Buddha quote display in the PoisonousReport component by applying 8-bit pixel game styling. The implementation is straightforward - we'll modify the CSS classes applied to the quote text element to use the existing "font-pixel" class and remove the italic styling. This creates an authentic retro RPG dialogue aesthetic that aligns with the game's overall visual theme, particularly in degen mode.

The change is minimal and localized to a single component, requiring only CSS class modifications without any logic changes or new dependencies.

## Architecture

### Component Structure

The feature modifies the existing PoisonousReport component (`src/components/PoisonousReport.tsx`). No new components are needed.

```
PoisonousReport (existing)
  └── Quote Section (modified)
      ├── Buddha Emoji (unchanged)
      ├── Quote Text (CSS classes modified)
      └── Attribution Text (unchanged)
```

### Styling Approach

The implementation leverages the existing Tailwind CSS configuration which already defines the "font-pixel" class:

```javascript
fontFamily: {
  pixel: ['"ZCOOL KuaiLe"', '"Press Start 2P"', 'cursive'],
}
```

- **ZCOOL KuaiLe**: Handles Chinese characters with pixel aesthetic
- **Press Start 2P**: Handles English characters with classic 8-bit game font
- **cursive**: Fallback font family

## Components and Interfaces

### Modified Component: PoisonousReport

**File**: `src/components/PoisonousReport.tsx`

**Current Implementation** (lines 56-66):
```tsx
<p className={`
  text-lg font-bold italic
  ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}
`}>
  "{buddhaQuote}"
</p>
```

**New Implementation**:
```tsx
<p className={`
  text-lg font-bold font-pixel
  ${isDegen ? 'text-degen-yellow' : 'text-goldman-gold'}
`}>
  "{buddhaQuote}"
</p>
```

**Changes**:
1. Remove `italic` class
2. Add `font-pixel` class
3. Preserve all other classes: `text-lg`, `font-bold`, color classes

### No Interface Changes

This feature does not modify any TypeScript interfaces, props, or function signatures. It's purely a presentational change affecting CSS classes.

## Data Models

No data model changes are required. The feature uses existing data structures:

- `BUDDHA_QUOTES_CN`: Array of Chinese Buddha quotes (unchanged)
- `BUDDHA_QUOTES_EN`: Array of English Buddha quotes (unchanged)
- `getRandomQuote(isEN: boolean)`: Function to retrieve random quote (unchanged)

## Error Handling

### Font Loading Failures

**Scenario**: Pixel fonts fail to load from CDN or local source

**Handling**: 
- Tailwind's font-pixel definition includes fallback to 'cursive' font family
- Browser will automatically fall back to system cursive fonts
- Text remains readable even if pixel fonts don't load

**No explicit error handling needed** - CSS font fallback mechanism handles this gracefully.

### Missing Quote Data

**Scenario**: Quote arrays are empty or getRandomQuote returns undefined

**Current Handling**: Already handled by existing component logic
- Component receives quote from parent logic
- If quote is empty string, it will render empty (acceptable edge case)

**No changes needed** - existing error handling is sufficient.

## Testing Strategy

### Unit Testing Approach

Since this is a pure CSS styling change with no logic modifications, traditional unit tests provide limited value. However, we can write tests to verify the component renders with correct CSS classes.

**Test Cases**:

1. **Test: Buddha quote has font-pixel class in degen mode**
   - Render PoisonousReport with isDegen=true
   - Query the quote text element
   - Assert it has className containing "font-pixel"

2. **Test: Buddha quote has font-pixel class in goldman mode**
   - Render PoisonousReport with isDegen=false
   - Query the quote text element
   - Assert it has className containing "font-pixel"

3. **Test: Buddha quote does not have italic class**
   - Render PoisonousReport
   - Query the quote text element
   - Assert it does NOT have className containing "italic"

4. **Test: Buddha quote maintains bold styling**
   - Render PoisonousReport
   - Query the quote text element
   - Assert it has className containing "font-bold"

5. **Test: Buddha quote maintains color classes**
   - Render PoisonousReport with isDegen=true
   - Assert quote has "text-degen-yellow"
   - Render with isDegen=false
   - Assert quote has "text-goldman-gold"

### Visual Regression Testing

**Recommended Approach**: Manual visual testing or screenshot comparison

**Test Scenarios**:
1. Open PoisonousReport in degen mode with Chinese quote
2. Open PoisonousReport in degen mode with English quote
3. Open PoisonousReport in goldman mode with Chinese quote
4. Open PoisonousReport in goldman mode with English quote
5. Test on mobile viewport (responsive design)
6. Test on desktop viewport

**Verification Criteria**:
- Text uses pixel/retro font appearance
- Text is bold and readable
- Text is not italicized
- Colors match theme (yellow for degen, gold for goldman)
- Layout and spacing remain consistent
- No text overflow or clipping

### Property-Based Testing

Property-based testing is not applicable for this feature as it involves only CSS styling changes with no algorithmic logic or data transformations.

### Integration Testing

**Test Scenario**: End-to-end gacha flow
1. Navigate to gacha page
2. Draw a crypto project
3. Wait for PoisonousReport modal to appear
4. Verify Buddha quote displays with pixel font styling
5. Close modal and draw again
6. Verify styling persists across multiple draws

### Browser Compatibility Testing

**Target Browsers**:
- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop and iOS)

**Test Focus**:
- Font rendering quality
- Fallback font behavior if pixel fonts don't load
- Text readability at different zoom levels

### Accessibility Testing

**Considerations**:
- Pixel fonts can be harder to read for users with visual impairments
- Ensure sufficient contrast ratio (already handled by existing color scheme)
- Test with screen readers to ensure text is still readable
- Verify text can be zoomed without breaking layout

**Note**: Since this is a game with stylistic choices, some accessibility trade-offs are acceptable, but text should remain readable at standard zoom levels.


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

For this feature, the correctness properties focus on verifying that the CSS class modifications are correctly applied to the Buddha quote section across all rendering scenarios.

### Property 1: Pixel Font Application

*For any* render of the PoisonousReport component, the Buddha quote text element should have the "font-pixel" CSS class in its className.

**Validates: Requirements 1.1, 1.2**

**Rationale**: This property ensures the core requirement - that pixel font styling is applied to Buddha quotes - holds universally across all component renders, regardless of mode, language, or quote content.

### Property 2: Bold Text Styling

*For any* render of the PoisonousReport component, the Buddha quote text element should have the "font-bold" CSS class in its className.

**Validates: Requirements 2.1**

**Rationale**: This property ensures the text maintains its bold weight, which is essential for readability and visual prominence with pixel fonts.

### Property 3: Theme-Based Color Application

*For any* render of the PoisonousReport component, when isDegen is true, the Buddha quote text should have "text-degen-yellow" class, and when isDegen is false, it should have "text-goldman-gold" class.

**Validates: Requirements 3.1**

**Rationale**: This property ensures the color scheme correctly adapts to the selected theme mode, maintaining visual consistency with the rest of the interface.

### Property 4: Attribution Text Presence

*For any* render of the PoisonousReport component, the attribution text should be present and should contain "佛曰" when language is Chinese or "Buddha says" when language is English.

**Validates: Requirements 3.3**

**Rationale**: This property ensures the attribution remains intact after styling changes, preserving the complete quote presentation structure.

### Property 5: Layout Structure Preservation

*For any* render of the PoisonousReport component, the quote section should maintain the structural CSS classes including "text-lg" for sizing, "text-center" for alignment, and appropriate margin classes.

**Validates: Requirements 3.4, 5.3, 6.1**

**Rationale**: This property ensures that spacing, sizing, and layout classes remain consistent, preserving the responsive design and visual hierarchy of the quote section.

### Property 6: Italic Class Removal

*For any* render of the PoisonousReport component, the Buddha quote text element should NOT have the "italic" CSS class in its className.

**Validates: Requirements 4.1**

**Rationale**: This property ensures the italic styling is removed to achieve the authentic 8-bit RPG dialogue aesthetic, where text is typically displayed in normal (non-italic) style.

### Example Test Cases

While properties cover the general behavior, these specific examples validate important edge cases:

**Example 1: Degen Mode Styling**
- Given: PoisonousReport rendered with isDegen=true
- When: Component is mounted
- Then: Quote text should have "font-pixel" class
- **Validates: Requirements 1.3**

**Example 2: Goldman Mode Styling**
- Given: PoisonousReport rendered with isDegen=false
- When: Component is mounted
- Then: Quote text should have "font-pixel" class
- **Validates: Requirements 1.4**

**Example 3: Buddha Emoji Preservation**
- Given: PoisonousReport rendered
- When: Component is mounted
- Then: The Buddha emoji (🐸) should be visible in the quote section
- **Validates: Requirements 3.2**

### Non-Testable Requirements

The following requirements involve subjective visual qualities that cannot be verified through automated testing:

- **Requirement 2.2**: Text weight sufficiency for readability (subjective visual assessment)
- **Requirement 4.2**: Matching classic 8-bit RPG dialogue style (aesthetic judgment)
- **Requirement 5.1**: Legibility with ZCOOL KuaiLe font (subjective readability)
- **Requirement 5.2**: Legibility with Press Start 2P font (subjective readability)
- **Requirement 6.2**: Readability at all screen sizes (subjective assessment)
- **Requirement 6.3**: Preservation of existing responsive behavior (requires before/after comparison)

These requirements should be validated through manual visual testing and user acceptance testing.
