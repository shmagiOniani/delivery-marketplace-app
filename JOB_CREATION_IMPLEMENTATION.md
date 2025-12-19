# Job Creation Feature - Implementation Documentation

## Overview

This document describes the complete implementation of the multi-step job creation wizard for the React Native mobile app. The feature allows customers to create delivery jobs with three types: Move, Recycle, and Gift.

## 📁 File Structure

```
src/screens/customer/job/
├── CreateJobScreen.tsx              # Main wizard orchestrator
├── index.ts                         # Module exports
├── types.ts                         # TypeScript definitions
│
├── hooks/
│   └── useJobForm.ts               # Form state management & validation
│
├── components/
│   ├── FormStepper.tsx             # Progress indicator
│   ├── MapPicker.tsx               # Interactive location picker
│   ├── ReadOnlyMap.tsx             # Static map display
│   └── PhotoUpload.tsx             # Camera/gallery photo picker
│
└── steps/
    ├── Step1JobType.tsx            # Job type & title selection
    ├── Step2PickupLocation.tsx     # Pickup details & photos
    ├── Step3DeliveryLocation.tsx   # Delivery location (conditional)
    └── Step4ItemDetails.tsx        # Item details & pricing

src/lib/api/
└── jobs.ts                          # Job API service

src/i18n/
├── en.ts                            # English translations (updated)
└── ka.ts                            # Georgian translations (updated)
```

## 🎯 Features Implemented

### 1. Multi-Step Wizard Navigation
- **4 main steps** with conditional logic
- Progress indicator showing current step
- Next/Back navigation with validation
- Cancel confirmation dialog

### 2. Three Job Types

#### Move (Standard Delivery)
- Full pickup and delivery locations
- Contact info for both locations
- Custom pricing with platform fee
- Floor, elevator, and notes for both locations

#### Recycle
- Pickup location with details
- Predefined recycling centers dropdown
- Read-only map showing selected center
- Custom pricing with platform fee

#### Gift (Free Donation)
- Pickup location only
- No delivery location needed
- Zero price (free for customer)
- Driver receives items for free

### 3. Location Handling
- **Interactive map picker** with:
  - Google Maps integration
  - Current location detection
  - Address search
  - Draggable marker
  - Reverse geocoding
- **Read-only map** for recycling centers

### 4. Photo Upload
- Multiple photo support (up to 5)
- Camera or gallery selection
- Supabase Storage integration
- Upload progress indicator
- Photo preview and removal

### 5. Pricing & Payment
- **Pricing calculation**:
  - Cash: 0% platform fee
  - Online: 15% platform fee
  - Gift jobs: ₾0.00
- **Pricing breakdown** display
- Payment method selection (Cash/Online)

### 6. Validation
- **Per-step validation** before navigation
- **Final validation** before submission
- **Real-time error messages**
- Phone number format validation
- Price range validation (5-10,000 GEL)
- Date/time validation (future only)

### 7. Form State Management
- Custom `useJobForm` hook
- Centralized state management
- Field-level error clearing
- Form reset functionality

## 🔧 Technical Implementation

### State Management

```typescript
interface JobFormState {
  // Step 1
  jobType: JobPurpose | null;
  title: string;
  
  // Step 2
  pickupLocation: LocationData | null;
  pickupContact: ContactInfo;
  pickupNotes: string;
  pickupFloor: string;
  pickupElevator: boolean;
  pickupPhotos: string[];
  
  // Step 3
  deliveryLocation: LocationData | null;
  deliveryContact: ContactInfo;
  deliveryNotes: string;
  deliveryFloor: string;
  deliveryElevator: boolean;
  selectedRecyclingCenter: RecyclingCenter | null;
  
  // Step 4
  description: string;
  itemCategory: string;
  itemSize: string;
  itemWeight: string;
  requiresHelp: boolean;
  customerPrice: number;
  paymentType: PaymentType;
  scheduledPickup: Date | null;
}
```

### API Integration

The `createJob` function prepares FormData and submits to `/api/jobs`:

```typescript
POST /api/jobs
Content-Type: multipart/form-data

Fields:
- job_type, title
- pickup_address, pickup_lat, pickup_lng
- pickup_contact_name, pickup_contact_phone
- pickup_notes, pickup_floor, pickup_elevator
- pickup_photos (array of files/URLs)
- delivery_address, delivery_lat, delivery_lng
- delivery_contact_name, delivery_contact_phone
- delivery_notes, delivery_floor, delivery_elevator
- description, item_category, item_size, item_weight
- requires_help, customer_price, driver_payout
- platform_fee, payment_type, scheduled_pickup
```

### Conditional Logic

**Gift Jobs:**
- Skip Step 3 (delivery location)
- Set price to 0
- No delivery contact needed
- Stepper shows 3 steps instead of 4

**Recycle Jobs:**
- Show recycling center dropdown
- Read-only map for selected center
- Auto-populate delivery location from center
- No delivery contact needed

