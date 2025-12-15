# Job Creation Form - React Native Implementation Specification

## Overview
This document provides a detailed specification for implementing the job creation form in React Native. The form is a multi-step wizard that allows customers to create delivery jobs (Move, Recycle, or Gift types).

---

## Form Structure

### Multi-Step Wizard
The form consists of **4-5 steps** depending on job type:
1. **Step 1: Job Type & Title** (always shown)
2. **Step 2: Pickup Location** (always shown)
3. **Step 3: Delivery Location** (skipped for "gift" type)
4. **Step 4: Item Details** (always shown)
5. **Step 5: Payment & Review** (optional, can be merged with Step 4)

---

## Step 1: Job Type & Title

### UI Components Needed
- **Header**: Step title "Delivery Type" / "მიწოდების ტიპი"
- **Progress Indicator**: Show current step (1 of 4-5)
- **Title Input Field**:
  - Type: Text input
  - Label: "Title" / "სათაური" *
  - Placeholder: "e.g., Moving furniture from apartment"
  - Required: Yes
  - Validation: Non-empty string, min 3 characters
  - State: `formData.title` (string)

- **Job Type Selection** (Radio Group):
  - Display: Three large cards in a row/column
  - Selection: Single choice (radio buttons)
  - Options:
    1. **Move** / "გადატანა"
       - Icon: Truck/Move icon
       - Description: "From one place to another" / "ერთი ადგილიდან მეორეში"
       - Value: `"move"`
    2. **Recycle** / "რეციკლირება"
       - Icon: Recycle icon
       - Description: "Take to recycle/trash" / "რეციკლირებაში გადატანა"
       - Value: `"recycle"`
    3. **Gift** / "საჩუქარი"
       - Icon: Gift icon
       - Description: "Free pickup, no charges" / "უფასო აღება"
       - Value: `"gift"`

