# Carryo Mobile App

React Native mobile application for the Carryo delivery marketplace platform.

## Features

- **Multi-user support**: Customers, Drivers, and Admins
- **Real-time messaging**: Chat between customers and drivers
- **Payment processing**: Stripe integration for secure payments
- **Job management**: Create, track, and manage delivery jobs
- **Maps integration**: Location services and route visualization
- **Push notifications**: Real-time updates for job status and messages
- **Bilingual support**: English and Georgian languages
- **Offline capability**: View cached data when offline

## Tech Stack

- React Native 0.74+
- TypeScript
- React Navigation v6
- React Query (TanStack Query)
- Zustand (State Management)
- Supabase (Backend & Auth)
- Stripe React Native SDK
- React Native Maps
- React Native Paper
- i18next (Internationalization)

## Prerequisites

- Node.js 18+
- React Native CLI
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)
- Supabase account
- Stripe account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delivery-marketplace-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `API_BASE_URL`: Your Next.js backend API URL
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- Firebase configuration (for push notifications)

4. Install iOS pods (iOS only):
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Project Structure

```
src/
├── navigation/       # Navigation configuration
├── screens/         # Screen components
│   ├── auth/       # Authentication screens
│   ├── customer/   # Customer screens
│   ├── driver/     # Driver screens
│   ├── admin/      # Admin screens
│   └── shared/     # Shared screens
├── components/      # Reusable components
├── services/        # API and service layer
├── store/          # State management
├── hooks/          # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript types
├── i18n/            # Internationalization
└── theme/           # Theme configuration
```

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `API_BASE_URL`: Backend API base URL
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- Firebase configuration variables

## Building for Production

### iOS
1. Open `ios/Carryo.xcworkspace` in Xcode
2. Select your signing team
3. Archive and upload to App Store

### Android
```bash
cd android
./gradlew assembleRelease
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Your License Here]

## Support

For support, email support@carryo.com or open an issue in the repository.

