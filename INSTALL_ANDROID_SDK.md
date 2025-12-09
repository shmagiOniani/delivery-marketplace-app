# Android SDK Installation Guide for macOS

## Overview
To build React Native Android apps, you need the Android SDK. The easiest way is to install Android Studio, which includes the SDK.

## Installation Steps

### Step 1: Install Android Studio

**Option A: Download from Website (Recommended)**
1. Go to: https://developer.android.com/studio
2. Click "Download Android Studio"
3. Download the `.dmg` file for macOS
4. Open the downloaded file and drag Android Studio to Applications
5. Open Android Studio from Applications

**Option B: Using Homebrew (if you have it)**
```bash
brew install --cask android-studio
```

### Step 2: First-Time Setup

1. **Open Android Studio** (it may take a few minutes to load the first time)

2. **Setup Wizard:**
   - Choose "Standard" installation (recommended)
   - This will automatically download and install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)
     - Performance tools

3. **Wait for Download:**
   - The SDK components will download (this can take 10-30 minutes depending on your internet)
   - You'll see a progress bar at the bottom

4. **Finish Setup:**
   - Click "Finish" when done

### Step 3: Verify SDK Installation

1. **Check SDK Location:**
   - In Android Studio, go to: **Preferences** (⌘,) → **Appearance & Behavior** → **System Settings** → **Android SDK**
   - Note the "Android SDK Location" path (usually: `/Users/YOUR_USERNAME/Library/Android/sdk`)

2. **Install Required SDK Components:**
   - In the same Android SDK window:
     - Check **Android SDK Platform 34** (or latest)
     - Check **Android SDK Build-Tools**
     - Check **Android SDK Command-line Tools**
     - Check **Android Emulator**
     - Click "Apply" and wait for installation

### Step 4: Configure React Native Project

After Android Studio is installed and SDK is set up:

1. **Find your SDK path:**
   ```bash
   # Usually at:
   echo $HOME/Library/Android/sdk
   ```

2. **Create local.properties:**
   ```bash
   cd /Users/natiatabatadze/Documents/delivery-marketplace-app
   echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
   ```

3. **Verify:**
   ```bash
   cat android/local.properties
   # Should show: sdk.dir=/Users/natiatabatadze/Library/Android/sdk
   ```

### Step 5: Set Environment Variables (Optional but Recommended)

Add to your shell profile (`~/.zshrc` for zsh or `~/.bash_profile` for bash):

```bash
# Open your shell profile
nano ~/.zshrc  # or ~/.bash_profile

# Add these lines:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Save and reload
source ~/.zshrc  # or source ~/.bash_profile
```

### Step 6: Test Installation

```bash
# Check if SDK is accessible
ls $ANDROID_HOME

# Check if adb (Android Debug Bridge) is available
adb version

# Try building the project
cd android
./gradlew clean
cd ..
npm run android
```

## Alternative: Install SDK Without Android Studio (Advanced)

If you only want the SDK without the full IDE:

```bash
# Install command-line tools
brew install --cask android-commandlinetools

# Or download manually:
# 1. Go to: https://developer.android.com/studio#command-tools
# 2. Download "Command line tools only" for macOS
# 3. Extract to a location like ~/Library/Android/sdk/cmdline-tools
# 4. Run: sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## System Requirements

- **macOS**: 10.15 (Catalina) or later
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: ~3GB for Android Studio + SDK
- **Java**: Android Studio includes JDK, but you can also install separately

## Troubleshooting

### Android Studio won't open
- Make sure you have Java installed: `java -version`
- Try opening from Terminal: `open /Applications/Android\ Studio.app`

### SDK download fails
- Check your internet connection
- Try using a VPN if in a restricted network
- Manually download SDK components from Android Studio

### Permission denied errors
```bash
chmod +x android/gradlew
```

### SDK path not found
- Verify the path exists: `ls ~/Library/Android/sdk`
- If it doesn't exist, Android Studio setup didn't complete - run it again

## What Gets Installed

- **Android SDK**: Core development tools
- **SDK Platform**: Android API levels (for different Android versions)
- **SDK Build-Tools**: Tools to build Android apps
- **Android Emulator**: Virtual device to test apps
- **Platform Tools**: adb, fastboot, etc.
- **System Images**: For emulator (optional, but recommended)

## Estimated Time

- **Download Android Studio**: 5-10 minutes
- **Install Android Studio**: 2-5 minutes
- **SDK Download & Setup**: 10-30 minutes (depends on internet)
- **Total**: ~20-45 minutes

## Next Steps After Installation

1. ✅ Android Studio installed
2. ✅ SDK downloaded
3. ✅ Create `android/local.properties` with SDK path
4. ✅ Set environment variables (optional)
5. ✅ Run `npm run android` to build your app

## Quick Reference Commands

```bash
# Check SDK location
echo $ANDROID_HOME

# Create local.properties
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties

# Verify SDK installation
ls $ANDROID_HOME/platforms

# Check installed SDK versions
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed
```

