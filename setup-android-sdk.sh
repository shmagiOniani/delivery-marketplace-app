#!/bin/bash

# Android SDK Setup Script
# This script helps set up the Android SDK path for React Native

echo "🔧 Android SDK Setup Script"
echo ""

# Default SDK location on macOS
DEFAULT_SDK="$HOME/Library/Android/sdk"

# Check if SDK exists at default location
if [ -d "$DEFAULT_SDK" ]; then
    echo "✅ Found Android SDK at: $DEFAULT_SDK"
    SDK_PATH="$DEFAULT_SDK"
else
    echo "⚠️  Android SDK not found at default location: $DEFAULT_SDK"
    echo ""
    echo "Please enter your Android SDK path:"
    echo "(Common locations:)"
    echo "  - $HOME/Library/Android/sdk"
    echo "  - /Applications/Android/sdk"
    echo ""
    read -p "SDK path: " SDK_PATH
    
    if [ ! -d "$SDK_PATH" ]; then
        echo "❌ Error: SDK path does not exist: $SDK_PATH"
        echo ""
        echo "Please:"
        echo "1. Install Android Studio from https://developer.android.com/studio"
        echo "2. Open Android Studio → Preferences → Android SDK"
        echo "3. Note the SDK location"
        echo "4. Run this script again with the correct path"
        exit 1
    fi
fi

# Create local.properties file
LOCAL_PROPERTIES="android/local.properties"

# Check if file already exists
if [ -f "$LOCAL_PROPERTIES" ]; then
    echo ""
    echo "⚠️  $LOCAL_PROPERTIES already exists"
    read -p "Overwrite? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Cancelled. File not modified."
        exit 0
    fi
fi

# Write SDK path to local.properties
echo "sdk.dir=$SDK_PATH" > "$LOCAL_PROPERTIES"
echo ""
echo "✅ Created $LOCAL_PROPERTIES with SDK path:"
echo "   $SDK_PATH"
echo ""
echo "📝 Next steps:"
echo "   1. cd android && ./gradlew clean && cd .."
echo "   2. npm run android"
echo ""

