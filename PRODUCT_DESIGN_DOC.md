# Punitto - Product Design Document

## Executive Summary

**Punitto** is a mobile-first web-based merge puzzle game inspired by Suika Game, featuring adorable spherical animals instead of fruits. Players drop cute animals into a container where identical animals merge into larger ones, with the goal of achieving the highest score without overflowing the container.

**Target Audience:** Primarily female players aged 16-35 who enjoy cute, casual mobile games (fans of Sanrio, kawaii culture, and games like Neko Atsume, Animal Restaurant)

**Core Appeal:** Satisfying merge mechanics + irresistibly cute animal designs + accessible one-handed mobile gameplay

---

## Game Overview

### High-Level Concept
A physics-based merge puzzle game where players drop spherical animals from the top of a container. When two identical animals touch, they merge into the next tier animal. The game ends when animals overflow past the danger line at the top.

### Animal Progression Chain (7 Tiers)
1. **Hamster** (Smallest) - Tiny, brown/beige
2. **Cat** - White/calico with pink accents
3. **Shiba** - Orange/cream, classic doge face
4. **Westie** - Pure white, perky ears, fluffy
5. **Husky** - Grey/white with blue eyes
6. **Samoyed** - Pure white, fluffy cloud
7. **Big Floof** (Largest) - Ultimate fluff ball (rainbow pastel shimmer)

**Special Rule:** When two Big Floofs merge, they disappear from the container with a magical sparkle effect and award massive bonus points, creating valuable space.

---

## Core Game Mechanics

### Dropping Mechanic
- **Control:** Player taps/clicks anywhere on screen to drop the current animal
- **Horizontal Control:** Move finger/cursor left-right along the top before dropping
- **Preview:** Shows the next 1-2 animals in queue
- **Drop Zones:** Animals can only be dropped from the top edge of the container
- **Physics:** Realistic gravity and collision using physics engine

### Merging Rules
- Two identical animals touching = instant merge into next tier
- Merge happens on contact with particle effects and cute sound
- Merged animal appears at the collision point
- Chain reactions possible (one merge triggering another)

### Game Over Condition
- **Danger Line:** Visible horizontal line near the top of container
- **Trigger:** If any animal remains above the danger line for 3 seconds
- **Warning:** Danger line glows red and pulses when animals are near/above it
- **Result:** Game over screen with final score, high score, and restart option

### Scoring System
- **Merge Points:** Each merge awards points based on tier created
  - Hamster merge: 10 points
  - Cat merge: 20 points
  - Shiba merge: 50 points
  - Westie merge: 100 points
  - Husky merge: 200 points
  - Samoyed merge: 500 points
  - Big Floof merge: 1000 points
  - Big Floof disappears: 2500 bonus points
- **Score Display:** Continuously visible during gameplay
- **High Score:** Persists in local storage

---

## Visual Design & Art Direction

### Art Style: Sanrio-Inspired Kawaii
**Reference Vibes:** Hello Kitty, Cinnamoroll, My Melody, Pusheen
- Ultra-cute, round, simplified animal designs
- Big sparkly eyes with highlight reflections
- Soft blush cheeks (two pink circles)
- Tiny simple features (dot nose, small smile)
- Smooth gradients within each sphere

