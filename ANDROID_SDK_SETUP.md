# Android SDK Setup Guide

## Problem
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable 
or by setting the sdk.dir path in your project's local.properties file.
```

## Solution

### Option 1: Create local.properties File (Recommended)

**Step 1: Find your Android SDK location**

On macOS, the SDK is usually at:
```
/Users/YOUR_USERNAME/Library/Android/sdk
```

**Find it using one of these methods:**

**Method A: Using Android Studio**
1. Open Android Studio
2. Go to **Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Copy the "Android SDK Location" path

**Method B: Using Terminal**
```bash
# Check if ANDROID_HOME is set
echo $ANDROID_HOME

# Or find common locations
ls ~/Library/Android/sdk
```

**Step 2: Create local.properties file**

Create the file at: `android/local.properties`

```bash
# Navigate to project root
cd /Users/natiatabatadze/Documents/delivery-marketplace-app

# Create local.properties with your SDK path
echo "sdk.dir=/Users/natiatabatadze/Library/Android/sdk" > android/local.properties
```

**Or manually create the file:**

1. Create `android/local.properties`
2. Add this line (replace with your actual path):
   ```
   sdk.dir=/Users/natiatabatadze/Library/Android/sdk
   ```

### Option 2: Set ANDROID_HOME Environment Variable

**For current session:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**For permanent setup (add to ~/.zshrc or ~/.bash_profile):**
```bash
# Add to ~/.zshrc (for zsh shell)
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

## Verify Setup

```bash
# Check if local.properties exists and has correct path
cat android/local.properties

# Or check ANDROID_HOME
echo $ANDROID_HOME

# Verify SDK exists
ls $ANDROID_HOME
```

## If Android SDK is Not Installed

1. **Install Android Studio:**
   - Download from: https://developer.android.com/studio
   - Install and open Android Studio

2. **Install SDK through Android Studio:**
   - Open Android Studio
   - Go to **Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
   - Install SDK Platform and SDK Tools
   - Note the SDK location

3. **Or use command line tools:**
   ```bash
   # Install via Homebrew (if you have it)
   brew install --cask android-studio
   ```

## Quick Setup Script

Run this script to automatically set up local.properties:

```bash
#!/bin/bash
SDK_PATH="$HOME/Library/Android/sdk"

if [ -d "$SDK_PATH" ]; then
    echo "sdk.dir=$SDK_PATH" > android/local.properties
    echo "✅ Created android/local.properties with SDK path: $SDK_PATH"
else
    echo "❌ Android SDK not found at $SDK_PATH"
    echo "Please install Android Studio or set the correct SDK path manually"
    exit 1
fi
```

## Troubleshooting

### SDK path doesn't exist
- Make sure Android Studio is installed
- Install Android SDK through Android Studio
- Or download SDK command-line tools separately

### Permission denied
```bash
chmod 644 android/local.properties
```

### Still not working
1. Verify the path in `local.properties` is correct
2. Make sure the SDK directory contains `platforms`, `build-tools`, etc.
3. Try setting ANDROID_HOME environment variable as well
4. Restart your terminal/IDE

## Next Steps

After setting up the SDK:

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

