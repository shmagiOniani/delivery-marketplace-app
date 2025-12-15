# Job Creation Form Specification

## Overview

This document specifies the complete implementation of the job creation form (order form) for the Delivery Marketplace React Native mobile application. The form consists of 4 sequential steps with a stepper component showing progress.

**Form Flow:** Step 1 → Step 2 → Step 3 → Step 4 → Order Success Screen

---

## Table of Contents

1. [Form Structure](#form-structure)
2. [Step-by-Step Breakdown](#step-by-step-breakdown)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Validation Rules](#validation-rules)
6. [UI Components](#ui-components)
7. [Error Handling](#error-handling)
8. [Navigation Flow](#navigation-flow)
9. [Permissions](#permissions)
10. [Internationalization](#internationalization)
11. [Testing Checklist](#testing-checklist)
12. [Performance Considerations](#performance-considerations)

---

## Form Structure

### Step 1: Cargo Type Selection
**Screen:** `NewOrderStep1Screen.tsx`  
**Purpose:** User selects the type of cargo/item to be delivered

**Fields:**
- Cargo Type (required): One of:
  - `small` - Small item (პატარა ამანათი)
  - `furniture` - Furniture (ავეჯი)
  - `documents` - Documents (დოკუმენტები)
  - `household` - Household items (საყოფაცხხო ნივთები)

**UI Elements:**
- Stepper component showing Step 1 of 4
- Grid layout (2x2) with cargo type cards
- Each card displays:
  - Icon (MaterialIcons)
  - English label
  - Georgian label
  - Selection highlight (yellow border + background)
- Continue button (disabled until selection)

**Validation:**
- Must select one cargo type before proceeding

---

### Step 2: Map and Address Input
**Screen:** `NewOrderStep2Screen.tsx`  
**Purpose:** User selects pickup and delivery locations

**Fields:**
- Pickup Address (required): Text input
- Delivery Address (required): Text input
- Distance: Calculated/displayed (km)
- Time Estimate: Calculated/displayed (minutes)

**UI Elements:**
- Stepper component showing Step 2 of 4
- Map view placeholder (top half of screen)
  - Pickup pin (dark blue)
  - Delivery pin (yellow)
  - Route line connecting pins
- Information card (slides up from bottom):
  - Distance and time estimate display
  - Pickup address input field with location icon
  - Delivery address input field with location icon
  - "Current location" button with send icon
- Continue button (disabled until both addresses filled)

**Validation:**
- Both pickup and delivery addresses required
- Addresses should be different

**Future Enhancement:**
- Integrate with actual map library (react-native-maps)
- Geocoding for address → coordinates
- Reverse geocoding for current location
- Route calculation API integration

---

### Step 3: Item Details and Photos
**Screen:** `NewOrderStep3Screen.tsx`  
**Purpose:** User provides detailed information about the item

**Fields:**
- Photos: Array of image URIs (max 5)
- Description: Text area (max 500 characters)
- Weight: Dropdown selection
  - `light`
  - `medium`
  - `heavy`
- Size: Dropdown selection
  - `small`
  - `medium`
  - `large`
  - `xlarge`
- Fragile: Boolean toggle switch
- Pickup Contact Name: Text input
- Pickup Contact Floor: Text input (optional)

**UI Elements:**
- Stepper component showing Step 3 of 4
- Photo upload grid (5 square placeholders)
  - First placeholder shows box icon (if photo added)
  - Others show "+" icon for adding
- Description text area with character counter (X/500)
- Weight selection buttons (horizontal row)
- Size selection buttons (horizontal row)
- Fragile toggle with info icon
- Pickup contact section with name and floor fields
- Continue button

**Validation:**
- Description: Max 500 characters
- Weight: Must select one option
- Size: Must select one option
- Pickup contact name: Required

**Future Enhancement:**
- Image picker integration (react-native-image-picker)
- Image compression before upload
- Image preview and delete functionality
- Camera integration for direct photo capture

---

### Step 4: Contact and Price Estimate
**Screen:** `NewOrderStep4Screen.tsx`  
**Purpose:** Final confirmation with contact details and pricing

**Fields:**
- Distance: Display only (from Step 2)
- Time Estimate: Display only (from Step 2)
- Pickup Contact Name: Text input (pre-filled from Step 3)
- Pickup Contact Floor: Text input (optional, pre-filled from Step 3)
- Delivery Contact Name: Text input (required)
- Delivery Contact Floor: Text input (optional)
- Price: Display only ($60.00)
- Service Fee: Display only ($10.00)
- Total: Display only ($70.00)
- Time Preference: Selection
  - `flexible` - Flexible timing
  - `specific` - Specific time (future: time picker)

**UI Elements:**
- Stepper component showing Step 4 of 4
- Distance and time estimate display (top)
- Pickup contact section
- Delivery contact section
- Price breakdown card:
  - Price line item
  - Service fee line item
  - Total (highlighted, larger font)
- Time preference selector (two buttons)
- Continue button (submits order)

**Validation:**
- Delivery contact name: Required
- All previous step validations must pass

**Future Enhancement:**
- Dynamic price calculation based on distance/weight/size
- Time picker for specific time selection
- Payment method selection
- Scheduled pickup date/time picker

---

## State Management

### Store: `useOrderFormStore.ts`

**Technology:** Zustand

**State Structure:**
```typescript
interface OrderFormData {
  // Step 1
  cargoType: CargoType | null;
  
  // Step 2
  pickupAddress: PickupAddress | null;
  deliveryAddress: DeliveryAddress | null;
  distance?: number;
  timeEstimate?: number;
  
  // Step 3
  photos: string[];
  description: string;
  weight: WeightOption | null;
  size: SizeOption | null;
  fragile: boolean;
  
  // Step 4
  price?: number;
  serviceFee?: number;
  timePreference?: 'flexible' | 'specific';
  specificTime?: string;
}
```

**Methods:**
- `updateFormData(data: Partial<OrderFormData>)` - Update form data
- `resetForm()` - Clear all form data

**Usage Pattern:**
- Each step screen reads from store
- Each step screen updates store on continue
- Store persists data across navigation
- Store cleared after successful order creation

---

## API Integration

### Endpoint: `POST /api/jobs`

**Method:** POST  
**Content-Type:** `multipart/form-data` (for file uploads)  
**Authentication:** Required (Bearer token)

### FormData Mapping

| Form Field | API Field | Type | Required | Notes |
|------------|-----------|------|----------|-------|
| Step 1: cargoType | `item_category` | string | Yes | Maps: small→"Small", furniture→"Furniture", etc. |
| Step 2: pickupAddress.address | `pickup_address` | string | Yes | Full address string |
| Step 2: pickupAddress | `pickup_lat` | number | Yes | From geocoding |
| Step 2: pickupAddress | `pickup_lng` | number | Yes | From geocoding |
| Step 3: pickupName | `pickup_contact_name` | string | Yes | |
| Step 3: pickupFloor | `pickup_notes` | string | No | Included in notes |
| Step 2: deliveryAddress.address | `delivery_address` | string | Yes | Full address string |
| Step 2: deliveryAddress | `delivery_lat` | number | Yes | From geocoding |
| Step 2: deliveryAddress | `delivery_lng` | number | Yes | From geocoding |
| Step 4: deliveryName | `delivery_contact_name` | string | Yes | |
| Step 4: deliveryFloor | `delivery_notes` | string | No | Included in notes |
| Step 3: photos | `pickup_photos` | File[] | No | Array of image files |
| Step 3: description | `description` | string | No | Max 500 chars |
| Step 3: weight | `item_weight` | string | No | light/medium/heavy |
| Step 3: size | `item_size` | string | No | small/medium/large/xlarge |
| Step 3: fragile | `requires_help` | boolean | No | Maps to requires_help |
| Step 4: price | `customer_price` | number | Yes | Calculated |
| Step 4: serviceFee | `platform_fee` | number | Yes | Calculated |
| Step 4: total | `driver_payout` | number | Yes | customer_price - platform_fee |
| Step 4: timePreference | `scheduled_pickup` | string | No | ISO datetime if specific |
| - | `job_type` | string | Yes | Always "move" for now |
| - | `title` | string | Yes | Generated from cargoType |
| - | `payment_type` | string | Yes | Default: "ONLINE_PAYMENT" |

### API Request Example

```typescript
const formData = new FormData();

// Basic fields
formData.append('title', `Move ${cargoType} from ${pickupAddress} to ${deliveryAddress}`);
formData.append('job_type', 'move');
formData.append('description', description);
formData.append('item_category', cargoType);
formData.append('item_size', size);
formData.append('item_weight', weight);
formData.append('requires_help', fragile.toString());

// Addresses
formData.append('pickup_address', pickupAddress.address);
formData.append('pickup_lat', pickupLat.toString());
formData.append('pickup_lng', pickupLng.toString());
formData.append('pickup_contact_name', pickupName);
formData.append('pickup_notes', pickupFloor || '');

formData.append('delivery_address', deliveryAddress.address);
formData.append('delivery_lat', deliveryLat.toString());
formData.append('delivery_lng', deliveryLng.toString());
formData.append('delivery_contact_name', deliveryName);
formData.append('delivery_notes', deliveryFloor || '');

// Pricing
formData.append('customer_price', price.toString());
formData.append('platform_fee', serviceFee.toString());
formData.append('driver_payout', (price - serviceFee).toString());
formData.append('payment_type', 'ONLINE_PAYMENT');

// Photos
photos.forEach((photoUri, index) => {
  formData.append('pickup_photos', {
    uri: photoUri,
    type: 'image/jpeg',
    name: `photo_${index}.jpg`,
  } as any);
});

// Time preference
if (timePreference === 'specific' && specificTime) {
  formData.append('scheduled_pickup', specificTime);
}
```

### API Response Handling

**Success Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    // ... Job object
  },
  reasons?: string[] // Content moderation warnings
}
```

**Error Response:**
```typescript
{
  success: false,
  error: string,
  reasons?: string[] // Validation errors
}
```

### Mutation Hook: `useCreateOrderMutation`

**Location:** `src/hooks/mutations/useOrderMutations.ts`

**Usage:**
```typescript
const createOrder = useCreateOrderMutation();

const handleSubmit = async () => {
  const formData = buildFormData(orderFormStore.formData);
  await createOrder.mutateAsync(formData);
  // Navigate to success screen
};
```

---

## Validation Rules

### Step 1 Validation
- ✅ Cargo type must be selected

### Step 2 Validation
- ✅ Pickup address required
- ✅ Delivery address required
- ✅ Pickup and delivery addresses must be different
- ⚠️ Addresses should be valid (future: geocoding validation)

### Step 3 Validation
- ✅ Description max 500 characters
- ✅ Weight selection required
- ✅ Size selection required
- ✅ Pickup contact name required
- ⚠️ At least one photo recommended (not enforced)

### Step 4 Validation
- ✅ Delivery contact name required
- ✅ All previous step validations must pass
- ✅ Price must be calculated

### Cross-Step Validation
- Form data must be complete before submission
- All required fields from previous steps must be filled

---

## UI Components

### Stepper Component

**File:** `src/components/ui/Stepper.tsx`

**Props:**
```typescript
interface StepperProps {
  currentStep: number; // 1-4
  totalSteps: number; // 4
}
```

**Visual Design:**
- Horizontal layout with 4 step circles
- Active step: Yellow background (#EAB308)
- Completed steps: Green background with checkmark
- Inactive steps: Gray background with step number
- Connector lines between steps (gray, green when completed)

**Styling:**
- Step circle: 32x32px, rounded
- Connector: 40px width, 2px height
- Colors from `Colors` constant

### Form Input Components

**Input Component:** `src/components/ui/Input.tsx`
- Standardized text input with label
- Optional icon support
- Error message display
- Consistent styling

**Button Component:** `src/components/ui/Button.tsx`
- Primary variant: Yellow background
- Secondary variant: White with yellow border
- Loading state support
- Icon support
- Disabled state

### Design System

**Colors:** `src/constants/Colors.ts`
- Primary: `#EAB308` (Yellow)
- Dark: `#0F172A` (Dark blue)
- Success: `#16A34A` (Green)
- Error: `#EF4444` (Red)
- Background: `#F1F5F9` (Light gray)
- White: `#FFFFFF`

**Typography:** `src/constants/Typography.ts`
- h1: 32px, bold
- h2: 24px, bold
- h3: 20px, semibold
- body: 16px, regular
- small: 14px, regular
- tiny: 12px, regular

**Spacing:** `src/constants/Spacing.ts`
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

---

## Error Handling

### Validation Errors
- Display inline error messages below input fields
- Disable continue button until validation passes
- Show error summary on form submission

### API Errors
- Network errors: Show retry option
- Validation errors: Display `reasons` array
- Content moderation: Show warnings but allow submission
- Server errors: Show generic error message

### Upload Errors
- Photo upload failures: Show error, allow retry
- Large file errors: Show size limit message
- Format errors: Show supported formats

### Error Display Components
- Use `showErrorAlert` utility for API errors
- Inline validation errors in Input components
- Toast notifications for non-critical errors

---

## Navigation Flow

### Entry Points
1. **Home Screen:** Tap "Create Order" button → Navigate to `NewOrderStep1`
2. **Orders List:** Tap "+" button → Navigate to `NewOrderStep1`

### Step Navigation
- **Step 1 → Step 2:** On "Continue" button press
- **Step 2 → Step 3:** On "Continue" button press
- **Step 3 → Step 4:** On "Continue" button press
- **Step 4 → Success:** On "Continue" button press (after API call)

### Exit Points
- **Back Button:** Navigate to previous step (preserves data)
- **Cancel:** Show confirmation dialog, reset form, navigate to Home
- **Success Screen:** Navigate to Home or Order Tracking

### Navigation Stack
```
CustomerTabs (Home)
  └─> NewOrderStep1
      └─> NewOrderStep2
          └─> NewOrderStep3
              └─> NewOrderStep4
                  └─> OrderSuccess
                      └─> OrderTracking (optional)
```

---

## Permissions

### Required Permissions

**Location Permission:**
- Purpose: Get current location, geocode addresses
- Request: On Step 2 when user taps "Current location"
- Platform: iOS (NSLocationWhenInUseUsageDescription), Android (ACCESS_FINE_LOCATION)

**Camera Permission:**
- Purpose: Take photos of items
- Request: On Step 3 when user taps photo placeholder
- Platform: iOS (NSCameraUsageDescription), Android (CAMERA)

**Photo Library Permission:**
- Purpose: Select photos from gallery
- Request: On Step 3 when user taps photo placeholder
- Platform: iOS (NSPhotoLibraryUsageDescription), Android (READ_EXTERNAL_STORAGE)

### Permission Handling
- Request permissions on-demand (not upfront)
- Show explanation dialog before requesting
- Handle permission denial gracefully
- Provide fallback options (manual address entry, skip photos)

---

## Internationalization

### Translation Keys

**Step 1:**
- `cargo_type.title`: "აირჩიე ტვირთის ტიპი" / "Choose cargo type"
- `cargo_type.small`: "პატარა ამანათი" / "Small item"
- `cargo_type.furniture`: "ავეჯი" / "Furniture"
- `cargo_type.documents`: "დოკუმენტები" / "Documents"
- `cargo_type.household`: "საყოფაცხხო ნივთები" / "Household"
- `button.continue`: "გაგრძელება →" / "Continue →"

**Step 2:**
- `address.pickup`: "Pickup address"
- `address.delivery`: "Delivery address"
- `address.current_location`: "Current location"
- `info.distance`: "Distance"
- `info.time_estimate`: "Time estimate"
- `button.next`: "შემდეგი →" / "Next →"

**Step 3:**
- `photos.title`: "Photos"
- `description.title`: "Description (500 chars)"
- `weight.title`: "Weight"
- `size.title`: "Size"
- `fragile.title`: "Fragile"
- `contact.pickup`: "Pickup contact"

**Step 4:**
- `contact.delivery`: "Delivery contact"
- `price.title`: "Price"
- `price.service`: "Service"
- `price.total`: "Total"
- `time.title`: "Time picker"
- `time.flexible`: "Flexible"
- `time.specific`: "Specific"

### Implementation
- Use `i18n` utility from `src/i18n/`
- Support English (`en`) and Georgian (`ka`)
- Store language preference in `usePreferencesStore`

---

## Testing Checklist

### Functional Testing

**Step 1:**
- [ ] Can select each cargo type
- [ ] Selection highlights correctly
- [ ] Continue button disabled until selection
- [ ] Continue button navigates to Step 2

**Step 2:**
- [ ] Can enter pickup address
- [ ] Can enter delivery address
- [ ] "Current location" button works (with permission)
- [ ] Map displays (placeholder or real)
- [ ] Continue button disabled until both addresses filled
- [ ] Distance/time estimate displays

**Step 3:**
- [ ] Can add photos (with permission)
- [ ] Can enter description (max 500 chars)
- [ ] Character counter updates correctly
- [ ] Can select weight option
- [ ] Can select size option
- [ ] Fragile toggle works
- [ ] Can enter pickup contact info
- [ ] Continue button works

**Step 4:**
- [ ] Previous data pre-filled correctly
- [ ] Can enter delivery contact info
- [ ] Price breakdown displays correctly
- [ ] Time preference selection works
- [ ] Continue button submits order
- [ ] Navigates to success screen on success

**Cross-Step:**
- [ ] Form data persists between steps
- [ ] Back button preserves data
- [ ] Form resets after successful submission
- [ ] Form resets on cancel

### API Integration Testing

- [ ] FormData constructed correctly
- [ ] All required fields included
- [ ] Photos uploaded correctly
- [ ] Coordinates included (when available)
- [ ] Success response handled
- [ ] Error response handled
- [ ] Content moderation warnings displayed
- [ ] Loading state shown during submission

### UI/UX Testing

- [ ] Stepper updates correctly on each step
- [ ] All text readable and properly sized
- [ ] Buttons have proper touch targets (min 44x44px)
- [ ] Form scrolls properly on small screens
- [ ] Keyboard doesn't cover inputs
- [ ] Loading states visible
- [ ] Error messages clear and actionable
- [ ] Success screen displays correctly

### Edge Cases

- [ ] Very long addresses handled
- [ ] Special characters in text fields
- [ ] Empty form submission prevented
- [ ] Network failure handled gracefully
- [ ] Permission denial handled
- [ ] Large photos handled (compression)
- [ ] Multiple rapid submissions prevented
- [ ] Form state after app backgrounding

### Accessibility Testing

- [ ] Screen reader support
- [ ] Proper labels for all inputs
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Error messages announced

---

## Performance Considerations

### Optimization Strategies

1. **Image Handling:**
   - Compress images before upload
   - Limit image size (max 2MB per photo)
   - Use thumbnail previews
   - Lazy load photo grid

2. **Form State:**
   - Use Zustand for efficient state updates
   - Debounce address input for geocoding
   - Memoize expensive calculations

3. **Navigation:**
   - Lazy load step screens
   - Preload next step data when possible
   - Optimize re-renders with React.memo

4. **API Calls:**
   - Batch address geocoding requests
   - Show loading states during submission
   - Implement request cancellation
   - Cache geocoding results

5. **Bundle Size:**
   - Code split step screens
   - Lazy load map library (if used)
   - Tree-shake unused dependencies

### Memory Management

- Clear form data after successful submission
- Dispose of image resources after upload
- Cancel pending API requests on unmount
- Limit photo array size (max 5)

---

## Dependencies

### Required Packages

```json
{
  "@react-navigation/native": "^7.1.24",
  "@react-navigation/stack": "^7.6.11",
  "zustand": "^4.x.x",
  "react-native-vector-icons": "^10.x.x",
  "@tanstack/react-query": "^5.x.x"
}
```

### Optional Packages (Future)

```json
{
  "react-native-maps": "^1.x.x",
  "react-native-image-picker": "^7.x.x",
  "react-native-geocoding": "^2.x.x",
  "react-native-permissions": "^4.x.x"
}
```

---

## File Structure

```
src/
├── components/
│   └── ui/
│       ├── Stepper.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ...
├── screens/
│   └── customer/
│       └── order/
│           ├── NewOrderStep1Screen.tsx
│           ├── NewOrderStep2Screen.tsx
│           ├── NewOrderStep3Screen.tsx
│           ├── NewOrderStep4Screen.tsx
│           └── OrderSuccessScreen.tsx
├── stores/
│   └── useOrderFormStore.ts
├── hooks/
│   └── mutations/
│       └── useOrderMutations.ts
└── types/
    └── navigation.ts
```

---

## Implementation Status

### ✅ Completed
- [x] Stepper component
- [x] Step 1: Cargo type selection
- [x] Step 2: Address input (UI only)
- [x] Step 3: Item details form
- [x] Step 4: Contact and price
- [x] Form state management (Zustand)
- [x] Navigation flow
- [x] Profile screen with logout

### 🚧 In Progress / TODO
- [ ] Map integration (react-native-maps)
- [ ] Geocoding integration
- [ ] Photo picker integration
- [ ] API integration in Step 4
- [ ] Dynamic price calculation
- [ ] Time picker for specific time
- [ ] Form validation improvements
- [ ] Error handling enhancements
- [ ] Internationalization implementation
- [ ] Permission handling
- [ ] Image compression
- [ ] Unit tests
- [ ] E2E tests

---

## Future Enhancements

1. **Smart Address Input:**
   - Autocomplete suggestions
   - Recent addresses
   - Saved addresses

2. **Advanced Pricing:**
   - Real-time price calculation
   - Distance-based pricing
   - Weight/size multipliers
   - Surge pricing

3. **Enhanced Photos:**
   - Multiple photo uploads
   - Photo editing (crop, rotate)
   - Photo annotations

4. **Scheduling:**
   - Calendar picker
   - Time slot selection
   - Recurring orders

5. **Order Templates:**
   - Save common orders
   - Quick reorder
   - Favorite addresses

---

## Notes

- Form data is stored in Zustand store and persists across navigation
- Form is reset after successful order creation
- All step screens are part of CustomerNavigator stack
- Stepper component is reusable and can be used in other multi-step flows
- API integration uses FormData for file uploads
- Error handling includes content moderation warnings
- Design follows existing app design system (Colors, Typography, Spacing)

---

**Last Updated:** 2024-12-XX  
**Version:** 1.0.0  
**Author:** Development Team