- **Visual States**:
  - Selected card: Yellow border (#EAB308), purple background (#F3E8FF)
  - Unselected card: Gray border (#CBD5E1), white background
  - Cards should be tappable and show visual feedback

### State Management
```typescript
const [jobType, setJobType] = useState<"move" | "recycle" | "gift">("move");
const [formData, setFormData] = useState<{
  title: string;
  description?: string;
}>({ title: "" });
```

### Validation
- Title must be provided and non-empty
- Job type must be selected
- Title minimum length: 3 characters

### Navigation
- **Next Button**: Enabled when title and job type are valid
- **Cancel Button**: Navigate back to dashboard

---

## Step 2: Pickup Location

### UI Components Needed
- **Header**: "Pickup Location" / "აღების ლოკაცია"
- **Map Picker Component**:
  - Interactive map view (react-native-maps)
  - Search bar for address autocomplete
  - "Select on Map" button
  - Current location button (GPS)
  - Selected address display
  - Map marker showing selected location
  - Height: ~300-400px

- **Contact Information** (2-column grid):
  - **Pickup Contact Name**:
    - Type: Text input
    - Label: "Contact Name" / "კონტაქტის სახელი"
    - Placeholder: "John Doe"
    - Required: No
    - State: `pickupContactName` (string)
    - Pre-fill: User's profile name (if available)

  - **Pickup Contact Phone**:
    - Type: Phone input (numeric keyboard)
    - Label: "Contact Phone" / "კონტაქტის ტელეფონი"
    - Placeholder: "+995 555 123 456"
    - Required: No
    - State: `pickupContactPhone` (string)
    - Pre-fill: User's profile phone (if available)

- **Pickup Notes**:
  - Type: Multi-line text input
  - Label: "Pickup Notes" / "აღების შენიშვნები"
  - Placeholder: "Special instructions for pickup"
  - Rows: 3-4
  - Required: No
  - State: `pickupNotes` (string)

- **Floor & Elevator** (2-column grid):
  - **Pickup Floor**:
    - Type: Number input
    - Label: "Floor" / "სართული"
    - Placeholder: "0"
    - Min: 0
    - Required: No
    - State: `pickupFloor` (string)

  - **Elevator Checkbox**:
    - Type: Checkbox/Switch
    - Label: "Has Elevator" / "ლიფტი აქვს"
    - State: `pickupElevator` (boolean)
    - Default: false

- **Photo Upload Section**:
  - Label: "Photos of Item" / "ნივთის ფოტოები"
  - Component: Image picker with preview grid
  - Max photos: 3-5
  - Features:
    - "Add Photo" button
    - Camera option
    - Gallery option
    - Remove photo option
    - Image preview grid
  - State: `pickupPhotos` (string[] - array of image URLs)
  - Upload to Supabase Storage before form submission

### State Management
```typescript
const [pickupLocation, setPickupLocation] = useState<{
  address: string;
  lat: number;
  lng: number;
} | null>(null);

const [pickupContactName, setPickupContactName] = useState<string>("");
const [pickupContactPhone, setPickupContactPhone] = useState<string>("");
const [pickupNotes, setPickupNotes] = useState<string>("");
const [pickupFloor, setPickupFloor] = useState<string>("");
const [pickupElevator, setPickupElevator] = useState<boolean>(false);
const [pickupPhotos, setPickupPhotos] = useState<string[]>([]);
```

### Validation
- Pickup location (address, lat, lng) is required
- Address must be valid (non-empty)
- Coordinates must be valid numbers

### Map Picker Functionality
- **Address Search**:
  - Use Google Places API or similar
  - Autocomplete suggestions
  - Select address from suggestions
- **Map Selection**:
  - Long press or tap on map to select location
  - Reverse geocode to get address
  - Update marker position
- **Current Location**:
  - Request location permission
  - Get GPS coordinates
  - Reverse geocode to address
  - Center map on current location

### Navigation
- **Back Button**: Go to previous step
- **Next Button**: Enabled when pickup location is selected

---

## Step 3: Delivery Location

### Conditional Rendering
- **Skip this step** if `jobType === "gift"`
- **Show different UI** if `jobType === "recycle"`

### For "recycle" Type:
- **Recycling Location Selector**:
  - Type: Dropdown/Picker
  - Label: "Recycling Location" / "რეციკლირების ლოკაცია" *
  - Required: Yes
  - Options: Predefined list of recycling centers
  - Example locations:
    - "Tbilisi Central Recycling Center" (lat: 41.7151, lng: 44.8271)
    - "Vake Recycling Point" (lat: 41.6971, lng: 44.7756)
    - "Saburtalo Recycling Facility" (lat: 41.72, lng: 44.768)
    - "Isani Waste Management Center" (lat: 41.707, lng: 44.789)
    - "Gldani Recycling Station" (lat: 41.76, lng: 44.82)
  - State: `selectedRecyclingLocation` (string - location ID)
  - On selection: Auto-set delivery location coordinates

- **Read-only Map**:
  - Display selected recycling center location
  - Show marker
  - No interaction needed

### For "move" Type:
- **Map Picker Component** (same as pickup):
  - Interactive map
  - Address search
  - Location selection
  - State: `deliveryLocation` (same structure as pickup)

- **Contact Information** (2-column grid):
  - **Delivery Contact Name**: Text input
  - **Delivery Contact Phone**: Phone input
  - Pre-fill: User's profile info (if available)

- **Delivery Notes**: Multi-line text input

- **Floor & Elevator** (2-column grid):
  - **Delivery Floor**: Number input
  - **Elevator Checkbox**: Switch/Checkbox

### State Management
```typescript
const [deliveryLocation, setDeliveryLocation] = useState<{
  address: string;
  lat: number;
  lng: number;
} | null>(null);

const [selectedRecyclingLocation, setSelectedRecyclingLocation] = useState<string>("");

const [deliveryContactName, setDeliveryContactName] = useState<string>("");
const [deliveryContactPhone, setDeliveryContactPhone] = useState<string>("");
const [deliveryNotes, setDeliveryNotes] = useState<string>("");
const [deliveryFloor, setDeliveryFloor] = useState<string>("");
const [deliveryElevator, setDeliveryElevator] = useState<boolean>(false);
```

### Validation
- Delivery location required (unless gift type)
- For recycle: Recycling location must be selected
- For move: Map-selected location required

### Navigation
- **Back Button**: Go to previous step
- **Next Button**: Enabled when delivery location is valid

---

## Step 4: Item Details

### UI Components Needed
- **Header**: "Item Details" / "ნივთის დეტალები"

- **Description**:
  - Type: Multi-line text input
  - Label: "Description" / "აღწერა"
  - Placeholder: "e.g., 13 bags of construction waste. I think one person won't be enough"
  - Required: No (but recommended)
  - Rows: 4-5
  - State: `formData.description` (string)

- **Item Category** (Optional):
  - Type: Dropdown/Picker
  - Label: "Category" / "კატეგორია"
  - Options: Furniture, Electronics, Boxes, Construction Waste, etc.
  - State: `formData.item_category` (string)

- **Item Size** (Optional):
  - Type: Dropdown/Picker
  - Label: "Size" / "ზომა"
  - Options: Small, Medium, Large, XLarge
  - State: `formData.item_size` (string)

- **Item Weight** (Optional):
  - Type: Number input
  - Label: "Weight (kg)" / "წონა (კგ)"
  - Placeholder: "5"
  - State: `formData.item_weight` (string)

- **Requires Help**:
  - Type: Checkbox/Switch
  - Label: "Need Help Loading" / "დახმარება სჭირდება დატვირთვაში"
  - State: `formData.requires_help` (boolean)
  - Default: false

- **Pricing & Scheduling Section** (Highlighted box with yellow background #FEF3C7):
  - **Your Price**:
    - Type: Number input (decimal)
    - Label: "Your Price" / "თქვენი ფასი" *
    - Placeholder: "500"
    - Step: 0.01
    - Min: 0
    - Required: Yes (unless gift type)
    - Disabled: If `jobType === "gift"` (shows "0")
    - State: `formData.customer_price` (string)
    - Note: For gift type, show message "Free pickup, no charges"

  - **Preferred Pickup Time**:
    - Type: DateTime picker
    - Label: "Preferred Pickup Time" / "სასურველი აღების დრო"
    - Format: Date and time
    - Required: No
    - State: `formData.scheduled_pickup` (string - ISO date string)

- **Price Calculator** (Optional - can be shown below price input):
  - Component: `CompactPriceCalculator`
  - Shows breakdown:
    - Base price
    - Distance cost
    - Floor cost (if applicable)
    - Platform fee (if online payment)
    - Total price
  - Auto-calculates based on:
    - Distance between pickup and delivery
    - Floor numbers
    - Elevator availability
    - Item weight/size
  - Updates as user changes inputs

### State Management
```typescript
const [formData, setFormData] = useState<{
  title: string;
  description?: string;
  item_category?: string;
  item_size?: string;
  item_weight?: string;
  requires_help: boolean;
  customer_price: string;
  scheduled_pickup?: string;
}>({
  title: "",
  requires_help: false,
  customer_price: "",
});
```

### Validation
- Customer price required (unless gift type)
- Price must be > 0 (unless gift type)
- Scheduled pickup must be in the future (if provided)

### Price Calculation Logic
```typescript
// Platform fee calculation
const platformFee = paymentType === "CASH" 
  ? 0 
  : customerPrice * 0.15; // 15% for online payments

// Driver payout
const driverPayout = customerPrice - platformFee;

// For gift type
if (jobType === "gift") {
  customerPrice = 0;
  platformFee = 0;
  driverPayout = 0;
}
```

### Navigation
- **Back Button**: Go to previous step
- **Submit Button**: Create job (only on last step)

---

## Step 5: Payment & Review (Optional - can be merged with Step 4)

### UI Components Needed
- **Payment Type Selection** (Radio Group):
  - **Cash**:
    - Icon: Cash icon
    - Description: "Pay driver directly"
    - Value: `"CASH"`
    - Platform fee: 0%
  
  - **Online Payment**:
    - Icon: Credit card icon
    - Description: "Pay with card"
    - Value: `"ONLINE_PAYMENT"`
    - Platform fee: 15%

- **Price Breakdown Display**:
  - Customer Price: X GEL
  - Platform Fee: Y GEL (0 for cash, 15% for online)
  - Driver Payout: Z GEL
  - Total: X GEL

- **Review Summary**:
  - Job type
  - Title
  - Pickup address
  - Delivery address
  - Item description
  - Price
  - Payment method

### State Management
```typescript
const [paymentType, setPaymentType] = useState<"CASH" | "ONLINE_PAYMENT">("ONLINE_PAYMENT");
```

---

## Form Submission

### Submission Flow
1. **Validate all required fields**
2. **Upload photos to Supabase Storage** (if any)
3. **Prepare FormData object** with all fields
4. **Calculate pricing** (platform fee, driver payout)
5. **Call API**: `POST /api/jobs`
6. **Handle response**:
   - Success: Navigate to job detail page
   - Error: Show error message
   - Moderation flagged: Show warning but job is created

### FormData Structure
```typescript
const formData = new FormData();

// Required fields
formData.append("title", formData.title);
formData.append("job_type", jobType);
formData.append("pickup_address", pickupLocation.address);
formData.append("pickup_lat", pickupLocation.lat.toString());
formData.append("pickup_lng", pickupLocation.lng.toString());

// Delivery location (skip for gift)
if (jobType !== "gift") {
  formData.append("delivery_address", deliveryLocation.address);
  formData.append("delivery_lat", deliveryLocation.lat.toString());
  formData.append("delivery_lng", deliveryLocation.lng.toString());
}

// Contact information
formData.append("pickup_contact_name", pickupContactName);
formData.append("pickup_contact_phone", pickupContactPhone);
formData.append("pickup_notes", pickupNotes);
formData.append("pickup_floor", pickupFloor);
formData.append("pickup_elevator", pickupElevator.toString());

if (jobType !== "gift") {
  formData.append("delivery_contact_name", deliveryContactName);
  formData.append("delivery_contact_phone", deliveryContactPhone);
  formData.append("delivery_notes", deliveryNotes);
  formData.append("delivery_floor", deliveryFloor);
  formData.append("delivery_elevator", deliveryElevator.toString());
}

// Item details
formData.append("description", formData.description || "");
formData.append("item_category", formData.item_category || "");
formData.append("item_size", formData.item_size || "");
formData.append("item_weight", formData.item_weight || "");
formData.append("requires_help", formData.requires_help.toString());

// Photos (JSON stringified array of URLs)
formData.append("pickup_photos", JSON.stringify(pickupPhotos));

// Pricing
formData.append("payment_type", paymentType);
formData.append("customer_price", customerPrice.toString());
formData.append("platform_fee", platformFee.toFixed(2));
formData.append("driver_payout", driverPayout.toFixed(2));

// Scheduling
if (formData.scheduled_pickup) {
  formData.append("scheduled_pickup", formData.scheduled_pickup);
}
```

### API Request
```typescript
const response = await fetch(`${API_BASE_URL}/api/jobs`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    // Don't set Content-Type for FormData - browser will set it with boundary
  },
  body: formData,
});

const result = await response.json();

if (result.error) {
  // Handle error
  Alert.alert("Error", result.error);
} else if (result.reasons) {
  // Content was flagged but job created
  Alert.alert(
    "Warning",
    `Content contains prohibited material: ${result.reasons.join(", ")}`
  );
  // Navigate to job detail anyway
  navigation.navigate("JobDetail", { jobId: result.data.id });
} else {
  // Success
  navigation.navigate("JobDetail", { jobId: result.data.id });
}
```

---

## React Native Components Needed

### 1. Form Stepper Component
```typescript
interface FormStepperProps {
  steps: Array<{ key: string; label: string; icon?: any }>;
  currentStep: number;
}

// Display progress indicator with step labels
// Show checkmarks for completed steps
// Highlight current step
```

### 2. Map Picker Component
```typescript
interface MapPickerProps {
  label: string;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  defaultAddress?: string;
  defaultLat?: number;
  defaultLng?: number;
}

// Features:
// - react-native-maps MapView
// - Address search with autocomplete
// - Marker for selected location
// - Current location button
// - Reverse geocoding
```

### 3. Photo Upload Component
```typescript
interface PhotoUploadProps {
  maxPhotos: number;
  onPhotosChange: (urls: string[]) => void;
  photos?: string[];
}

// Features:
// - Image picker (react-native-image-picker)
// - Camera option
// - Gallery option
// - Image preview grid
// - Remove photo
// - Upload to Supabase Storage
// - Show upload progress
```

### 4. Price Calculator Component
```typescript
interface PriceCalculatorProps {
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  itemSize?: string;
  itemWeight?: string;
  pickupFloor?: number;
  pickupElevator: boolean;
  deliveryFloor?: number;
  deliveryElevator: boolean;
  customerPrice: number;
  paymentType: "CASH" | "ONLINE_PAYMENT";
}

// Features:
// - Calculate distance using route API
// - Calculate price breakdown
// - Display breakdown in card
// - Update in real-time
```

### 5. Job Type Card Component
```typescript
interface JobTypeCardProps {
  type: "move" | "recycle" | "gift";
  label: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

// Features:
// - Visual card with border
// - Selected state styling
// - Tap to select
// - Icon display
```

---

## State Management Structure

### Complete Form State
```typescript
interface JobFormState {
  // Step 1
  jobType: "move" | "recycle" | "gift";
  title: string;
  
  // Step 2
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  pickupContactName: string;
  pickupContactPhone: string;
  pickupNotes: string;
  pickupFloor: string;
  pickupElevator: boolean;
  pickupPhotos: string[];
  
  // Step 3
  deliveryLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  selectedRecyclingLocation: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  deliveryNotes: string;
  deliveryFloor: string;
  deliveryElevator: boolean;
  
  // Step 4
  description: string;
  item_category?: string;
  item_size?: string;
  item_weight?: string;
  requires_help: boolean;
  customer_price: string;
  scheduled_pickup?: string;
  
  // Step 5
  paymentType: "CASH" | "ONLINE_PAYMENT";
  
  // UI State
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

### Recommended State Management
- **Zustand** or **React Context** for form state
- **React Hook Form** for form validation (optional)
- **React Query** for API calls and caching

---

## Validation Rules

### Step 1 Validation
```typescript
const validateStep1 = (): boolean => {
  return !!jobType && !!title && title.trim().length >= 3;
};
```

### Step 2 Validation
```typescript
const validateStep2 = (): boolean => {
  return !!pickupLocation && 
         !!pickupLocation.address && 
         !!pickupLocation.lat && 
         !!pickupLocation.lng;
};
```

### Step 3 Validation
```typescript
const validateStep3 = (): boolean => {
  if (jobType === "gift") return true;
  
  if (jobType === "recycle") {
    return !!selectedRecyclingLocation;
  }
  
  return !!deliveryLocation && 
         !!deliveryLocation.address && 
         !!deliveryLocation.lat && 
         !!deliveryLocation.lng;
};
```

### Step 4 Validation
```typescript
const validateStep4 = (): boolean => {
  if (jobType === "gift") return true;
  
  const price = parseFloat(customer_price);
  return !isNaN(price) && price > 0;
};
```

---

## Error Handling

### Validation Errors
- Show inline error messages below fields
- Highlight invalid fields with red border
- Disable "Next" button until step is valid
- Show error summary at top of form (optional)

### API Errors
- Network errors: Show retry option
- Validation errors: Show field-specific errors
- Server errors: Show generic error message
- Moderation errors: Show warning but allow navigation

### Photo Upload Errors
- Show error for failed uploads
- Allow retry for failed uploads
- Show upload progress
- Handle storage quota errors

---

## UI/UX Guidelines

### Design System
- **Primary Color**: #EAB308 (Yellow)
- **Dark Text**: #0F172A, #1E293B
- **Light Text**: #64748B
- **Background**: #FFFFFF
- **Light Background**: #F1F5F9, #E2E8F0
- **Warning Background**: #FEF3C7
- **Border Color**: #CBD5E1, #E2E8F0

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Small Text**: Regular, 12px
- **Labels**: Medium, 14px

### Spacing
- **Card Padding**: 16-24px
- **Field Spacing**: 12-16px
- **Section Spacing**: 24-32px

### Components
- **Buttons**: Rounded corners (20px), padding 12-16px
- **Inputs**: Rounded corners (8px), border 1px
- **Cards**: Rounded corners (12px), shadow/elevation
- **Icons**: 20-24px size

### Animations
- Smooth transitions between steps
- Loading states with spinners
- Success/error feedback animations
- Photo upload progress indicators

---

## Navigation Flow

### Entry Point
- From Dashboard: Tap "Create New Job" button
- Navigate to: `CreateJobScreen`

### Step Navigation
- **Next**: Validate current step → Move to next step
- **Back**: Move to previous step (preserve data)
- **Cancel**: Show confirmation → Navigate to Dashboard

### Exit Points
- **Success**: Navigate to `JobDetailScreen` with new job ID
- **Error**: Stay on form, show error message
- **Cancel**: Navigate back to Dashboard

---

## Permissions Required

### Location Permission
- Request: `ACCESS_FINE_LOCATION` (Android), `LocationWhenInUse` (iOS)
- Usage: Get current location for map picker
- Request timing: When user opens map picker

### Camera Permission
- Request: `CAMERA` (Android), `Camera` (iOS)
- Usage: Take photos for items
- Request timing: When user taps "Take Photo"

### Storage Permission
- Request: `READ_EXTERNAL_STORAGE` (Android), `PhotoLibrary` (iOS)
- Usage: Select photos from gallery
- Request timing: When user taps "Choose from Gallery"

---

## Internationalization

### Translation Keys
```typescript
{
  "jobs.deliveryType": "Delivery Type",
  "jobs.title": "Title",
  "jobs.titlePlaceholder": "e.g., Moving furniture",
  "jobs.jobType": "Job Type",
  "jobs.move": "Move",
  "jobs.fromOnePlaceToAnother": "From one place to another",
  "jobs.recycle": "Recycle",
  "jobs.takeToRecycleTrash": "Take to recycle/trash",
  "jobs.gift": "Gift",
  "jobs.freePickupNoCharges": "Free pickup, no charges",
  "jobs.pickupLocation": "Pickup Location",
  "jobs.pickupAddress": "Pickup Address",
  "jobs.contactName": "Contact Name",
  "jobs.contactPhone": "Contact Phone",
  "jobs.pickupNotes": "Pickup Notes",
  "jobs.pickupFloor": "Floor",
  "jobs.pickupElevator": "Has Elevator",
  "jobs.photosOfItem": "Photos of Item",
  "jobs.deliveryLocation": "Delivery Location",
  "jobs.deliveryAddress": "Delivery Address",
  "jobs.recyclingLocation": "Recycling Location",
  "jobs.selectRecyclingLocation": "Select Recycling Location",
  "jobs.itemDetails": "Item Details",
  "jobs.description": "Description",
  "jobs.needHelpLoading": "Need Help Loading",
  "jobs.yourPrice": "Your Price",
  "jobs.preferredPickupTime": "Preferred Pickup Time",
  "jobs.paymentType": "Payment Type",
  "jobs.cash": "Cash",
  "jobs.onlinePayment": "Online Payment",
  "common.next": "Next",
  "common.back": "Back",
  "common.cancel": "Cancel",
  "jobs.creating": "Creating...",
  "jobs.createDelivery": "Create Delivery",
  "jobs.failedToCreateJob": "Failed to create job"
}
```

### Language Support
- **English** (en)
- **Georgian** (ka)

---

## Testing Checklist

### Functional Testing
- [ ] All steps can be navigated forward and backward
- [ ] Validation works for each step
- [ ] Job type selection works correctly
- [ ] Map picker allows location selection
- [ ] Photo upload works (camera and gallery)
- [ ] Price calculation is correct
- [ ] Form submission creates job successfully
- [ ] Error handling works for all error cases
- [ ] Gift type skips delivery location step
- [ ] Recycle type shows recycling location picker

### UI/UX Testing
- [ ] Progress indicator shows correct step
- [ ] Buttons are enabled/disabled correctly
- [ ] Loading states display during submission
- [ ] Error messages are clear and helpful
- [ ] Form data persists when navigating back
- [ ] Keyboard doesn't cover input fields
- [ ] Scroll works on all steps
- [ ] Images display correctly

### Edge Cases
- [ ] No internet connection during submission
- [ ] Photo upload fails
- [ ] Location permission denied
- [ ] Camera permission denied
- [ ] Invalid coordinates
- [ ] Very long text inputs
- [ ] Special characters in inputs
- [ ] Content moderation flags job

---

## Performance Considerations

### Optimization
- **Lazy load** map component (only when needed)
- **Debounce** address search input
- **Compress images** before upload
- **Cache** pricing configuration
- **Memoize** expensive calculations
- **Virtualize** long lists (if any)

### Memory Management
- **Cleanup** map listeners on unmount
- **Release** image resources after upload
- **Cancel** pending API requests on navigation

---

## Dependencies Required

```json
{
  "react-native": "^0.74.0",
  "react-native-maps": "^1.14.0",
  "react-native-image-picker": "^7.1.0",
  "react-native-geolocation-service": "^5.3.1",
  "@react-native-community/geolocation": "^3.3.0",
  "react-native-geocoding": "^0.5.0",
  "@react-native-async-storage/async-storage": "^1.23.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "@supabase/supabase-js": "^2.39.0",
  "date-fns": "^3.0.0",
  "react-i18next": "^14.0.0"
}
```

---

## Example Implementation Structure

```
screens/
  CreateJobScreen.tsx
    ├── Step1JobType.tsx
    ├── Step2PickupLocation.tsx
    ├── Step3DeliveryLocation.tsx
    ├── Step4ItemDetails.tsx
    └── FormStepper.tsx

components/
  ├── MapPicker.tsx
  ├── PhotoUpload.tsx
  ├── PriceCalculator.tsx
  ├── JobTypeCard.tsx
  └── LocationSearch.tsx

hooks/
  ├── useJobForm.ts
  ├── useLocationPicker.ts
  └── usePhotoUpload.ts

services/
  ├── api/jobs.ts
  ├── storage/imageUpload.ts
  └── location/geocoding.ts
```

---

## Additional Notes

1. **Content Moderation**: The API automatically moderates title and images. If content is flagged, the job is still created but marked as "banned" and a warning is returned.

2. **Price Calculation**: Platform fee is 0% for CASH payments and 15% for ONLINE_PAYMENT. Gift jobs have all prices set to 0.

3. **Recycling Locations**: For recycle type jobs, use predefined recycling center locations in Tbilisi, Georgia.

4. **Photo Upload**: Photos should be uploaded to Supabase Storage first, then the URLs should be included in the form submission.

5. **User Profile Pre-fill**: Automatically pre-fill contact name and phone from user's profile when available.

6. **Form Persistence**: Consider saving form state to AsyncStorage to allow users to resume if they close the app.

7. **Offline Support**: Allow users to fill the form offline, but require internet connection for submission.

---

This specification provides all the details needed to implement the job creation form in React Native. Follow the structure, validation rules, and UI guidelines to create a consistent and user-friendly experience.

