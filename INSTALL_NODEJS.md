# Install Node.js on macOS

Node.js is required to run the Punitto development server. Here are the installation options:

## Option 1: Official Installer (Recommended)

1. Visit https://nodejs.org/
2. Download the **LTS version** (v20.x or higher)
3. Run the `.pkg` installer
4. Follow the installation wizard
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Option 2: Using Homebrew (If you have it)

```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify
node --version
npm --version
```

## Option 3: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

## After Installing Node.js

Once Node.js is installed, run these commands in the Punitto directory:

```bash
cd /Users/brandon.tan/personal/Punitto

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at http://localhost:3000

## Minimum Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Disk Space**: ~200MB for node_modules
- **RAM**: 4GB+ recommended

## Troubleshooting

### "command not found" after install
- Close and reopen your terminal
- Or run: `source ~/.zshrc` (or `~/.bash_profile`)

### Permission errors
- Don't use `sudo npm install`
- Fix permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

### Port 3000 already in use
- Kill the process: `lsof -ti:3000 | xargs kill`
- Or use different port: `npm run dev -- --port 3001`

## Next Steps

After Node.js is installed:

1. ✅ Install Node.js (you are here)
2. Run `npm install` in the Punitto directory
3. Run `npm run dev` to start the game
4. Open http://localhost:3000 in your browser
5. Start playing! 🎮