### Color Palette: Soft & Feminine
**Primary Colors:**
- Soft Pink (#FFB6C1, #FFC0CB)
- Lavender (#E6E6FA, #DDA0DD)
- Baby Blue (#B0E0E6, #87CEEB)
- Mint Green (#C1FFC1, #98FB98)
- Peach (#FFDAB9, #FFE4B5)
- Cream (#FFFACD, #FFF8DC)

**Accent Colors:**
- White (#FFFFFF) - clean UI elements
- Light Gold (#FFD700) - sparkles and highlights
- Rose Gold (#B76E79) - premium touches

**NO:**
- Dark mode aesthetics
- Glassmorphism effects
- Vibrant neon gradients
- Techy/code vibes
- Sharp geometric shapes

**YES:**
- Soft rounded corners everywhere
- Subtle shadows and glows
- Hand-drawn style elements
- Sparkles, hearts, stars as decorative elements
- Pastel gradients (very subtle)

### Animal Design Specs
Each animal tier is a perfect sphere with:
- **Base Color:** Tier-specific pastel color
- **Face Elements:**
  - Two large round eyes (black dots with white shine)
  - Small pink blush circles on cheeks
  - Tiny features (ears, nose) that don't break the sphere shape much
  - Simple curved line for smile
- **Texture:** Soft gradient from lighter (top) to slightly darker (bottom)
- **Outline:** Very subtle, rounded stroke
- **Animations:**
  - Idle: Gentle breathing/squish animation
  - Drop: Slight squash on landing
  - Merge: Sparkle explosion, fade-out, pop-in of new tier

### Container Design
- **Shape:** Rounded rectangle (like a fish bowl or terrarium)
- **Material:** Soft white/cream with subtle gradient
- **Border:** Thick, rounded, slightly darker cream color
- **Background:** Very subtle pattern (tiny hearts, paw prints, or stars in barely-visible tint)
- **Danger Line:** Thin dashed line in soft red that pulses when triggered

---

## User Interface Design

### Main Game Screen
```
┌─────────────────────────┐
│     [Score Display]     │ ← Large, bubbly numbers
│                         │
│  [Next Animal Preview]  │ ← Cute bubble showing next 1-2
│                         │
├─────────────────────────┤
│      ╭─────────╮       │
│      │ DANGER  │       │ ← Dashed line
│      ├─────────┤       │
│      │    🐹   │       │
│      │         │       │
│      │  🐱  🐕 │       │ ← Game container
│      │🐕 🐕 🐱│       │
│      │🐱🐹🐕🐱│       │
│      ╰─────────╯       │
├─────────────────────────┤
│   [⚙️]  [🔊]  [❓]    │ ← Settings, Sound, Help
└─────────────────────────┘
```

### UI Elements
**Score Display:**
- Large, rounded bubbly font
- White text with soft shadow
- Pastel background circle
- Small "HIGH SCORE" text below current score

**Next Preview:**
- Circular bubble in top-right
- Shows 1-2 upcoming animals
- Labeled "NEXT" in cute font
- Gentle floating animation

**Buttons:**
- Fully rounded (pill-shaped)
- Soft shadows for depth
- Icons instead of text where possible
- Haptic feedback on tap (mobile)
- Gentle scale animation on press

**Game Over Screen:**
- Soft modal overlay (not harsh dark overlay)
- Rounded corner card
- "Game Over!" in cute handwritten-style font
- Final score large and centered
- "New High Score!" message if applicable (with sparkles)
- Restart button (large, prominent)
- Share button (optional)

**Tutorial Overlay:**
- Appears on first play
- Simple arrows and text
- "Tap to drop!" with pointing finger
- "Match 2 to merge!" with merge animation
- Dismissible with tap

---

## Sound Design

### Sound Effects
**Drop Sounds:**
- Soft "boop" on drop (pitch varies by animal size)
- Gentle bounce sounds (subtle, not annoying)

**Merge Sounds:**
- Satisfying "pling!" or chime on merge
- Higher pitch for smaller animals, lower for larger
- Each tier has slightly different tone

**Special Sounds:**
- Big Floof disappear: Magical "whoosh" + sparkle chime
- Danger warning: Gentle pulse/beep (not stressful)
- Game over: Soft descending chime (not harsh)

**UI Sounds:**
- Button tap: Soft click
- High score achieved: Victory jingle

### Background Music
- **Style:** Soft, gentle, lo-fi instrumental
- **Mood:** Calm, cute, non-intrusive
- **Loop:** Seamless 60-90 second loop
- **Volume:** Subtle, doesn't overpower SFX
- **Toggle:** Easy mute option in settings

---

## Technical Architecture

### Technology Stack

**Core Framework:**
- **HTML5 Canvas** for rendering
- **Matter.js** for 2D physics engine (realistic collisions and gravity)
- **Vanilla JavaScript/TypeScript** for game logic
- **Vite** for development and build tooling

**Why this stack:**
- Lightweight and fast (crucial for mobile)
- Matter.js provides excellent physics out-of-box
- No heavy framework overhead
- Easy to deploy as static site
- Full control over rendering and optimization

### Project Structure
```
punitto/
├── src/
│   ├── main.ts                 # Entry point
│   ├── game/
│   │   ├── Game.ts            # Main game controller
│   │   ├── AnimalManager.ts   # Handles animal spawning/merging
│   │   ├── PhysicsEngine.ts   # Matter.js wrapper
│   │   ├── ScoreManager.ts    # Scoring logic
│   │   ├── AudioManager.ts    # Sound effects & music
│   │   ├── QuestManager.ts    # Quest tracking and completion
│   │   └── StatsTracker.ts    # Track cumulative stats
│   ├── ui/
│   │   ├── GameUI.ts          # UI overlay management
│   │   ├── ScoreDisplay.ts
│   │   ├── Modal.ts           # Game over, settings modals
│   │   ├── QuestToast.ts      # Quest completion notifications
│   │   ├── AchievementScreen.ts  # Achievements UI
│   │   └── ThemeSelector.ts   # Theme selection screen
│   ├── entities/
│   │   ├── Animal.ts          # Animal class
│   │   └── Container.ts       # Game container
│   ├── progression/
│   │   ├── quests.ts          # Quest definitions
│   │   ├── achievements.ts    # Achievement definitions
│   │   └── themes.ts          # Theme definitions
│   ├── utils/
│   │   ├── constants.ts       # Game constants
│   │   └── storage.ts         # Local storage helpers
│   └── assets/
│       ├── images/
│       │   ├── pastelPaws/    # Default theme sprites
│       │   └── oceanDreams/   # Ocean theme sprites
│       ├── sounds/            # SFX and music
│       └── fonts/             # Custom fonts
├── public/
│   └── index.html
└── package.json
```

### Key Technical Features

**Responsive Design:**
- Mobile-first approach (320px minimum width)
- Automatically scales to screen size
- Maintains aspect ratio
- Works landscape and portrait (portrait preferred)
- Desktop support (centered, max-width)

**Performance Optimizations:**
- Canvas rendering with sprite batching
- Limit physics calculations to 60fps
- Throttle particle effects on lower-end devices
- Lazy load sounds
- Minimal DOM manipulation

**Data Persistence:**
- LocalStorage for high score
- Settings preferences (sound on/off, music volume)
- First-time tutorial flag

**PWA Features (Future Enhancement):**
- Installable to home screen
- Offline play capability
- App-like experience

---

## Quest System & Progression

### Overview
Quests give players short and long-term goals beyond high scores, creating engagement loops and rewarding skill development. Completing quests earns stars, which unlock new animal themes.

### Quest Types

**Daily Quests (1 new quest every 24 hours):**
- Available for 24 hours from when it appears
- Rewards: 3 stars upon completion
- Only one daily quest active at a time
- Resets at midnight local time

**Lifetime Achievements:**
- Always available, track progress across all games
- One-time completion rewards
- Rewards: 1-5 stars based on difficulty
- Displayed in achievements gallery

### Quest Design Philosophy
- **Mix of difficulty:** Easy (80% success rate), Medium (40%), Hard (10%)
- **Mix of scope:** Per-game challenges + cumulative progress
- **Clear tracking:** Always show progress (3/5 Westies merged)
- **Achievable:** Never require pure luck, always skill-based or grindable

### Quest Examples

**Daily Quests Pool:**

*Easy (Per-Game):*
- "Merge Mania" - Create 15 merges in one game
- "Cat Collector" - Create 5 Cats in one game
- "Steady Pace" - Play a game lasting 3+ minutes
- "Small Start" - Score 2000+ points

*Medium (Per-Game):*
- "Fluffy Focus" - Create 3 Westies in one game
- "Chain Master" - Trigger a 3-merge chain reaction
- "High Achiever" - Score 5000+ points
- "Dog Lover" - Create one of each dog type in one game (Shiba, Westie, Husky, Samoyed)

*Hard (Per-Game):*
- "Perfection" - Trigger a 5+ merge chain reaction
- "Floof Hunter" - Create 2 Big Floofs in one game
- "Elite Score" - Score 10,000+ points
- "Danger Zone" - Win a game after triggering danger warning 3+ times

**Lifetime Achievements:**

*Tier 1 (1 star each):*
- "First Steps" - Complete your first game
- "Baby Floof" - Create your first Big Floof
- "Dedicated" - Play 10 games
- "Century" - Score 100+ points in one game

*Tier 2 (3 stars each):*
- "Hamster Hoarder" - Create 100 Hamsters (cumulative across all games)
- "Cat Lady" - Create 50 Cats (cumulative)
- "Shiba Squad" - Create 30 Shibas (cumulative)
- "Westie Warrior" - Create 20 Westies (cumulative)
- "Perfect 10" - Score 10,000+ in one game
- "Marathon Runner" - Play 50 games total

*Tier 3 (5 stars each):*
- "Floof Master" - Create 10 Big Floofs (cumulative)
- "Chain Legend" - Trigger 20 chain reactions of 3+ merges (cumulative)
- "Elite Player" - Score 15,000+ in one game
- "Completionist" - Complete all other achievements

### Star System & Unlocks

**Star Currency:**
- Earned by completing quests and achievements
- Persistent, never lost
- Used to unlock new themes
- Total stars displayed in achievements screen

**Unlock Tiers:**
- **Default:** Pastel Paws theme (included, 0 stars)
- **Tier 1:** 10 stars - Unlock 1st new theme
- **Tier 2:** 30 stars - Unlock 2nd new theme
- **Tier 3:** 60 stars - Unlock 3rd new theme
- **Future:** More themes at higher star counts

### Theme System

**What is a Theme?**
A complete reskin of all 7 animals with a cohesive aesthetic. Container and UI colors also adjust to match theme.

**MVP Theme: Ocean Dreams (10 stars to unlock)**

Animal progression:
1. **Seahorse** (Tier 1) - Tiny, soft pink
2. **Jellyfish** (Tier 2) - Translucent lavender with gentle tentacles
3. **Clownfish** (Tier 3) - Orange and white stripes
4. **Pufferfish** (Tier 4) - Round, white with spots
5. **Dolphin** (Tier 5) - Grey/silver, friendly smile
6. **Orca** (Tier 6) - Black and white, majestic
7. **Ocean Spirit** (Tier 7) - Shimmering blue/purple/teal ethereal being

Container: Underwater gradient (deep blue at bottom, lighter blue at top)
Background pattern: Tiny bubbles and seaweed silhouettes
UI colors: Ocean blues and teals

**Future Theme Ideas:**
- Space Explorers (planets, stars, cosmic objects)
- Sweet Treats (desserts and pastries)
- Enchanted Forest (magical creatures)
- Garden Party (flowers and bugs)

### UI Elements

**Quest Indicator (Top of screen):**
```
┌─────────────────────────┐
│ Score: 2847             │
│ Daily: [⭐ 2/3 Westies] │ ← Compact quest progress
│                         │
```

**Achievements Button:**
- Trophy icon (🏆) in bottom navigation
- Shows badge with number of uncompleted quests/achievements
- Tapping opens achievements screen

**Achievements Screen:**
```
┌─────────────────────────┐
│    ACHIEVEMENTS 🏆      │
│   ⭐ 23 Stars Earned    │
├─────────────────────────┤
│ DAILY QUEST             │
│ ┌─────────────────────┐ │
│ │ Fluffy Focus        │ │
│ │ Create 3 Westies    │ │
│ │ Progress: 2/3 🐕    │ │
│ │ Reward: ⭐⭐⭐       │ │
│ └─────────────────────┘ │
│                         │
│ LIFETIME ACHIEVEMENTS   │
│ ┌─────────────────────┐ │
│ │ ✓ First Steps    1⭐ │ │
│ │ ✓ Baby Floof     1⭐ │ │
│ │ □ Hamster Hoarder 3⭐│ │
│ │   Progress: 45/100  │ │
│ │ □ Perfect 10     3⭐ │ │
│ └─────────────────────┘ │
│                         │
│ [View Themes 🎨]        │
└─────────────────────────┘
```

**Theme Selection Screen:**
```
┌─────────────────────────┐
│      THEMES 🎨          │
│   ⭐ 23 / 10 needed     │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ ✓ PASTEL PAWS       │ │ ← Currently active
│ │ [Preview animals]   │ │
│ │ Default theme       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ OCEAN DREAMS      │ │
│ │ [Preview animals]   │ │
│ │ [SELECT] button     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🔒 SPACE EXPLORERS  │ │
│ │ [Locked preview]    │ │
│ │ Unlock: 30 ⭐       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Quest Completion Flow

**In-Game Quest Complete:**
1. Player merges 3rd Westie (completing daily quest)
2. Cute toast appears: "Quest Complete! ✨ Fluffy Focus +3⭐"
3. Sparkle animation
4. Continue playing

**Post-Game Quest Complete:**
1. Game ends
2. Score screen shows as normal
3. If quest(s) completed during that game, show them:
   - "Quest Complete! Fluffy Focus +3⭐"
4. If this pushed player over unlock threshold, transition to...

**Theme Unlock Celebration:**
1. Full-screen sparkle animation
2. Large modal appears:
   ```
   ✨ NEW THEME UNLOCKED! ✨

   OCEAN DREAMS

   [Preview showing all 7 ocean animals]

   Seahorse → Jellyfish → Clownfish →
   Pufferfish → Dolphin → Orca → Ocean Spirit

   [TRY IT NOW]  [LATER]
   ```
3. If "TRY IT NOW" → theme activates, return to game screen
4. If "LATER" → theme saved as unlocked, return to game screen

**Achievement Unlock (during game):**
- Small toast notification
- "Achievement! 🏆 Hamster Hoarder +3⭐"
- Does NOT interrupt gameplay

### Data Persistence

**LocalStorage Schema:**
```json
{
  "highScore": 15000,
  "stats": {
    "gamesPlayed": 47,
    "totalHamstersCreated": 156,
    "totalCatsCreated": 89,
    // ... other cumulative stats
  },
  "quests": {
    "dailyQuest": {
      "id": "fluffyFocus",
      "progress": 2,
      "target": 3,
      "expiresAt": "2026-01-27T00:00:00Z"
    },
    "completedDailies": ["catCollector", "mergemania", ...]
  },
  "achievements": {
    "firstSteps": { "completed": true, "completedAt": "..." },
    "hamsterHoarder": { "completed": false, "progress": 45 }
  },
  "stars": 23,
  "unlockedThemes": ["pastelPaws", "oceanDreams"],
  "activeTheme": "oceanDreams",
  "settings": {
    "soundEnabled": true,
    "musicEnabled": true
  }
}
```

### Balancing Considerations

**Star Economy:**
- Average player should unlock first theme (10 stars) within 5-7 games
- Complete tutorial achievements immediately: ~3 stars
- First daily quest: +3 stars
- 2-3 more lifetime achievements in first session: ~4-6 stars
- **Result:** Motivated players can unlock Ocean theme in first sitting

**Daily Quest Difficulty Distribution:**
- 40% Easy quests (most players complete)
- 40% Medium quests (50/50 completion rate)
- 20% Hard quests (aspirational, high skill)

**Lifetime Achievement Pacing:**
- Tier 1: Unlocked in first 1-5 games
- Tier 2: Unlocked across 10-50 games
- Tier 3: Aspirational, 100+ games

### Why This System Works

1. **Immediate goals:** Daily quest gives clear objective for today
2. **Long-term progress:** Lifetime achievements reward dedication
3. **Tangible rewards:** Stars → themes is concrete and visual
4. **No FOMO:** Missed daily quests don't permanently harm progress
5. **Skill + time:** Mix of challenges rewards both skill and engagement
6. **Collection appeal:** "Gotta unlock all themes" drives retention
7. **Doesn't break core:** Pure merge gameplay unchanged, quests layer on top

---

## MVP Feature Checklist

### Core Gameplay ✓
- [x] Physics-based animal dropping
- [x] Merge mechanic (2 identical → next tier)
- [x] 7-tier animal progression
- [x] Container with danger line
- [x] Game over detection and screen
- [x] Scoring system

### UI/UX ✓
- [x] Score display (current + high score)
- [x] Next animal preview (1-2 animals)
- [x] Responsive mobile-first design
- [x] Game over modal with restart
- [x] Tutorial overlay (first-time play)
- [x] Settings panel (sound toggle)

### Audio ✓
- [x] Drop sound effects
- [x] Merge sound effects (tier-specific)
- [x] Big Floof disappear special sound
- [x] Background music (looping)
- [x] Sound toggle controls

### Visual Polish ✓
- [x] Particle effects on merge
- [x] Sparkle effect on Big Floof disappear
- [x] Animal squash/bounce animations
- [x] Danger line warning animation
- [x] Smooth UI transitions

### Technical ✓
- [x] LocalStorage for high score
- [x] Touch controls (mobile)
- [x] Mouse controls (desktop)
- [x] Performance optimization for mobile
- [x] Cross-browser compatibility

### Progression System ✓
- [x] Daily quest system (1 quest per day)
- [x] Lifetime achievements (8-10 achievements)
- [x] Star currency and tracking
- [x] Quest progress display (in-game toast)
- [x] Achievements screen UI
- [x] Theme unlock system
- [x] Theme selection screen with previews
- [x] Ocean Dreams theme (first unlockable)
- [x] Theme unlock celebration modal
- [x] Cumulative stat tracking

---

## User Flow

### First-Time User
1. Lands on game screen
2. Sees tutorial overlay: "Tap to drop! Match 2 to merge!"
3. Taps to dismiss tutorial
4. Plays first game, learns mechanics
5. Reaches game over
6. Sees score, prompted to restart

### Returning User
1. Lands on game screen (no tutorial)
2. Sees high score + daily quest indicator
3. Checks achievements screen to see progress
4. Starts dropping animals with quest in mind
5. Completes quest mid-game → cute toast appears
6. Game over → sees score + quest completion summary
7. If unlocked new theme → celebration modal appears
8. Restarts with new theme or continues grinding for next unlock

### Quest-Driven User
1. Logs in, sees daily quest: "Create 3 Westies"
2. Plays strategically to complete quest
3. Completes quest mid-game → toast notification
4. Finishes game, sees "+3⭐" on game over screen
5. Opens achievements screen → "13/10 stars for Ocean Dreams!"
6. Plays one more game to reach 10 stars
7. Game ends → "NEW THEME UNLOCKED!" celebration
8. Previews Ocean Dreams animals → "TRY IT NOW"
9. Next game starts with beautiful ocean creatures
10. Shares screenshot on social media

### Gameplay Loop
```
Drop animal →
  Physics settle →
    Merge triggered? →
      Yes: Merge animation + points + check for chains →
        → Update quest progress if applicable →
      No: Wait for next drop →
    Above danger line? →
      Yes: 3-second countdown → Game Over →
        → Show quest completion summary if any →
      No: Continue
```

---

## Success Metrics (Personal Project)

Even for a personal project, these are good goals:

**Engagement:**
- Average session length: 5-10 minutes (increased due to quests)
- Games per session: 3-5
- Return rate: Daily (to check new daily quest)
- Quest completion rate: 60%+ for daily quests
- Theme unlock rate: 80%+ of players unlock Ocean Dreams

**Technical:**
- Loads in under 2 seconds on 4G mobile
- Runs at 60fps on mid-range phones
- No crashes or game-breaking bugs
- Theme switching is instant with no lag

**Progression:**
- First theme unlocked within first 1-2 sessions
- At least 3 achievements unlocked in first session
- Daily quest completion feels achievable but not trivial

**User Feedback:**
- "This is so cute!"
- "One more game to unlock the ocean theme!"
- "I just completed my daily quest!"
- Easy to understand without reading instructions
- Feels satisfying to play and progress

---

## Future Enhancements (Post-MVP)

These can be added after the core game is complete and tested:

### Phase 2 Features
- **Additional themes:** Space Explorers, Sweet Treats, Enchanted Forest
- **Weekly challenges:** Special weekly quests with bigger rewards
- **Animal collection book:** Gallery showing all animals you've created with stats
- **Share score:** Generate cute share image for social media with current theme
- **Quest history:** View all completed quests and track streaks
- **More achievements:** Expand to 30+ lifetime achievements

### Phase 3 Features
- **Combo system:** Score multiplier for consecutive merges within time window
- **Container customization:** Unlock different container shapes/backgrounds
- **Leaderboard:** Online high scores (requires backend)
- **Social features:** Friend challenges, compare progress
- **Seasonal events:** Limited-time themes and quests
- **Sound packs:** Unlock different sound effect sets to match themes

---

## Development Timeline Estimate

**Week 1: Core Setup**
- Project scaffolding with Vite + TypeScript
- Matter.js integration and basic physics
- Animal dropping mechanic
- Container and boundaries

**Week 2: Game Logic**
- Merge detection and logic
- Scoring system
- Game over detection
- LocalStorage integration
- Stats tracking system

**Week 3: Visual Design (Pastel Paws Theme)**
- Create/source animal sprites (7 tiers)
- UI design and implementation
- Animations and particle effects
- Responsive layout

**Week 4: Progression System**
- Quest system implementation
- Achievement tracking
- Theme system architecture
- Achievements screen UI
- Theme selector UI
- Quest toast notifications

**Week 5: Ocean Dreams Theme**
- Create/source ocean animal sprites (7 tiers)
- Theme unlock celebration modal
- Theme switching logic
- Test both themes thoroughly

**Week 6: Polish & Audio**
- Sound effects and music
- Tutorial overlay
- Settings panel
- Quest completion animations
- Bug fixes and optimization

**Week 7: Testing & Deployment**
- Cross-device testing
- Performance optimization
- Quest balancing (adjust star rewards if needed)
- Deploy to hosting (Vercel, Netlify, etc.)
- Gather feedback

---

## Art Asset Requirements

### Animal Sprites

**Format Requirements:**
- **Idle state:** 512x512px PNG with transparency
- **Design:** Perfect circle with cute face
- **Variations:** Optional - slightly different expressions (happy when merged, worried near danger)

**Total Sprites Needed for MVP:** 14 animals (7 for Pastel Paws theme + 7 for Ocean Dreams theme)

---

### Theme 1: Pastel Paws (Default)

**Tier 1 - Hamster:**
- Size multiplier: 1x (base size)
- Color: Soft brown/beige (#D2B48C)
- Features: Tiny ears, pink nose, big eyes

**Tier 2 - Cat:**
- Size multiplier: 1.3x
- Color: White with pink details (#FFF5EE)
- Features: Triangle ears, pink nose, whiskers

**Tier 3 - Shiba:**
- Size multiplier: 1.6x
- Color: Orange/cream (#FFA500)
- Features: Pointy ears, black nose, doge smile

**Tier 4 - Westie:**
- Size multiplier: 2x
- Color: Pure white with slight cream tint (#FFFFF0)
- Features: Perky triangle ears, black button nose, fluffy texture

**Tier 5 - Husky:**
- Size multiplier: 2.5x
- Color: Grey/white with blue eyes (#A9A9A9)
- Features: Fluffy, distinct face markings

**Tier 6 - Samoyed:**
- Size multiplier: 3x
- Color: Pure white (#FFFFFF)
- Features: Ultra fluffy, constant smile, cloud-like

**Tier 7 - Big Floof:**
- Size multiplier: 3.5x
- Color: Pastel rainbow shimmer (#FFB6C1 → #E6E6FA → #B0E0E6)
- Features: Maximum fluff, sparkle effects, otherworldly

---

### Theme 2: Ocean Dreams (Unlockable - 10 stars)

**Tier 1 - Seahorse:**
- Size multiplier: 1x (base size)
- Color: Soft pink/coral (#FFB6C1)
- Features: Curled tail, tiny dorsal fin, cute snout

**Tier 2 - Jellyfish:**
- Size multiplier: 1.3x
- Color: Translucent lavender (#E6E6FA)
- Features: Bell-shaped top, wispy tentacles at bottom, bioluminescent glow

**Tier 3 - Clownfish:**
- Size multiplier: 1.6x
- Color: Orange with white stripes (#FF8C00, #FFFFFF)
- Features: Three white bands, small fins, happy expression

**Tier 4 - Pufferfish:**
- Size multiplier: 2x
- Color: White/cream with small spots (#FFFAF0)
- Features: Round puffed shape, tiny spikes, surprised expression

**Tier 5 - Dolphin:**
- Size multiplier: 2.5x
- Color: Grey/silver gradient (#A9A9A9)
- Features: Friendly smile, dorsal fin, smooth texture

**Tier 6 - Orca:**
- Size multiplier: 3x
- Color: Black and white (#000000, #FFFFFF)
- Features: Distinctive black/white pattern, white eye patches, majestic

**Tier 7 - Ocean Spirit:**
- Size multiplier: 3.5x
- Color: Ethereal blue/purple/teal shimmer (#4682B4 → #9370DB → #20B2AA)
- Features: Flowing water-like texture, sparkles, mystical aura, hints of all previous ocean creatures

---

### UI Elements
- Button backgrounds (rounded rectangles)
- Container sprite/gradient
- Particle sprites (hearts, stars, sparkles)
- Tutorial arrows/pointers
- Font files (cute rounded font)

### Audio Assets
- 7x merge sounds (different pitches)
- 2x drop sounds
- 1x Big Floof disappear sound
- 1x danger warning sound
- 1x game over sound
- 3x UI click sounds
- 1x background music loop (90 seconds)

---

## Accessibility Considerations

- **Sound:** Always provide visual feedback alongside audio
- **Color:** Don't rely solely on color (danger line also pulses)
- **Touch targets:** Minimum 44x44px for all buttons
- **Text:** Readable font sizes (minimum 16px)
- **Contrast:** Ensure text meets WCAG AA standards
- **Reduced motion:** Option to disable animations (future)

---

## Risk Mitigation

**Physics instability:**
- Test Matter.js thoroughly with edge cases
- Add boundary constraints to prevent escapes
- Cap maximum velocity for animals

**Performance on low-end devices:**
- Test on older phones (iPhone 8, budget Android)
- Reduce particle effects if FPS drops
- Optimize sprite rendering

**Unclear mechanics:**
- Comprehensive tutorial
- Visual feedback for all actions
- Playtest with people unfamiliar with Suika

**Scope creep:**
- Focus on MVP features first
- Resist adding features mid-development
- Keep "Future Enhancements" list for later

---

## Conclusion

Punitto is a focused, polished mobile game that combines the addictive merge mechanics of Suika Game with an irresistibly cute kawaii aesthetic, enhanced by a rewarding quest and progression system. Targeted at female players who love adorable, casual games with meaningful progression, Punitto offers both immediate satisfaction and long-term engagement.

The quest system transforms casual play into goal-driven sessions, while unlockable themes provide tangible, visual rewards that keep players coming back. The mobile-first approach, combined with modern web technologies, ensures the game is accessible, performant, and easy to share.

Starting with a solid MVP that includes both core gameplay AND progression systems ensures players stay engaged beyond the initial novelty. The two-theme system (Pastel Paws + Ocean Dreams) proves the unlock mechanism works and gives players an immediate goal to work toward.

**Core Pillars:**
1. **Cute Above All** - Every design decision prioritizes kawaii aesthetic
2. **Satisfying Merges** - Physics, sound, and visuals combine for perfect feedback
3. **Meaningful Progress** - Quests and unlockables give every game purpose
4. **Mobile-First** - Optimized for one-handed portrait play
5. **Pure Core, Rich Meta** - Simple merge mechanic with engaging progression layer

**The Hook:**
"Merge adorable animals, complete daily quests, unlock magical new themes. It's cute, it's satisfying, and there's always something new to work toward."

Let's make something adorable! 🐹✨
