# Habit Tracker - PWA

A beautiful, progressive web app for tracking your daily habits. Install it on your iPhone for a native app experience!

## Features

- ✅ Add and track multiple habits
- 🔥 Streak tracking (current and best streak)
- 📊 Completion rate statistics
- 💾 Local storage (your data stays on your device)
- 📱 PWA-ready for iPhone installation
- 🌙 Beautiful, modern UI with gradient design
- ⚡ Works offline

## Quick Start

1. **Serve the files using a local web server**

   You can use Python's built-in server:
   ```bash
   cd habit-tracker
   python3 -m http.server 8000
   ```

   Or use Node.js http-server:
   ```bash
   npx http-server -p 8000
   ```

2. **Access the app**
   - Open your browser and go to `http://localhost:8000`
   - Or if on the same network, use your computer's IP address (e.g., `http://192.168.1.100:8000`)

3. **Install on iPhone**
   - Open Safari on your iPhone
   - Navigate to the app URL (make sure your iPhone is on the same network)
   - Tap the Share button (square with arrow)
   - Tap "Add to Home Screen"
   - The app will appear on your home screen like a native app!

## Icon Setup (Optional but Recommended)

For the best iPhone installation experience, you'll want to add icon files. The app references `icon-192.png` and `icon-512.png` in the manifest.

You can:
1. Create 192x192 and 512x512 PNG images
2. Use any icon generator website
3. Or temporarily use placeholder icons (the app will still work without them)

## How to Use

1. **Add a habit**: Type a habit name in the input field and tap "Add"
2. **Mark complete**: Tap the checkbox next to a habit to mark it complete for today
3. **View stats**: See your current streak, best streak, and completion rate for each habit
4. **Delete a habit**: Tap the trash icon to remove a habit

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- Uses localStorage for data persistence
- Service Worker for offline functionality
- Responsive design optimized for mobile
- PWA manifest for native app installation

## Data Storage

All your habit data is stored locally in your browser's localStorage. This means:
- ✅ Your data stays private on your device
- ✅ No account needed
- ✅ Works completely offline
- ⚠️ Clearing browser data will remove your habits

Enjoy building better habits! 🎯
