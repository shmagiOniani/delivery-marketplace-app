# Testing on iPhone Before App Store

Yes! You can test your app on your iPhone before publishing. Here are the options:

## Option 1: Development Build (Free - Recommended for Quick Testing)

### Requirements:
- Mac with Xcode installed
- iPhone connected via USB
- Free Apple ID (or paid Apple Developer account)

### Steps:

1. **Install CocoaPods dependencies:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Open the project in Xcode:**
   ```bash
   open ios/delivery-marketplace-app.xcworkspace
   ```
   ⚠️ **Important:** Open the `.xcworkspace` file, NOT the `.xcodeproj` file!

3. **In Xcode:**
   - Select your iPhone from the device dropdown (top toolbar)
   - If your device isn't listed, connect it via USB and trust the computer
   - Click the "Play" button or press `Cmd + R` to build and run

4. **First time setup:**
   - On your iPhone: Settings → General → VPN & Device Management
   - Trust your developer certificate
   - The app should launch automatically

### Notes:
- The app will expire after 7 days (with free Apple ID) or 1 year (with paid account)
- You need to rebuild and reinstall when it expires
- The app only works on devices you've registered

---

## Option 2: TestFlight (Paid - Best for Beta Testing)

### Requirements:
- Paid Apple Developer account ($99/year)
- Xcode installed on Mac

### Steps:

1. **Build for TestFlight:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **In Xcode:**
   - Open `ios/delivery-marketplace-app.xcworkspace`
   - Select "Any iOS Device" as the build target
   - Product → Archive
   - Wait for the archive to complete

3. **Upload to App Store Connect:**
   - In the Organizer window, click "Distribute App"
   - Choose "App Store Connect"
   - Follow the wizard to upload

4. **Set up TestFlight:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Navigate to your app → TestFlight
   - Add internal testers (up to 100) or external testers
   - Testers will receive an email invitation

5. **Install TestFlight:**
   - Testers download "TestFlight" from the App Store
   - Open the invitation email and accept
   - Install your app through TestFlight

### Benefits:
- No 7-day expiration
- Can share with up to 10,000 external testers
- Easy to distribute updates
- Testers don't need Xcode or a Mac

---

## Option 3: Ad-Hoc Distribution (Paid)

### Requirements:
- Paid Apple Developer account ($99/year)
- Register device UDID in Apple Developer portal

### Steps:

1. **Register your device:**
   - Get your iPhone's UDID (Settings → General → About → find UDID)
   - Add it in Apple Developer portal → Devices

2. **Create Ad-Hoc Provisioning Profile:**
   - In Apple Developer portal → Certificates, Identifiers & Profiles
   - Create a new Ad-Hoc provisioning profile
   - Download and install it

3. **Build and install:**
   - In Xcode, select your device
   - Product → Archive
   - Distribute App → Ad Hoc
   - Export and install via Xcode or Apple Configurator

---

## Quick Start (Development Build)

If you just want to test quickly:

```bash
# 1. Install iOS dependencies
cd ios && pod install && cd ..

# 2. Start Metro bundler (in one terminal)
npm start

# 3. Run on your connected iPhone (in another terminal)
npm run ios -- --device
```

Or open in Xcode and click Run!

---

## Troubleshooting

### "No devices found"
- Make sure iPhone is connected via USB
- Unlock your iPhone and trust the computer
- In Xcode: Window → Devices and Simulators → Check if device appears

### "Signing requires a development team"
- In Xcode: Select project → Signing & Capabilities
- Select your Apple ID team
- Xcode will automatically create a provisioning profile

### "App installation failed"
- Check device UDID is registered (for paid accounts)
- Try cleaning build: Product → Clean Build Folder (Shift + Cmd + K)
- Restart Xcode and try again

### Metro bundler connection issues
- Make sure your Mac and iPhone are on the same WiFi network
- Or use USB connection with port forwarding

---

## Cost Comparison

| Method | Cost | Expiration | Best For |
|--------|------|------------|----------|
| Development Build (Free Apple ID) | Free | 7 days | Quick testing |
| Development Build (Paid Account) | $99/year | 1 year | Development |
| TestFlight | $99/year | No expiration | Beta testing |
| Ad-Hoc | $99/year | 1 year | Direct distribution |

---

## Next Steps

Once you're ready to publish:
1. Build a production release
2. Submit to App Store Connect
3. Go through App Review process
4. Publish to the App Store!

