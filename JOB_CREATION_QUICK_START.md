# Job Creation Feature - Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Install Dependencies

```bash
npm install react-native-maps @react-native-community/geolocation react-native-image-picker @react-native-community/datetimepicker

# iOS only
cd ios && pod install && cd ..
```

### Step 2: Configure Permissions

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

**iOS** (`ios/delivery-marketplace-app/Info.plist`):
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to set pickup and delivery addresses</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos of items</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select photos</string>
```

### Step 3: Add to Navigation

In `src/navigation/CustomerNavigator.tsx`:

```typescript
import { CreateJobScreen } from '@/screens/customer/job';

// Add to your stack navigator
<Stack.Screen
  name="CreateJob"
  component={CreateJobScreen}
  options={{
    title: 'Create Job',
    headerShown: false,
  }}
/>
```

### Step 4: Add Navigation Type (TypeScript)

In `src/types/navigation.ts`:

```typescript
export type CustomerStackParamList = {
  // ... existing routes
  CreateJob: undefined;
  OrderDetail: { orderId: string };
};
```

### Step 5: Navigate to the Screen

From any customer screen:

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Open job creation
const handleCreateJob = () => {
  navigation.navigate('CreateJob');
};
```

### Step 6: Set Up Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps SDK for Android" and "Maps SDK for iOS"
3. Enable "Geocoding API"
4. Create an API key
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in:
   - `android/app/src/main/AndroidManifest.xml`
   - `src/screens/customer/job/components/MapPicker.tsx` (line ~57 and ~145)

### Step 7: Set Up Supabase Storage

Create a storage bucket for job photos:

```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('jobs', 'jobs', true);

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jobs');

-- Allow public reads
CREATE POLICY "Public can view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jobs');
```

## ✅ You're Done!

The job creation feature is now fully integrated. Users can:

- ✨ Create Move, Recycle, or Gift jobs
- 📍 Pick locations on an interactive map
- 📸 Upload photos of items
- 💰 Set pricing with automatic fee calculation
- ⏰ Schedule pickup times
- 📱 Complete the entire flow in a beautiful, mobile-optimized wizard

## 🎯 Next Steps

1. **Test the flow**: Create a job from each type (Move, Recycle, Gift)
2. **Customize**: Adjust colors, spacing, or text in the components
3. **Extend**: Add more recycling centers in `src/screens/customer/job/types.ts`
4. **Localize**: Update translations in `src/i18n/en.ts` and `src/i18n/ka.ts`

## 🐛 Common Issues

### Maps Not Showing
- **Solution**: Add Google Maps API key to both platform configs
- **Check**: Enable Maps SDK in Google Cloud Console

### Location Permission Denied
- **Solution**: Request permissions at app startup or show prompt
- **Check**: Verify AndroidManifest.xml and Info.plist entries

### Photo Upload Fails
- **Solution**: Create Supabase storage bucket with correct policies
- **Check**: Supabase project settings and bucket configuration

### TypeScript Errors
- **Solution**: Ensure navigation types are updated in `src/types/navigation.ts`
- **Check**: Import paths match your project structure

## 📖 Full Documentation

See `JOB_CREATION_IMPLEMENTATION.md` for complete technical documentation.

## 💬 Support

Need help? Check:
- Implementation docs
- Component comments (inline documentation)
- Type definitions in `types.ts`
- Validation logic in `useJobForm.ts`

