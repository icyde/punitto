# Punitto - Cute Animal Merge Puzzle Game

A mobile-first physics-based merge puzzle game with cute animals, quest system, and unlockable themes.

## Features

- **7-Tier Animal System**: Merge identical animals to create bigger ones (Hamster → Cat → Shiba → Westie → Husky → Golden → Big Floof)
- **Physics-Based Gameplay**: Realistic physics powered by Matter.js
- **Difficulty System**: Four synergistic mechanics reward skill:
  - **Combo System**: Consecutive merges within 3s build multipliers (up to 3x)
  - **Escalating Difficulty**: Larger animals spawn more often as score increases
  - **Risk Zone Bonus**: 1.25x for merges near the danger line
  - **Quick Merge Bonus**: 1.25x for merging recently settled animals
- **Quest System**: Daily quests and lifetime achievements
- **Theme System**: Unlock new themes (Pastel Paws, Ocean Dreams) by earning stars
- **Scoring & High Scores**: Track your best scores with LocalStorage persistence
- **Mobile-First**: Optimized for touch controls and mobile screens
- **Kawaii Aesthetic**: Cute pastel colors and Sanrio-inspired design

## Tech Stack

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe development
- **Matter.js**: 2D physics engine
- **HTML5 Canvas**: Graphics rendering
- **LocalStorage**: Data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── game/                 # Core game logic
│   ├── Game.ts          # Main game controller
│   ├── PhysicsEngine.ts # Matter.js wrapper
│   ├── AnimalManager.ts # Animal spawning & management
│   ├── ScoreManager.ts  # Scoring system
│   ├── StatsTracker.ts  # Statistics tracking
│   ├── QuestManager.ts  # Quest & achievement system
│   ├── ThemeManager.ts  # Theme loading & switching
│   ├── AudioManager.ts  # Sound effects & music
│   ├── SpriteLoader.ts  # Image loading
│   └── CustomRenderer.ts # Sprite rendering
├── entities/            # Game entities
│   ├── Animal.ts        # Animal entity class
│   └── Container.ts     # Game container with walls
├── ui/                  # UI components
│   ├── GameUI.ts        # Main UI overlay
│   ├── ScoreDisplay.ts  # Score display
│   ├── ComboDisplay.ts  # Combo counter UI
│   ├── Modal.ts         # Modal system
│   ├── QuestToast.ts    # Quest notifications
│   ├── AchievementScreen.ts # Achievements UI
│   ├── ThemeSelector.ts # Theme selection UI
│   └── Tutorial.ts      # First-time tutorial
├── progression/         # Progression systems
│   ├── themes.ts        # Theme definitions
│   ├── quests.ts        # Quest definitions
│   └── achievements.ts  # Achievement definitions
├── utils/               # Utilities
│   ├── constants.ts     # Game constants
│   └── storage.ts       # LocalStorage utilities
├── assets/              # Game assets
│   ├── images/          # Sprite images
│   │   ├── pastelPaws/  # Pastel Paws theme sprites
│   │   └── oceanDreams/ # Ocean Dreams theme sprites
│   └── sounds/          # Audio files
├── main.ts              # Entry point
└── style.css            # Global styles
```

## Asset Requirements

See [ASSETS_NEEDED.md](./ASSETS_NEEDED.md) for detailed asset requirements.

### Required Assets

**Images** (14 sprites total):
- 7 Pastel Paws animal sprites (512x512 PNG)
- 7 Ocean Dreams animal sprites (512x512 PNG)

**Audio** (16 files total):
- 2 drop sound variations
- 7 tier-specific merge sounds
- Special sounds (Big Floof, danger, game over, high score)
- 3 UI click sounds
- 1 background music loop

Until assets are created, the game uses colored circles as placeholders.

## Gameplay

### Core Mechanics

1. **Drop Animals**: Tap/click to drop animals from the top
2. **Merge**: Two identical animals touching = merge into next tier
3. **Chain Reactions**: Merges can trigger more merges automatically
4. **Danger Line**: Don't let animals stay above the red line for 3+ seconds
5. **Big Floof**: Two Big Floofs merge and disappear (2500 points!)

### Scoring Multipliers

Score = Base Points × Combo × Risk × Quick

- **Combo**: Merge within 3s of previous merge to build combo (1.5x → 2x → 2.5x → 3x max)
- **Risk Zone**: Merge within 40px of danger line for 1.25x bonus
- **Quick Merge**: Merge animal within 0.8s of settling for 1.25x bonus
- **Chain Bonus**: Chain reactions extend combo window by 1s each

### Difficulty Scaling

As your score increases, larger animals spawn more frequently:
- 0-999: Mostly hamsters (50%)
- 1000-2499: More cats and shibas
- 2500-4999: Balanced distribution
- 5000-9999: Westies become common (17%)
- 10000+: Maximum difficulty (25% westies)

### Progression System

- **Daily Quests**: Rotate daily at midnight, award 3-5 stars
- **Lifetime Achievements**: Cumulative tracking across all games, award 1-5 stars
- **Theme Unlocking**: Earn 10 stars to unlock Ocean Dreams theme
- **High Scores**: Beat your personal best

## Development

### Key Design Patterns

- **Manager Pattern**: Separate managers for concerns (Animals, Scores, Quests, Themes, Audio)
- **Observer Pattern**: Callbacks for game events (merge, game over, quest complete)
- **Component Pattern**: Modular UI components
- **Persistence Layer**: Centralized storage utilities

### Performance Optimizations

The codebase includes several performance optimizations:

1. **Physics**: Fixed 60fps update loop with Matter.js Runner
2. **Rendering**: Separate rendering layer for sprites
3. **Audio**: Audio cloning for overlapping sound effects
4. **LocalStorage**: Batched saves with error handling
5. **Event Handling**: Debounced collision detection

### Browser Compatibility

Tested and compatible with:
- Chrome 90+ (mobile & desktop)
- Safari 14+ (iOS & macOS)
- Firefox 88+ (mobile & desktop)
- Edge 90+

### Mobile Optimizations

- Touch event handling with preventDefault
- Responsive viewport scaling
- Safe area insets for notched devices
- Portrait-first design (landscape supported)
- No zoom on double-tap

## Testing Checklist

### Core Gameplay
- [ ] Animals drop at cursor position
- [ ] Same-tier animals merge correctly
- [ ] All 7 tiers work (Hamster → Big Floof)
- [ ] Big Floofs disappear when merged
- [ ] Chain reactions trigger
- [ ] Score increments correctly
- [ ] Game over triggers after 3s above danger line
- [ ] High score persists

### Difficulty System
- [ ] Combo counter appears after first merge
- [ ] Combo multiplier increases with consecutive merges
- [ ] Combo decays after 3 seconds
- [ ] Chain reactions extend combo window
- [ ] Larger animals spawn more at higher scores
- [ ] Risk zone bonus applies near danger line
- [ ] Quick merge bonus applies for recently settled animals
- [ ] Score popups show bonus tags (COMBO, RISK, QUICK)

### Progression
- [ ] Daily quest appears and tracks progress
- [ ] Daily quest resets at midnight
- [ ] Quest completion awards stars
- [ ] Achievements track cumulative stats
- [ ] Reaching 10 stars unlocks Ocean Dreams
- [ ] Theme switching works instantly
- [ ] All progress persists across sessions

### UI/UX
- [ ] Score display updates in real-time
- [ ] Danger line appears and pulses
- [ ] Game over modal shows correctly
- [ ] Quest toast appears on completion
- [ ] Achievement screen displays all achievements
- [ ] Theme selector shows locked/unlocked themes
- [ ] Tutorial appears on first play only

### Technical
- [ ] Runs at 60fps on mobile
- [ ] Touch controls responsive
- [ ] No console errors
- [ ] LocalStorage works correctly
- [ ] Cross-browser compatible
- [ ] Responsive on various screen sizes

## Configuration

Game parameters can be adjusted in `src/utils/constants.ts`:

```typescript
export const GAME_CONFIG = {
  CONTAINER_WIDTH: 300,        // Container width
  CONTAINER_HEIGHT: 550,       // Container height
  GRAVITY: 2.2,                // Physics gravity
  FPS: 60,                     // Target framerate
  DANGER_LINE_Y: 120,          // Danger line position
  DANGER_TIME_THRESHOLD: 3000, // Time above line before game over
  QUEUE_SIZE: 2,               // Number of animals in queue
};

