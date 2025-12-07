# API Migration Changes - Implementation Summary

This document summarizes all changes made to align the mobile app with the API documentation.

## ✅ Completed Changes

### 1. Type Definitions (`src/types/index.ts`)

**Updated Types:**
- ✅ `UserRole`: Added `'admin'` → Now: `'customer' | 'driver' | 'admin'`
- ✅ `JobStatus`: Completely replaced → Now: `'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled' | 'banned'`
- ✅ `ItemType`: Replaced with `JobPurpose` → Now: `'move' | 'recycle' | 'gift'`
- ✅ Added `PaymentType`: `'CASH' | 'ONLINE_PAYMENT'`
- ✅ Added `PaymentStatus`: `'pending' | 'held' | 'released' | 'refunded'`

**Updated Interfaces:**
- ✅ `User`: Added `rating?: number`
- ✅ `Job`: Complete restructure with all new fields matching API:
  - Changed `pickup_latitude/longitude` → `pickup_lat/lng`
  - Changed `delivery_latitude/longitude` → `delivery_lat/lng`
  - Changed `item_type` → `job_type` (JobPurpose)
  - Changed `price` → `customer_price`
  - Added: `title`, `pickup_contact_name/phone/notes`, `delivery_contact_name/phone/notes`
  - Added: `pickup_photos`, `delivery_photos`, `item_category/size/weight`
  - Added: `requires_help`, `payment_type`, `pickup_time`, `delivery_time`, `scheduled_pickup`
  - Updated customer/driver relations to match API structure
- ✅ `Payment`: Complete restructure with new fields and status values
- ✅ `ApiError`: Added `error?: string` and `reasons?: string[]` for moderation errors

---

### 2. Authentication (`src/hooks/mutations/useAuthMutations.ts`)

**Changes:**
- ✅ `LoginResponse`: Added top-level `role` field
- ✅ `SignupResponse`: Made `session` nullable (`session | null`)
- ✅ Signup mutation: Changed `full_name` → `fullName` in request
- ✅ Signup mutation: Added required `role` field in request
- ✅ Signup mutation: Added handling for null session (email confirmation flow)

---

### 3. Validation Schemas (`src/lib/validation/schemas.ts`)

**Signup Schema:**
- ✅ Added `role: z.enum(['customer', 'driver'])` field

**Order Schemas (Complete Restructure):**
- ✅ `orderStep1Schema`: Changed from `itemType` → `job_type` with `title` field
- ✅ `orderStep2Schema`: Updated to use snake_case field names (`pickup_lat/lng`, `delivery_lat/lng`) and added contact fields
- ✅ `orderStep3Schema`: Changed to use `item_category`, `item_size`, `item_weight` (strings) and `requires_help` boolean
- ✅ `orderStep4Schema`: Changed to use `customer_price`, `driver_payout`, `platform_fee`, `payment_type`, `scheduled_pickup`

---

### 4. Order Mutations (`src/hooks/mutations/useOrderMutations.ts`)

**Changes:**
- ✅ `useCreateOrderMutation`: Updated response type to handle moderation (`success`, `data`, `error?`, `reasons?`)
- ✅ `useCreateOrderMutation`: Added handling for moderation reasons in success/error callbacks
- ✅ `useCancelOrderMutation`: Updated to handle `{ success: boolean }` response

---

### 5. Payment Integration (NEW FILES)

**Created Files:**
- ✅ `src/hooks/mutations/usePaymentMutations.ts`:
  - `useCreatePaymentIntentMutation`
  - `useConfirmPaymentMutation`
  - `useCapturePaymentMutation`
  - `useRefundPaymentMutation`
- ✅ `src/hooks/queries/usePaymentQuery.ts`:
  - `usePaymentQuery`

---

### 6. Error Handling

**API Client (`src/lib/api/client.ts`):**
- ✅ Updated error interceptor to extract `error` and `reasons` fields from API responses

**Error Handler (`src/lib/utils/errorHandler.ts`):**
- ✅ Updated to handle `error` field in addition to `message`
- ✅ Added display of moderation `reasons` when present

---

### 7. UI Components

