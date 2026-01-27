# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm install          # Install dependencies (requires Node.js 18+)
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build

# Deployment
git push origin main # Auto-deploys to Vercel on push
```

## Architecture Overview

### Core Game Loop
The game uses a **Manager Pattern** architecture where `Game.ts` orchestrates all subsystems:

- **PhysicsEngine**: Wrapper around Matter.js with fixed 60fps update loop
- **AnimalManager**: Spawns animals, manages queue (next 2 animals), tracks all active animals
- **ScoreManager**: Handles scoring and high score persistence to LocalStorage
- **Container**: Creates static physics walls (left, right, bottom) to contain animals

**Key Flow**:
1. User clicks/taps → `Game.handleInput()` → `AnimalManager.spawnAnimal()`
2. Matter.js collision event → `Game.handleCollision()` → `Game.mergeAnimals()`
3. Merge creates new tier animal at midpoint, removes old ones
4. Chain reactions detected recursively in `Game.checkChainReactions()`

### Animal System (7 Tiers)
Defined in `src/utils/constants.ts`:
- Tier 0-3: **Spawnable** (Hamster, Cat, Shiba, Westie) - weighted random spawn
- Tier 4-5: **Mergeable only** (Husky, Samoyed)
- Tier 6: **Big Floof** - special behavior: two merge → disappear (clears space, awards 2500 points)

Each tier has:
- `scale`: Size multiplier (1.0x to 3.5x)
- `score`: Points awarded on merge (10 to 1000)
- Sprite path in theme system

### Merge Detection
Uses Matter.js collision events with deduplication:
1. Collision detected between two animals
2. Check if same tier via `Animal.canMergeWith()`
3. Create unique pair ID (sorted) and store in `mergePairs` Set
4. Delay merge 100ms for physics stability
5. Remove both animals, spawn next tier at midpoint
6. Recursively check for chain reactions

### Progression System
**Three interconnected systems**:

1. **StatsTracker** (`src/game/StatsTracker.ts`):
   - Tracks cumulative stats across all games
   - Persists to LocalStorage: `gamesPlayed`, `totalMerges`, `animalsCreated[tier]`, `chainReactions`, etc.

2. **QuestManager** (`src/game/QuestManager.ts`):
   - Daily quest rotates at midnight (compares ISO date strings)
   - Tracks progress for current game session
   - Awards stars on completion (3-5 stars per quest)
   - Checks achievements against cumulative stats

3. **Quests/Achievements** (`src/progression/`):
   - `quests.ts`: 12 daily quests (easy/medium/hard)
   - `achievements.ts`: 15 lifetime achievements (1-5 stars each)
   - Both award stars which unlock themes

### Theme System
**Two-part architecture**:

1. **Theme Definitions** (`src/progression/themes.ts`):
   - Each theme has 7 animal sprites (one per tier)
   - Colors for container, UI, text
   - `unlockRequirement`: Stars needed (0 = default, 10 = Ocean Dreams)

2. **ThemeManager** (`src/game/ThemeManager.ts`):
   - Loads active theme from LocalStorage
   - Checks star count to unlock new themes
   - Triggers unlock celebration modal
   - Theme switching updates `SpriteLoader` paths

**Asset Loading**:
- Sprites must be in `public/assets/images/{themeName}/`
- Paths in themes.ts use `/assets/...` (served as static by Vite)
- `SpriteLoader.ts` handles async loading with fallback to colored circles

### UI System
**Component-based architecture** with separation of concerns:

- **GameUI** (`src/ui/GameUI.ts`): Main orchestrator
  - Owns ScoreDisplay, Modal, danger line element
  - Updates every 100ms (score, danger line state)
  - Registers game over callback

- **Modal** (`src/ui/Modal.ts`): Reusable modal system
  - `show(title, body, buttons)` - generic method
  - `showGameOver()` - specialized for game over with score/high score

- **QuestToast** (`src/ui/QuestToast.ts`): Non-blocking notifications
  - Auto-dismisses after 3 seconds
  - Stacks multiple toasts vertically

- **AchievementScreen** (`src/ui/AchievementScreen.ts`): Full-screen overlay
  - Renders daily quest with progress bar
  - Lists all achievements (completed + in-progress)
  - "View Themes" button navigates to ThemeSelector

### LocalStorage Persistence
Centralized in `src/utils/storage.ts`:

**Storage Keys**:
- `punitto_high_score`: Number
- `punitto_stats`: GameStats object (cumulative)
- `punitto_daily_quest`: QuestState object with ISO date
- `punitto_achievements`: Array of AchievementState
- `punitto_active_theme`: Theme ID string
- `punitto_total_stars`: Number
- `punitto_settings`: {soundEnabled, musicEnabled}
- `punitto_tutorial_shown`: Boolean flag

**Important**: All saves are wrapped in try/catch for localStorage unavailability (private browsing, quota exceeded).

### Danger Line Mechanism
Implemented in `Game.ts`:
1. `checkDangerLine()` runs every 100ms via setInterval
2. Checks if any animal's top edge (y - radius) is above `GAME_CONFIG.DANGER_LINE_Y`
3. If yes: starts timer, sets `dangerStartTime`
4. If timer exceeds 3000ms: triggers `triggerGameOver()`
5. Visual feedback: danger line pulses red, opacity increases with progress

### Physics Configuration
Matter.js settings in `PhysicsEngine.ts`:
- Gravity: `{x: 0, y: 1.0, scale: 0.001}`
- Fixed timestep: `1000 / 60` (60fps)
- Restitution (bounce): 0.3
- Friction: 0.5
- Density: 0.001 (prevents animals from being too heavy)

### Critical File Dependencies

**Game.ts** depends on:
- PhysicsEngine, Container, AnimalManager, ScoreManager
- Imports GAME_CONFIG for danger line threshold

**Main.ts** initializes:
- Creates Game instance
- Creates GameUI instance (which registers callbacks)
- Starts the game loop

**Adding new animals**:
1. Update `ANIMAL_TIERS` in constants.ts
2. Add sprite to `public/assets/images/pastelPaws/`
3. Update theme definition in `themes.ts`
4. Adjust `SPAWN_WEIGHTS` if spawnable tier

**Adding new quests**:
1. Add to `DAILY_QUESTS` array in `quests.ts`
2. Implement progress tracking in `QuestManager.updateQuestProgress()`
3. Ensure stats are tracked in `StatsTracker.ts`

## TypeScript Strict Mode

This project uses **strict TypeScript** with additional checks:
- `noUnusedLocals: true`
- `noUnusedParameters: true` (prefix unused params with `_`)
- `noUncheckedIndexedAccess: true` (array access returns `T | undefined`)

When accessing arrays/objects, always check for undefined:
```typescript
const tier = ANIMAL_TIERS[index]; // tier is AnimalTier | undefined
if (!tier) return; // Guard required
```

## Asset Management

**Image Assets**:
- Location: `public/assets/images/{themeName}/{animalName}.png`
- Format: PNG with transparency, square (any size, 512x512+ recommended)
- Browser automatically scales, so larger = better quality

**Audio Assets** (not yet implemented):
- Location: `public/assets/sounds/`
- AudioManager.ts has structure ready, needs actual files

**Adding New Theme**:
1. Create folder: `public/assets/images/{newTheme}/`
2. Add 7 sprites (hamster through bigFloof)
3. Define theme in `themes.ts` with sprite paths
4. Set `unlockRequirement` (star count)
5. Update `ALL_THEMES` array

## Deployment

**Vercel Auto-Deploy**:
- Every push to `main` triggers production deployment
- Build command: `npm run build` (defined in vercel.json)
- Output directory: `dist/`
- Framework preset: Vite (auto-detected)

**Build Requirements**:
- All TypeScript must compile without errors
- No unused variables/parameters (will fail build)
- Assets in `public/` folder are served at root (`/assets/...`)

## Game Balance Tuning

Edit `src/utils/constants.ts`:
- `CONTAINER_WIDTH/HEIGHT`: Adjust play area size
- `GRAVITY`: Lower = slower fall (easier), higher = faster (harder)
- `DANGER_LINE_Y`: Higher = more space (easier)
- `DANGER_TIME_THRESHOLD`: Longer = easier
- `SPAWN_WEIGHTS`: Adjust tier 0-3 probabilities
- `ANIMAL_TIERS[n].score`: Adjust points for each merge

## Common Patterns

**Adding new Manager**:
1. Create in `src/game/{Name}Manager.ts`
2. Instantiate in `Game.ts` constructor
3. Use observer pattern for events (callbacks)

**Adding new UI Component**:
1. Create in `src/ui/{Name}.ts`
2. Export class with `show()` and `hide()` methods
3. Instantiate in `GameUI.ts` or as needed
4. Add styles to `src/style.css`

**Triggering Events**:
```typescript
// In manager
private onEventCallback: ((data: T) => void) | null = null;
setOnEventCallback(cb: (data: T) => void) { this.onEventCallback = cb; }
// Trigger: if (this.onEventCallback) this.onEventCallback(data);

// In Game.ts or UI
manager.setOnEventCallback((data) => { /* handle */ });
```
