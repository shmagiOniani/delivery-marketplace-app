# Quick Start: Install Android SDK for React Native

## 🚀 Fastest Way (5 minutes to start, 20-30 minutes total)

### 1. Install Android Studio
```bash
# Option A: Download from website
open https://developer.android.com/studio

# Option B: Using Homebrew (if installed)
brew install --cask android-studio
```

### 2. Open Android Studio
- Open the app from Applications
- Choose "Standard" installation
- Wait for SDK download (10-30 minutes)

### 3. Configure Your Project
```bash
# Create local.properties file
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties

# Verify it was created
cat android/local.properties
```

### 4. Build Your App
```bash
npm run android
```

## 📋 What You Need

- **macOS** 10.15 or later
- **Internet connection** (for downloading SDK)
- **~3GB disk space**
- **20-30 minutes** of your time

## ⚠️ Important Notes

- The SDK download happens automatically during Android Studio setup
- You don't need to create an Android project in Android Studio
- Just install it, let it download the SDK, then use it with React Native
- The SDK location is usually: `/Users/YOUR_USERNAME/Library/Android/sdk`

## 🆘 Need Help?

See `INSTALL_ANDROID_SDK.md` for detailed instructions.

