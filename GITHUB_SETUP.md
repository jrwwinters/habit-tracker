# GitHub Pages Setup Instructions

Follow these steps to deploy your Habit Tracker app to GitHub Pages:

## Step 1: Initialize Git Repository (if not already done)

Open Terminal and run:

```bash
cd /Users/joshuawinters/habit-tracker
git init
git add .
git commit -m "Initial commit: Habit Tracker PWA"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `habit-tracker` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

After creating the repo, GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
cd /Users/joshuawinters/habit-tracker
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select `main` branch
5. Click "Save"
6. Wait a minute, then your site will be live at:
   `https://YOUR_USERNAME.github.io/habit-tracker/`

## Step 5: Install on iPhone

1. Open Safari on your iPhone
2. Go to `https://YOUR_USERNAME.github.io/habit-tracker/`
3. Tap the Share button → "Add to Home Screen"
4. Done! The app will work offline after first load.

---

**Note:** If you need to update the app later, just commit and push:
```bash
git add .
git commit -m "Update description"
git push
```

