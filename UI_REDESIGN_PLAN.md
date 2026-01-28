# Watermelon-Inspired UI Redesign for Punitto

## Overview

Blend the charming skeuomorphic elements from Watermelon Game with Punitto's kawaii aesthetic while maintaining the pastel color palette and cute feel. Support both portrait and landscape layouts.

## Visual Comparison

**Current Punitto:**

- Simple white score boxes at top
- Small "NEXT" preview (single animal)
- Plain gradient background
- Minimal container border

**Target Blend:**

- Decorative ribbon/banner score panel (kawaii-fied)
- Circular progression wheel showing all 7 tiers
- Glass container with thick rounded border
- Subtle patterned background (hearts/paws instead of checkers)

## File Changes

### 1. Background Pattern - [src/style.css](src/style.css) and [index.html](index.html)

Add a subtle repeating pattern (tiny hearts, paw prints, or stars) to the background:

```css
body {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE4E1 100%);
  background-image: url('/assets/images/ui/pattern-paws.svg');
  background-size: 40px 40px;
  background-blend-mode: soft-light;
}
```

Create an SVG pattern asset at `/public/assets/images/ui/pattern-paws.svg` with a subtle, barely-visible paw print or heart motif.

### 2. Decorative Score Panel - [src/ui/ScoreDisplay.ts](src/ui/ScoreDisplay.ts) and [src/style.css](src/style.css)

Replace the simple score boxes with a decorative banner-style panel:

```
+---------------------------+
|    [ribbon decoration]    |
|  +---------+---------+    |
|  | SCORE   |  BEST   |    |
|  |  2,500  |  3,230  |    |
|  +---------+---------+    |
+---------------------------+
```

Key CSS changes:

- Add a banner/ribbon SVG background or CSS shape
- Keep pastel colors (pink ribbon instead of brown)
- Use `box-shadow` for depth
- Rounded corners throughout
- Decorative flourishes (tiny stars or sparkles)

### 3. Tier Progression Wheel - New [src/ui/ProgressionWheel.ts](src/ui/ProgressionWheel.ts)

Create a new component showing all 7 animal tiers in a circular arrangement:

```
       [hamster]
    [floof]  [cat]
   [golden]   [shiba]
    [husky]  [westie]
       [NEXT]
```

Implementation:

- Circular div with 7 small animal sprites around the edge
- Center shows "NEXT" label with the upcoming animal highlighted
- Current "next" animal pulses/glows
- Use CSS transforms for positioning (no canvas needed)
- Size: approximately 100x100px

### 4. Glass Container Style - [index.html](index.html) and [src/style.css](src/style.css)

Update the game container to have a thick, rounded glass-like border:

```css
#gameCanvas {
  border-radius: 24px;
  border: 8px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 4px rgba(255, 182, 193, 0.4),  /* Pink outer glow */
    0 15px 50px rgba(0, 0, 0, 0.15),      /* Drop shadow */
    inset 0 2px 20px rgba(255, 255, 255, 0.6); /* Inner highlight */
  background: linear-gradient(180deg, #FFF8F0 0%, #FFEEE8 100%);
}
```

Add a subtle inner "fishbowl" effect with CSS gradients.

### 5. Responsive Layout - [src/style.css](src/style.css) and [src/ui/GameUI.ts](src/ui/GameUI.ts)

**Portrait Layout (current, enhanced):**

```
+-------------------------+
|  [Score Banner Panel]   |
|                         |
| +---+ +---------------+ |
| |PRO| |               | |
| |GRE| |    GAME       | |
| |SSI| |   CONTAINER   | |
| |ON | |               | |
| +---+ +---------------+ |
|                         |
+-------------------------+
```

**Landscape Layout (new):**

```
+--------------------------------------------------+
| [Score]  |                          | [Progress] |
| [Banner] |      GAME CONTAINER      |   Wheel    |
|          |                          |            |
+--------------------------------------------------+
```

Implementation:

- Use CSS media query `@media (orientation: landscape)`
- Detect orientation in `GameUI.ts` via `window.matchMedia`
- Reposition UI elements based on orientation
- Maintain touch-friendly sizing

### 6. Update GameUI Orchestration - [src/ui/GameUI.ts](src/ui/GameUI.ts)

Modify `GameUI` to:

- Import and instantiate `ProgressionWheel`
- Remove the old "next preview" box
- Add orientation change listener
- Reposition elements on resize/orientation change

## New Assets Required

Create these asset files in `/public/assets/images/ui/`:

- `pattern-paws.svg` - Subtle repeating background pattern
- `ribbon-banner.svg` - Decorative banner shape (optional, can use CSS)
- `wheel-bg.svg` - Background for progression wheel (optional)

## Implementation Order

1. Background pattern (quick visual win)
2. Glass container styling (CSS only)
3. Score banner redesign
4. Progression wheel component (new file)
5. Landscape layout support
6. Polish and transitions

## Color Palette (Preserved from Design Doc)

Keep the kawaii pastel palette:

- Primary: `#FF9EAA` (soft pink)
- Secondary: `#FFD4A3` (peach)
- Background: `#FFF8F0` (warm cream)
- Text: `#5A4A42` (soft brown)
- Accent: `#FFB6C1` (light pink for borders)

## Key Differences from Watermelon Game

- **No brown/tan** - Keep everything pastel
- **No skeuomorphic buttons** - User declined this option
- **Hearts/paws pattern** - Not checkerboard
- **Kawaii touches** - Add sparkles, soft shadows, rounded everything

## Todo List

- [ ] Create paw print SVG pattern and add to background
- [ ] Update container styling with thick rounded glass border
- [ ] Redesign score display with decorative banner styling
- [ ] Create new ProgressionWheel component showing all 7 tiers
- [ ] Add CSS media queries and JS for landscape orientation support
- [ ] Integrate all components in GameUI and add transitions
