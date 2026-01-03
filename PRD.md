# Planning Guide

A celebratory web app where users submit their New Year's resolutions and view others' resolutions floating across the screen in a magical, festive display.

**Experience Qualities**:
1. **Celebratory** - The interface should feel like a New Year's celebration with sparkle and joy
2. **Intimate** - Sharing resolutions feels personal and meaningful, not clinical
3. **Whimsical** - Floating resolutions create a dreamlike, magical atmosphere

**Complexity Level**: Light Application (multiple features with basic state)
- Two main views (entry form and floating display), persistent storage for resolutions, content filtering

## Essential Features

### Resolution Entry Form
- **Functionality**: Multi-input form allowing 1+ resolutions with optional name/signature
- **Purpose**: Capture user's New Year's resolutions in a delightful way
- **Trigger**: User lands on form view or clicks "Add Resolution" button
- **Progression**: User types resolution → adds more if desired → optionally adds name → submits → redirects to gallery
- **Success criteria**: Resolution(s) saved to storage and visible in floating display

### Floating Resolutions Gallery
- **Functionality**: All submitted resolutions float/drift across the screen
- **Purpose**: Create a shared, communal feeling of collective aspirations
- **Trigger**: After form submission or when viewing main gallery
- **Progression**: User sees floating cards → can read others' resolutions → can click to add their own
- **Success criteria**: Resolutions animate smoothly, are readable, and feel magical

### Profanity Filter
- **Functionality**: Block submissions containing profanity or slurs
- **Purpose**: Keep the space positive and safe for all viewers
- **Trigger**: On form submission before saving
- **Progression**: User submits → content checked → blocked if inappropriate with friendly message
- **Success criteria**: Inappropriate content rejected with clear feedback

### Anonymous Option
- **Functionality**: Toggle to submit with or without name
- **Purpose**: Allow users to share resolutions without revealing identity
- **Trigger**: Checkbox/switch in form
- **Progression**: User toggles anonymous → name field hidden/shown
- **Success criteria**: Anonymous submissions show no name, named ones display it

## Edge Case Handling
- **Empty submission**: Require at least one non-empty resolution before submitting
- **Very long resolutions**: Limit character count with visible counter
- **No resolutions yet**: Show encouraging empty state with invitation to be first
- **Profanity detected**: Show friendly error without revealing which words triggered it

## Design Direction
Evoke the magic of New Year's Eve midnight - deep midnight blues and purples with golden sparkles and warm champagne tones. The design should feel like confetti and fireworks frozen in time.

## Color Selection
- **Primary Color**: `oklch(0.75 0.15 85)` - Warm champagne gold for buttons and highlights, communicates celebration
- **Secondary Colors**: `oklch(0.25 0.08 280)` - Deep midnight purple for backgrounds, creates depth and mystery
- **Accent Color**: `oklch(0.85 0.12 60)` - Soft warm cream for floating cards, feels like paper lanterns
- **Foreground/Background Pairings**:
  - Background (Deep Midnight `oklch(0.18 0.06 280)`): Cream text (`oklch(0.95 0.02 85)`) - Ratio ~7:1 ✓
  - Card (Soft Cream `oklch(0.92 0.03 85)`): Dark text (`oklch(0.25 0.02 280)`) - Ratio ~6:1 ✓
  - Primary Button (Gold `oklch(0.75 0.15 85)`): Dark text (`oklch(0.2 0.05 85)`) - Ratio ~5:1 ✓

## Font Selection
Typography should feel elegant yet approachable, like a handwritten resolution on beautiful stationery.

- **Typographic Hierarchy**:
  - H1 (Page Title): Playfair Display Bold/36px/tight letter spacing
  - H2 (Section Headers): Playfair Display Medium/24px/normal
  - Body (Resolutions): Source Sans 3 Regular/16px/relaxed line height
  - Labels: Source Sans 3 Medium/14px/normal

## Animations
Animations should feel gentle and magical - floating cards drift like paper lanterns or snowflakes, with subtle parallax depth. Form interactions use soft springs for feedback. Cards should have slight rotation variation for organic feel.

## Component Selection
- **Components**: Card (floating resolutions), Input (resolution text), Textarea (longer resolutions), Switch (anonymous toggle), Button (submit, add more), Badge (resolution count)
- **Customizations**: Floating card component with CSS animation for drift effect, star/sparkle decorative elements
- **States**: Buttons have warm glow on hover, inputs have gold focus ring, cards have subtle shadow lift on hover
- **Icon Selection**: Plus (add resolution), Sparkle (decorative), User (anonymous toggle), Send (submit)
- **Spacing**: 4px base, generous padding (16-24px) on cards, 8px gaps between form elements
- **Mobile**: Stack form elements vertically, floating cards scale down, touch-friendly button sizes (min 44px)
