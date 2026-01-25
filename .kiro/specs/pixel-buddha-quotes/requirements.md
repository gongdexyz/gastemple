# Requirements Document

## Introduction

This feature transforms the Buddha quote text display in the PoisonousReport component to use an 8-bit pixel game style, making the text bold and styled like classic 8-bit RPG game dialogue. The Buddha quotes appear after a user draws a crypto project in the gacha game, providing humorous commentary on their selection.

## Glossary

- **PoisonousReport**: The modal component that displays detailed analysis of a drawn crypto project, including Buddha quotes
- **Buddha_Quote**: A humorous, sarcastic quote displayed at the top of the PoisonousReport modal
- **Pixel_Font**: The "font-pixel" CSS class that applies retro 8-bit game styling using "ZCOOL KuaiLe" and "Press Start 2P" fonts
- **Degen_Mode**: One of two visual themes in the app (the other being "Goldman mode"), which already uses pixel fonts extensively
- **Quote_Section**: The specific area in PoisonousReport that displays the Buddha emoji, quote text, and attribution

## Requirements

### Requirement 1: Apply Pixel Font to Buddha Quotes

**User Story:** As a player, I want the Buddha quotes to use a pixel/retro game font, so that they match the 8-bit aesthetic of the game.

#### Acceptance Criteria

1. WHEN the PoisonousReport modal is displayed, THE Quote_Section SHALL render the Buddha_Quote text using the Pixel_Font class
2. THE Quote_Section SHALL apply the Pixel_Font to both Chinese and English Buddha quotes
3. WHEN in Degen_Mode, THE Quote_Section SHALL use the existing "font-pixel" class for consistency with other degen mode text
4. WHEN in Goldman mode, THE Quote_Section SHALL also use the "font-pixel" class to achieve the 8-bit aesthetic regardless of theme

### Requirement 2: Maintain Text Boldness

**User Story:** As a player, I want the Buddha quote text to be bold and prominent, so that it stands out as an important message.

#### Acceptance Criteria

1. THE Quote_Section SHALL maintain the "font-bold" class on the Buddha_Quote text
2. THE Quote_Section SHALL ensure the text weight is sufficient for readability with the pixel font

### Requirement 3: Preserve Visual Hierarchy

**User Story:** As a player, I want the Buddha quote section to remain visually distinct, so that I can easily identify it in the report.

#### Acceptance Criteria

1. THE Quote_Section SHALL maintain the existing color scheme (degen-yellow for degen mode, goldman-gold for goldman mode)
2. THE Quote_Section SHALL preserve the Buddha emoji (🐸) display above the quote
3. THE Quote_Section SHALL preserve the attribution text ("— 佛曰" / "— Buddha says") below the quote
4. THE Quote_Section SHALL maintain the existing spacing and layout structure

### Requirement 4: Remove Italic Styling

**User Story:** As a player, I want the Buddha quotes to look like classic 8-bit game text, so that the aesthetic is authentic to retro games.

#### Acceptance Criteria

1. THE Quote_Section SHALL remove the "italic" class from the Buddha_Quote text
2. THE Quote_Section SHALL display the text in normal (non-italic) style to match classic 8-bit RPG dialogue

### Requirement 5: Ensure Cross-Language Compatibility

**User Story:** As a player, I want the pixel font styling to work correctly for both Chinese and English quotes, so that the experience is consistent regardless of language.

#### Acceptance Criteria

1. WHEN displaying Chinese Buddha quotes, THE Quote_Section SHALL render the text legibly using the "ZCOOL KuaiLe" font
2. WHEN displaying English Buddha quotes, THE Quote_Section SHALL render the text legibly using the "Press Start 2P" font
3. THE Quote_Section SHALL maintain consistent text size and spacing for both languages

### Requirement 6: Maintain Responsive Design

**User Story:** As a player, I want the Buddha quote section to display correctly on different screen sizes, so that I can read it on any device.

#### Acceptance Criteria

1. THE Quote_Section SHALL maintain responsive text sizing across mobile and desktop viewports
2. THE Quote_Section SHALL ensure the pixel-styled text remains readable at all supported screen sizes
3. THE Quote_Section SHALL preserve the existing responsive layout behavior of the PoisonousReport modal
