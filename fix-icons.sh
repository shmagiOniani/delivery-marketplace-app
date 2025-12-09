#!/bin/bash

# Fix Icons Script for React Native Vector Icons
# This script fixes common icon display issues

echo "🔧 Fixing React Native Vector Icons..."

# 1. Clear Metro cache
echo "📦 Clearing Metro cache..."
npm start -- --reset-cache &
METRO_PID=$!
sleep 2
kill $METRO_PID 2>/dev/null || true

# 2. Clear Android build cache
echo "🤖 Clearing Android build cache..."
cd android
./gradlew clean
cd ..

# 3. Clear iOS build cache (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Clearing iOS build cache..."
    cd ios
    rm -rf build
    rm -rf Pods
    pod install
    cd ..
fi

# 4. Create fonts directory for Android if it doesn't exist
echo "📁 Ensuring Android fonts directory exists..."
mkdir -p android/app/src/main/assets/fonts

# 5. Copy fonts to Android assets (if fonts.gradle doesn't handle it)
echo "📋 Fonts should be automatically linked via fonts.gradle"
echo "   If issues persist, manually copy fonts from:"
echo "   node_modules/react-native-vector-icons/Fonts/"
echo "   to: android/app/src/main/assets/fonts/"

echo ""
echo "✅ Icon fix script completed!"
echo ""
echo "📝 Next steps:"
echo "1. Rebuild your app:"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios"
echo ""
echo "2. If icons still don't show:"
echo "   - Verify icon names at: https://oblador.github.io/react-native-vector-icons/"
echo "   - Check that fonts.gradle is applied in android/app/build.gradle"
echo "   - Verify UIAppFonts in ios/AwesomProject/Info.plist"