**StatusBadge (`src/components/ui/StatusBadge.tsx`):**
- ✅ Updated status cases: `'active'` → `'accepted'`, `'in_progress'` → `'in_transit'`, `'completed'` → `'delivered'`
- ✅ Added `'banned'` status case

**OrderCard (`src/components/shared/OrderCard.tsx`):**
- ✅ Changed `order.images` → `order.pickup_photos` / `order.delivery_photos`
- ✅ Changed `order.price` → `order.customer_price`
- ✅ Removed `order.distance_km` (not in new API)
- ✅ Added `order.title` display

**OrdersListScreen (`src/screens/customer/OrdersListScreen.tsx`):**
- ✅ Updated filter tabs to use new status values

**HomeScreen (`src/screens/customer/HomeScreen.tsx`):**
- ✅ Removed invalid `'active'` status filter

**SignupScreen (`src/screens/auth/SignupScreen.tsx`):**
- ✅ Added role selection UI (Customer/Driver)
- ✅ Added `role` field to form default values

---

## 📋 Files Modified

1. `src/types/index.ts` - Complete type system overhaul
2. `src/hooks/mutations/useAuthMutations.ts` - Fixed DTOs and nullable session
3. `src/lib/validation/schemas.ts` - Complete schema restructure
4. `src/hooks/mutations/useOrderMutations.ts` - Moderation handling
5. `src/lib/api/client.ts` - Error handling updates
6. `src/lib/utils/errorHandler.ts` - Moderation reasons display
7. `src/components/ui/StatusBadge.tsx` - Status values update
8. `src/components/shared/OrderCard.tsx` - Field name updates
9. `src/screens/customer/OrdersListScreen.tsx` - Filter tabs update
10. `src/screens/customer/HomeScreen.tsx` - Status filter fix
11. `src/screens/auth/SignupScreen.tsx` - Role selection added

---

## 📝 Files Created

1. `src/hooks/mutations/usePaymentMutations.ts` - Payment mutation hooks
2. `src/hooks/queries/usePaymentQuery.ts` - Payment query hook

---

## ⚠️ Breaking Changes

These changes will require updates to:

1. **Order Creation Screens** (`NewOrderStep1-4Screen.tsx`):
   - Need to update to use new field names
   - Need to collect new required fields (contacts, photos, payment type, etc.)
   - Need to handle FormData for image uploads

2. **Order Detail/Tracking Screens**:
   - Need to update to display new field structure
   - Need to handle new status values

3. **Navigation Types** (`src/types/navigation.ts`):
   - Still uses `itemType` in route params - may need update if order screens use it

4. **Any other screens/components using Job type**:
   - Will need to update field references

---

## 🎯 Next Steps

1. **Update Order Creation Flow**:
   - Update `NewOrderStep1Screen.tsx` to use `job_type` and `title`
   - Update `NewOrderStep2Screen.tsx` to use new address/contact fields
   - Update `NewOrderStep3Screen.tsx` to use new item fields
   - Update `NewOrderStep4Screen.tsx` to use new pricing/payment fields
   - Implement image upload handling

2. **Update Order Detail Screens**:
   - Update to display new Job structure
   - Handle new status values properly

3. **Test Payment Integration**:
   - Integrate payment hooks into order flow
   - Test payment confirmation flow

4. **Update Navigation Types**:
   - Consider updating navigation params to match new structure

---

## ✅ Verification Checklist

- [x] All type definitions updated
- [x] Authentication mutations fixed
- [x] Validation schemas updated
- [x] Order mutations handle moderation
- [x] Payment hooks created
- [x] Error handling updated
- [x] StatusBadge updated
- [x] OrderCard updated
- [x] SignupScreen has role selection
- [ ] Order creation screens need updates (TODO)
- [ ] Order detail screens need updates (TODO)
- [ ] Payment integration in UI (TODO)

---

## 📚 API Compatibility

All changes align with the API documentation:
- ✅ Authentication routes match API DTOs
- ✅ Job routes match API structure
- ✅ Payment routes implemented
- ✅ Error handling matches API error format
- ✅ Field names match API (snake_case)

