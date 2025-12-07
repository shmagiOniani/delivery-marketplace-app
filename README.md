# Carryo Delivery Marketplace Mobile App

A React Native mobile application for Carryo - a delivery marketplace connecting customers with drivers. Built with React Native 0.82.1, TypeScript, React Navigation, React Query, and Zustand.

## Features

- 🔐 Authentication (Login/Signup)
- 📦 Order creation flow (4 steps)
- 📍 Real-time order tracking
- 💬 In-app messaging
- 💳 Payment integration (Stripe)
- 🗺️ Maps integration (Google Maps)
- 🌍 Internationalization (English/Georgian)
- 👥 Dual user roles (Customer/Driver)

## Tech Stack

- **React Native**: 0.82.1
- **React**: 19.1.1
- **TypeScript**: 5.8.3
- **Navigation**: React Navigation v6
- **State Management**: Zustand + React Query
- **Backend**: Supabase + Next.js API
- **Maps**: react-native-maps
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe React Native

## Prerequisites

- Node.js >= 20.19.4 (recommended)
- npm or yarn
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio with Android SDK
- React Native CLI

## Getting Started

### Step 1: Install Dependencies

```sh
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```bash
API_BASE_URL=https://your-domain.com/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
STRIPE_PUBLISHABLE_KEY=pk_test_...
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Step 3: iOS Setup

```sh
cd ios
pod install
cd ..
```

### Step 4: Android Setup

The Android configuration is already set up. Make sure to add your Google Maps API key to `android/app/src/main/AndroidManifest.xml` if you haven't already.

### Step 5: Start Metro Bundler

```sh
npm start
```

### Step 6: Run the App

**iOS:**
```sh
npm run ios
```

**Android:**
```sh
npm run android
```

## Project Structure

```
src/
├── screens/          # Screen components
│   ├── auth/        # Authentication screens
│   ├── customer/    # Customer-specific screens
│   ├── driver/      # Driver-specific screens
│   └── shared/      # Shared screens
├── components/      # Reusable components
│   ├── ui/          # UI components (Button, Input, etc.)
│   └── shared/      # Shared components
├── navigation/       # Navigation configuration
├── hooks/           # Custom hooks
│   ├── queries/     # React Query hooks
│   └── mutations/   # Mutation hooks
├── stores/           # Zustand stores
├── lib/              # Libraries and utilities
│   ├── api/         # API client
│   ├── supabase/    # Supabase client
│   └── utils/       # Utility functions
├── types/            # TypeScript types
├── constants/        # Constants (Colors, Typography, etc.)
└── i18n/            # Internationalization
```

## Development

### Running Tests

```sh
npm test
```

### Linting

```sh
npm run lint
```

### Clearing Cache

If you encounter issues, try clearing the Metro cache:

```sh
npm start -- --reset-cache
```

## Building for Production

### iOS

1. Open `ios/AwesomProject.xcworkspace` in Xcode
2. Select your target device/simulator
3. Product → Archive

### Android

```sh
cd android
./gradlew assembleRelease
```

## Troubleshooting

### Common Issues

**Issue: Vector Icons not showing**
- iOS: Run `cd ios && pod install && cd ..`
- Android: Rebuild the app

**Issue: Maps not showing**
- Ensure Google Maps API key is set in AndroidManifest.xml
- Enable Maps SDK in Google Cloud Console
- Test on a real device (emulator requires Google Play Services)

**Issue: TypeScript path aliases not working**
- Restart Metro bundler
- Clear cache: `npm start -- --reset-cache`

## Learn More

- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
