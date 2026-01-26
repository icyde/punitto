# Assets Needed for Punitto

This document outlines all the visual and audio assets that need to be created for the game.

## Image Assets

### Pastel Paws Theme (Priority: High)
All sprites should be **512x512px PNG** with transparency.
Style: Kawaii/Sanrio-inspired with big eyes, blush cheeks, soft gradients.

**Required sprites:**
1. `/src/assets/images/pastelPaws/hamster.png` - Cute pink/peach hamster
2. `/src/assets/images/pastelPaws/cat.png` - Adorable cat (larger than hamster)
3. `/src/assets/images/pastelPaws/shiba.png` - Shiba Inu dog
4. `/src/assets/images/pastelPaws/westie.png` - West Highland Terrier
5. `/src/assets/images/pastelPaws/husky.png` - Husky dog (larger)
6. `/src/assets/images/pastelPaws/samoyed.png` - Fluffy Samoyed (even larger)
7. `/src/assets/images/pastelPaws/bigFloof.png` - Magical ultimate floof (largest)

**Size scaling reference:**
- Hamster: 1.0x (base size)
- Cat: 1.3x
- Shiba: 1.6x
- Westie: 2.0x
- Husky: 2.5x
- Samoyed: 3.0x
- Big Floof: 3.5x

### Ocean Dreams Theme (Priority: Medium)
Same format: **512x512px PNG** with transparency.
Style: Underwater creatures with soft, dreamy aesthetic.

**Required sprites:**
1. `/src/assets/images/oceanDreams/seahorse.png`
2. `/src/assets/images/oceanDreams/jellyfish.png`
3. `/src/assets/images/oceanDreams/clownfish.png`
4. `/src/assets/images/oceanDreams/pufferfish.png`
5. `/src/assets/images/oceanDreams/dolphin.png`
6. `/src/assets/images/oceanDreams/orca.png`
7. `/src/assets/images/oceanDreams/oceanSpirit.png`

## Audio Assets (Phase 7)

### Sound Effects
Format: MP3, short duration (< 1 second for most)

**Drop sounds:**
- `/src/assets/sounds/drop1.mp3` - Soft "boop" sound
- `/src/assets/sounds/drop2.mp3` - Variation of drop sound

**Merge sounds (tier-specific pitches):**
- `/src/assets/sounds/merge-tier0.mp3` through `/src/assets/sounds/merge-tier6.mp3`
- Each should have progressively lower/higher pitch

**Special sounds:**
- `/src/assets/sounds/bigFloof.mp3` - Magical whoosh + chime
- `/src/assets/sounds/danger.mp3` - Gentle warning pulse
- `/src/assets/sounds/gameOver.mp3` - Soft descending chime
- `/src/assets/sounds/highScore.mp3` - Victory jingle

**UI sounds:**
- `/src/assets/sounds/click1.mp3` through `/src/assets/sounds/click3.mp3`

### Background Music
- `/src/assets/sounds/bgMusic.mp3` - 60-90 second lo-fi loop, seamless

## Asset Creation Options

### Images
1. **AI Generation**: Use DALL-E, Midjourney, or Stable Diffusion
   - Prompt example: "kawaii cute hamster character, pastel pink colors, big eyes, blush cheeks, chibi style, transparent background, 512x512"

2. **Commission Artist**: Find kawaii-style artists on Fiverr, ArtStation, or Twitter

3. **Stock Assets**: Search for kawaii/chibi animal sprites on asset stores

### Audio
1. **Free Sources**:
   - freesound.org - Sound effects
   - pixabay.com - Music and SFX
   - YouTube Audio Library - Background music

2. **Generate**: Use tools like jsfxr.com for game sound effects

3. **Commission**: Hire audio designer on Fiverr or Upwork

## Temporary Placeholders

Until real assets are created, the game uses:
- **Images**: Colored circles with tier numbers (currently implemented)
- **Audio**: Silent/no audio (will be implemented in Phase 7)

## Implementation Status

- [ ] Pastel Paws sprites (0/7)
- [ ] Ocean Dreams sprites (0/7)
- [ ] Sound effects (0/15)
- [ ] Background music (0/1)

Once assets are created, simply place them in the specified paths and the game will automatically load them.