**Move Jobs:**
- Full delivery location picker
- Delivery contact required
- Floor and elevator options
- Custom notes field

### Pricing Calculation

```typescript
const calculatePricing = (): PricingBreakdown => {
  if (jobType === 'gift') {
    return { customerPrice: 0, platformFee: 0, driverPayout: 0 };
  }
  
  const customerPrice = formState.customerPrice;
  const platformFeeRate = paymentType === 'ONLINE_PAYMENT' ? 0.15 : 0;
  const platformFee = customerPrice * platformFeeRate;
  const driverPayout = customerPrice - platformFee;
  
  return { customerPrice, platformFee, driverPayout };
};
```

## 🚀 Usage

### Adding to Navigation

```typescript
// In CustomerNavigator.tsx or CustomerTabNavigator.tsx
import { CreateJobScreen } from '@/screens/customer/job';

<Stack.Screen
  name="CreateJob"
  component={CreateJobScreen}
  options={{
    title: 'Create Job',
    headerShown: false, // Screen has its own header
  }}
/>
```

### Navigating to the Screen

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to job creation
navigation.navigate('CreateJob');

// After successful creation, navigate to job detail
navigation.navigate('OrderDetail', { orderId: result.data.id });
```

### Using Individual Components

```typescript
// Use MapPicker standalone
import { MapPicker } from '@/screens/customer/job';

<MapPicker
  label="Select Location"
  onLocationSelect={(address, lat, lng) => {
    console.log('Selected:', address, lat, lng);
  }}
  defaultAddress="Tbilisi, Georgia"
  defaultLat={41.7151}
  defaultLng={44.8271}
/>

// Use PhotoUpload standalone
import { PhotoUpload } from '@/screens/customer/job';

<PhotoUpload
  maxPhotos={5}
  photos={photoUrls}
  onPhotosChange={(urls) => setPhotoUrls(urls)}
  label="Upload Photos"
/>
```

## 📦 Dependencies

### Required Packages

```json
{
  "dependencies": {
    "react-native-maps": "^1.11.0",
    "@react-native-community/geolocation": "^3.1.0",
    "react-native-image-picker": "^7.0.0",
    "@react-native-community/datetimepicker": "^7.6.0",
    "@supabase/supabase-js": "^2.38.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0"
  }
}
```

### Installation

```bash
npm install react-native-maps @react-native-community/geolocation react-native-image-picker @react-native-community/datetimepicker

# For iOS
cd ios && pod install && cd ..
```

### Android Setup

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<application>
  <!-- Google Maps API Key -->
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

### iOS Setup

Add to `ios/delivery-marketplace-app/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to set pickup and delivery addresses</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos of items</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select photos</string>
```

## 🎨 Styling

All components use the existing design system:
- **Colors**: `@/constants/Colors`
- **Spacing**: `@/constants/Spacing`
- **Typography**: Consistent font sizes and weights

The UI is designed to be:
- Clean and modern
- Easy to navigate
- Mobile-optimized
- Accessible
- Responsive

## 🔐 Permissions

The app requires runtime permissions for:
1. **Location** - For map picking
2. **Camera** - For taking photos
3. **Photo Library** - For selecting existing photos

Permissions are requested automatically when needed.

## ⚠️ Important Notes

### Google Maps API

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `MapPicker.tsx` with your actual API key:

```typescript
const response = await fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_ACTUAL_API_KEY`
);
```

### Supabase Storage

Ensure Supabase Storage bucket `jobs` is created with proper policies:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('jobs', 'jobs', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload job photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jobs');

-- Allow public read access
CREATE POLICY "Anyone can view job photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jobs');
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Move job creation (full flow)
- [ ] Recycle job creation (with center selection)
- [ ] Gift job creation (skipped delivery)
- [ ] Map picker (search, current location, drag)
- [ ] Photo upload (camera, gallery, removal)
- [ ] Validation (all fields, all steps)
- [ ] Pricing calculation (cash vs online)
- [ ] Date/time picker
- [ ] Cancel confirmation
- [ ] Navigation (next, back, cancel)
- [ ] Error handling (API errors, moderation)
- [ ] Success navigation to job detail

## 🐛 Troubleshooting

### Maps Not Showing
- Check Google Maps API key
- Verify Android/iOS permissions
- Enable Maps SDK for Android/iOS in Google Cloud Console

### Photos Not Uploading
- Check Supabase configuration
- Verify storage bucket exists
- Check permissions policies

### Geolocation Errors
- Request location permissions
- Enable location services on device
- Check AndroidManifest.xml/Info.plist

## 🔄 Future Enhancements

Potential improvements:
- [ ] Address autocomplete suggestions
- [ ] Save draft jobs
- [ ] Multi-language support for map addresses
- [ ] Estimated delivery time calculation
- [ ] Real-time distance calculation
- [ ] Photo compression before upload
- [ ] Offline support
- [ ] Job templates for repeat deliveries

## 📝 License

This implementation is part of the delivery marketplace app project.

## 👥 Support

For questions or issues, please contact the development team.

