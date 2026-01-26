# Punitto Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

First, make sure you have **Node.js 18 or higher** installed.

```bash
npm install
```

This installs:
- Vite (build tool)
- TypeScript
- Matter.js (physics engine)
- Type definitions

### Step 2: Run Development Server

```bash
npm run dev
```

The game will open in your browser at `http://localhost:3000`

### Step 3: Play!

- **Click or tap** to drop animals
- **Match 2 identical** animals to merge them
- **Don't cross** the red danger line for too long!
- **Earn stars** by completing quests
- **Unlock themes** at 10 stars

## 🎮 Controls

- **Mouse**: Click anywhere to drop
- **Touch**: Tap anywhere to drop
- **Keyboard**: Not supported (mobile-first design)

## 📱 Testing on Mobile

### Option 1: Local Network
1. Run `npm run dev`
2. Find your local IP (e.g., 192.168.1.100)
3. On mobile, visit `http://YOUR_IP:3000`

### Option 2: Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🎨 Adding Assets (Optional)

The game works with placeholder colored circles, but you can add custom sprites:

1. Create 512x512 PNG images (see `ASSETS_NEEDED.md`)
2. Place in `src/assets/images/pastelPaws/`
3. Name them: `hamster.png`, `cat.png`, `shiba.png`, etc.
4. Refresh the game

Same for audio files in `src/assets/sounds/`

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/` folder. Deploy this folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` to netlify.com/drop
- **GitHub Pages**: Push to gh-pages branch
- **Any static host**: Upload `dist/` contents

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org

### Game not loading
- Check browser console (F12) for errors
- Ensure you're using a modern browser (Chrome 90+, Safari 14+, Firefox 88+)

### Touch not working
- Test on actual device (not just Chrome DevTools)
- Ensure page is using HTTPS (required for some touch features)

### Physics acting weird
- Check `GAME_CONFIG.GRAVITY` in `src/utils/constants.ts`
- Verify Matter.js installed: `npm list matter-js`

### LocalStorage not persisting
- Check browser privacy settings
- Disable private/incognito mode
- Some browsers block LocalStorage in iframes

## 📊 Development Commands

```bash
# Development server with hot reload
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview

# Install new dependency
npm install package-name

# Update dependencies
npm update
```

## 🎯 Quick Test Checklist

After starting the dev server:

1. ✅ Click to drop animals
2. ✅ Watch them merge when touching
3. ✅ See score increase
4. ✅ Cross danger line to trigger game over
5. ✅ Restart and verify high score saved
6. ✅ Check daily quest appears
7. ✅ Open achievements screen (add a button in UI)
8. ✅ View theme selector (add a button in UI)

## 🔧 Common Customizations

### Change Container Size
Edit `src/utils/constants.ts`:
```typescript
export const GAME_CONFIG = {
  CONTAINER_WIDTH: 375,  // Change this
  CONTAINER_HEIGHT: 600, // Change this
  // ...
};
```

### Adjust Difficulty
```typescript
// Make danger timer longer (easier)
DANGER_TIME_THRESHOLD: 5000, // 5 seconds instead of 3

// Change gravity (lower = easier)
GRAVITY: 0.7,

// Adjust spawn weights (higher tier 0 = easier)
export const SPAWN_WEIGHTS = {
  0: 50, // More hamsters
  1: 30,
  2: 15,
  3: 5,
  // ...
};
```

### Change Colors
Edit `src/style.css`:
```css
:root {
  --color-primary: #FF9EAA;    /* Main pink */
  --color-secondary: #FFD4A3;  /* Yellow */
  --color-tertiary: #B4E7FF;   /* Blue */
  --color-bg: #FFF8F0;         /* Background */
  --color-text: #5A4A42;       /* Text */
}
```

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Asset Guide**: See `ASSETS_NEEDED.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Code**: Explore `src/` directory

## 🆘 Need Help?

1. Check the browser console (F12) for errors
2. Read error messages carefully
3. Verify all dependencies installed: `npm list`
4. Try deleting `node_modules` and running `npm install` again
5. Ensure you're using Node.js 18+: `node --version`

## 🎉 You're Ready!

Have fun playing Punitto! The game is fully functional even without custom sprites.

---

Made with 💖 by the Punitto team
