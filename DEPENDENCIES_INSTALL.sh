#!/bin/bash

# Job Creation Feature - Dependency Installation Script
# Run this script to install all required dependencies for the job creation feature

echo "================================================"
echo "Installing Job Creation Feature Dependencies"
echo "================================================"
echo ""

# Install React Native Maps
echo "📍 Installing React Native Maps..."
npm install react-native-maps@^1.11.0

# Install Geolocation
echo "📡 Installing Geolocation..."
npm install @react-native-community/geolocation@^3.1.0

# Install Image Picker
echo "📸 Installing Image Picker..."
npm install react-native-image-picker@^7.0.0

# Install DateTime Picker
echo "📅 Installing DateTime Picker..."
npm install @react-native-community/datetimepicker@^7.6.0

echo ""
echo "================================================"
echo "npm install complete!"
echo "================================================"
echo ""

# iOS Pod Install
if [ -d "ios" ]; then
  echo "🍎 Installing iOS Pods..."
  cd ios
  pod install
  cd ..
  echo "✅ iOS pods installed"
else
  echo "⚠️  ios directory not found, skipping pod install"
fi

echo ""
echo "================================================"
echo "✅ All dependencies installed successfully!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Configure Google Maps API key in AndroidManifest.xml"
echo "2. Add permissions to AndroidManifest.xml and Info.plist"
echo "3. Add CreateJob screen to your navigation"
echo "4. Set up Supabase storage bucket"
echo ""
echo "See JOB_CREATION_QUICK_START.md for detailed instructions"
echo ""