export const COMBO_CONFIG = {
  WINDOW_MS: 3000,             // Time between merges to maintain combo
  CHAIN_EXTENSION_MS: 1000,    // Extra time per chain reaction
  MULTIPLIERS: [1.0, 1.5, 2.0, 2.5, 3.0], // Multipliers by combo count
};

export const DIFFICULTY_CONFIG = [
  { minScore: 0, weights: { 0: 50, 1: 30, 2: 15, 3: 5 } },
  { minScore: 1000, weights: { 0: 40, 1: 35, 2: 18, 3: 7 } },
  // ... more tiers at 2500, 5000, 10000
];

export const RISK_ZONE_CONFIG = {
  DEPTH: 40,                   // Pixels below danger line
  BONUS_MULTIPLIER: 1.25,      // Score multiplier
};

export const QUICK_MERGE_CONFIG = {
  WINDOW_MS: 800,              // Time after settle to qualify
  BONUS_MULTIPLIER: 1.25,      // Score multiplier
};
```

## Future Enhancements

Potential features for future versions:

- **More Themes**: Space theme, Fantasy theme, Food theme
- **Power-ups**: Time slow, undo move, clear row
- **Multiplayer**: Competitive mode, leaderboards
- **Events**: Seasonal events with special themes
- **Customization**: Custom color schemes, backgrounds
- **Social Features**: Share scores, gift stars to friends
- **Sound Effects**: Audio feedback for combo, risk zone, quick merge

## License

© 2026 Punitto. All rights reserved.

## Credits

- **Physics**: Matter.js by Liam Brummitt
- **Fonts**: Fredoka & Quicksand from Google Fonts
- **Build Tool**: Vite by Evan You
- **Language**: TypeScript by Microsoft

---

Made with 💖 for kawaii animal lovers everywhere!
