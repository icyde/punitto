# Deploy Punitto to Vercel

## ✅ Vercel Configuration Added

I've created `vercel.json` - your project is ready to deploy!

## 🚀 Deployment Steps

### Prerequisites
- GitHub account (free)
- Vercel account (free) - sign up at https://vercel.com

### Method 1: GitHub + Vercel (Recommended)

This is the easiest method with automatic deployments.

#### Step 1: Push to GitHub

1. **Create GitHub repository**:
   - Go to https://github.com/new
   - Repository name: `punitto`
   - Keep it **Public** (or Private if you prefer)
   - **DON'T** initialize with README
   - Click "Create repository"

2. **Push your local code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/punitto.git
   git branch -M main
   git push -u origin main
   ```

   **Note**: If it asks for credentials:
   - Username: Your GitHub username
   - Password: Use a **Personal Access Token** (not your GitHub password)
     - Create one at: https://github.com/settings/tokens
     - Select scopes: `repo` (full control)
     - Copy the token and use it as password

#### Step 2: Deploy on Vercel

1. **Go to Vercel**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Connect your GitHub account (if first time)
   - Select the `punitto` repository

3. **Configure Project**:
   - Framework Preset: **Vite** (should auto-detect)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Click "Deploy"**

5. **Wait 1-2 minutes** for build to complete

6. **Done!** You'll get a URL like: `https://punitto.vercel.app`

### Method 2: Vercel CLI (Requires Node.js)

If you had Node.js installed, you could:
```bash
npm install -g vercel
vercel login
vercel
```

But since you don't have Node.js, use Method 1 above.

### Method 3: Drag & Drop (Manual)

Vercel doesn't support drag & drop for projects that need building. You need Method 1.

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Every push to `main`** = automatic production deployment
- **Every PR** = automatic preview deployment
- No manual work needed!

## 🌍 Your Deployment URLs

After deploying, you'll get:
- **Production**: `https://punitto.vercel.app` (or custom domain)
- **Preview**: Unique URL for each branch/PR
- **Auto HTTPS**: SSL certificate included free

## ⚙️ Environment Variables

If you need environment variables later:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add key-value pairs

(Not needed for Punitto - everything is client-side)

## 🐛 Troubleshooting

### Build fails with "npm: command not found"
- This shouldn't happen - Vercel provides Node.js
- Check build logs in Vercel dashboard

### Build fails with TypeScript errors
- Run `npm run build` locally first (when you have Node.js)
- Fix any type errors before pushing

### Blank page after deployment
- Check browser console for errors
- Verify `dist/` folder was created during build
- Check Vercel build logs

### Assets not loading (404 errors)
- Check asset paths in code
- Ensure paths start with `/` (absolute) or are relative
- Verify `vercel.json` rewrites are set correctly

## 📊 Post-Deployment

### Check Your Deployment:
1. Visit your Vercel URL
2. Open browser DevTools (F12)
3. Check Console for errors
4. Test gameplay:
   - Click to drop animals
   - Verify merging works
   - Check danger line
   - Test game over
   - Verify LocalStorage (high score persists)

### Share Your Game:
- Share the URL: `https://punitto.vercel.app`
- Works on any device with a browser
- Mobile-optimized, so perfect for phones!

## 🔒 Important Notes

### What Gets Deployed:
✅ All TypeScript code (compiled to JavaScript)
✅ HTML, CSS, images, sounds
✅ Vite optimizes and bundles everything
✅ Production-ready, minified code

### What Stays Private:
✅ Your `.git/` folder (not deployed)
✅ `node_modules/` (not deployed)
✅ Source `.ts` files (compiled to `.js`)

### Performance:
- Vercel's CDN = Fast worldwide
- Edge network = Low latency
- Automatic optimization
- 100/100 Lighthouse score possible

## 💰 Pricing

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Serverless functions (if needed later)

More than enough for a game like Punitto!

## 🎯 Quick Checklist

- [ ] Create GitHub account (if needed)
- [ ] Create repository on GitHub
- [ ] Push code: `git push origin main`
- [ ] Create Vercel account
- [ ] Import GitHub repository to Vercel
- [ ] Wait for build to complete
- [ ] Test deployed game
- [ ] Share URL with friends!

## 🎮 After Deployment

Your game will be **live and playable** at your Vercel URL!

Anyone can:
- Play the game
- Earn scores (saved in their browser)
- Complete quests
- Unlock themes
- All without installing anything

## 🔄 Making Updates

After initial deployment:

1. **Make changes locally**:
   ```bash
   # Edit files
   git add .
   git commit -m "Add new feature"
   git push
   ```

2. **Vercel auto-deploys** - that's it!
   - Builds automatically
   - Deploys to production
   - Takes 1-2 minutes

## 🆘 Need Help?

If stuck:
1. Check Vercel deployment logs (very detailed)
2. Check browser console for errors
3. Verify `vercel.json` is in root folder
4. Ensure `package.json` has correct scripts

## 📱 Test on Mobile

After deployment:
1. Open Vercel URL on your phone
2. Add to home screen (feels like native app!)
3. Play without app store

## 🎉 Success Looks Like:

```
✅ GitHub repo created
✅ Code pushed
✅ Vercel connected
✅ Build succeeded (1-2 min)
✅ Deployment live
✅ Game playable at URL
✅ Mobile-responsive
✅ Fast loading
```

---

**Ready to deploy?** Follow Method 1 above - it's the smoothest workflow!

Once deployed, share your game URL with me and I can visit it! 🎮
