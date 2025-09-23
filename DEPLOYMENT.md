# ResQ Connect - Deployment Guide

This React Native Expo app has been successfully converted to a static website that can be deployed on Vercel, GitHub Pages, or any static hosting provider.

## 📦 Build Files

The static website is located in the `dist/` folder and contains:
- `index.html` - Main HTML file
- `_expo/static/js/web/` - JavaScript bundle
- `assets/` - Application assets
- `favicon.ico` - Website icon

## 🚀 Deployment Options

### Option 1: Vercel Deployment

1. **Connect to GitHub:**
   - Push this project to a GitHub repository
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository

3. **Configure Build Settings:**
   - **Framework Preset:** Other
   - **Build Command:** `npx expo export --platform web --output-dir dist`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click "Deploy" and Vercel will build and host your site

### Option 2: GitHub Pages

1. **Prepare Repository:**
   - Push this project to a GitHub repository
   - The `dist/` folder contains your deployable website

2. **Deploy via GitHub Actions:**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npx expo export --platform web --output-dir dist
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

### Option 3: Manual Static Hosting

Upload the contents of the `dist/` folder to any static web hosting service:
- Netlify
- Firebase Hosting  
- AWS S3 + CloudFront
- Surge.sh

## 🔧 Local Development

To continue developing:

```bash
# Start development server
npm start

# Build for web
npm run build:web
```

## 🌐 App Features

Your deployed website includes:
- **Community Alerts** - Real-time disaster reporting
- **Interactive Map** - Leaflet-powered disaster visualization  
- **AI Safety Assistant** - Emergency guidance
- **SOS Tools** - Emergency contact features
- **Responsive Design** - Works on all devices

## 📱 Mobile App

To build mobile versions:
- **Android:** `npx expo build:android`
- **iOS:** `npx expo build:ios`

## ⚠️ Notes

- The app currently uses mock data for demonstration
- Map functionality requires internet connection for tiles
- Some features may need API keys for production use

---

**Ready to deploy!** Your ResQ Connect website is now optimized for static hosting. 🚀