# API Migration Changes Required

This document lists all changes needed to align the mobile app with the documented API structure.

---

## 🔴 CRITICAL CHANGES (Must Fix)

### 1. **Type Definitions (`src/types/index.ts`)**

#### 1.1 JobStatus Type - **MISMATCH**
**Current:**
```typescript
export type JobStatus = 'pending' | 'active' | 'in_progress' | 'completed' | 'cancelled';
```

**Required:**
```typescript
export type JobStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled' | 'banned';
```

**Impact:** All job status handling needs to be updated throughout the app.

---

#### 1.2 JobType/ItemType - **MISMATCH**
**Current:**
```typescript
export type ItemType = 'food' | 'package' | 'furniture' | 'other';
```

**Required:**
```typescript
export type JobPurpose = 'move' | 'recycle' | 'gift';
```

**Impact:** All job creation forms and type checks need updating.

---

#### 1.3 Job Interface - **MAJOR STRUCTURE CHANGES**

**Current Job Interface Issues:**
- Uses `pickup_latitude`/`pickup_longitude` → Should be `pickup_lat`/`pickup_lng`
- Uses `delivery_latitude`/`delivery_longitude` → Should be `delivery_lat`/`delivery_lng`
- Missing many required fields from API
- Field names don't match API

**Required Job Interface:**
```typescript
export interface Job {
  id: string;
  customer_id: string;
  driver_id: string | null;
  title: string;
  description: string | null;
  status: JobStatus;
  job_type: 'move' | 'recycle' | 'gift';
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_contact_name: string | null;
  pickup_contact_phone: string | null;
  pickup_notes: string | null;
  pickup_photos: string[] | null;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  delivery_contact_name: string | null;
  delivery_contact_phone: string | null;
  delivery_notes: string | null;
  delivery_photos: string[] | null;
  item_category: string | null;
  item_size: string | null;
  item_weight: string | null;
  requires_help: boolean;
  customer_price: number;
  driver_payout: number;
  platform_fee: number;
  payment_type: 'CASH' | 'ONLINE_PAYMENT';
  pickup_time: string | null;
  delivery_time: string | null;
  scheduled_pickup: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url: string | null;
    phone: string | null;
  } | null;
  driver?: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url: string | null;
  } | null;
}
```

**Impact:** All components, screens, and hooks using Job type need updates.

---

#### 1.4 Payment Interface - **STATUS MISMATCH**
**Current:**
```typescript
export interface Payment {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}
```

**Required:**
```typescript
export interface Payment {
  id: string;
  job_id: string;
  customer_id: string;
  driver_id: string | null;
  amount: number;
  status: 'pending' | 'held' | 'released' | 'refunded';
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  created_at: string;
  updated_at: string;
}
```

---

#### 1.5 UserRole Type - **MISSING 'admin'**
**Current:**
```typescript
export type UserRole = 'customer' | 'driver';
```

**Required:**
```typescript
export type UserRole = 'customer' | 'driver' | 'admin';
```

---

### 2. **Authentication Mutations (`src/hooks/mutations/useAuthMutations.ts`)**

#### 2.1 Signup Request - **FIELD NAME MISMATCH**
**Current:**
```typescript
await apiClient.post('/api/auth/signup', {
  email: data.email,
  password: data.password,
  full_name: data.full_name,  // ❌ Wrong field name
});
```

**Required:**
```typescript
await apiClient.post('/api/auth/signup', {
  email: data.email,
  password: data.password,
  fullName: data.full_name,  // ✅ API expects 'fullName'
  role: 'customer' | 'driver',  // ✅ Missing required field
});
```

**Impact:** Signup will fail without `role` field.

---

#### 2.2 Signup Response - **NULLABLE SESSION**
**Current:**
```typescript
interface SignupResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
```

**Required:**
```typescript
interface SignupResponse {
  user: {
    id: string;
    email: string;
    // ... other Supabase user fields
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;  // ✅ Can be null if email confirmation required
}
```

**Impact:** Need to handle case where session is null (email confirmation flow).

---

#### 2.3 Login Response - **MISSING TOP-LEVEL ROLE**
**Current:**
```typescript
interface LoginResponse {
  user: { role: UserRole; ... };
  session: { ... };
}
```

**Required:**
```typescript
interface LoginResponse {
  user: { ... };
  session: { ... };
  role: 'customer' | 'driver' | 'admin';  // ✅ Top-level role field
}
```

---

### 3. **Validation Schemas (`src/lib/validation/schemas.ts`)**

#### 3.1 Signup Schema - **MISSING ROLE FIELD**
**Current:**
```typescript
export const signupSchema = z.object({
  email: z.string()...,
  password: z.string()...,
  full_name: z.string()...,
});
```

**Required:**
```typescript
export const signupSchema = z.object({
  email: z.string()...,
  password: z.string()...,
  fullName: z.string()...,  // ✅ Match API field name
  role: z.enum(['customer', 'driver']),  // ✅ Add role field
});
```

---

#### 3.2 Order Schemas - **COMPLETE RESTRUCTURE NEEDED**

**Current schemas use:**
- `itemType: 'food' | 'package' | 'furniture' | 'other'`
- `pickupLatitude`/`pickupLongitude`
- `itemSize: 'small' | 'medium' | 'large' | 'xlarge'`

**Required to match API:**
- `job_type: 'move' | 'recycle' | 'gift'`
- `pickup_lat`/`pickup_lng`
- `item_size` (string, not enum)
- `item_category` (string)
- `item_weight` (string)
- `pickup_contact_name`, `pickup_contact_phone`, `pickup_notes`
- `delivery_contact_name`, `delivery_contact_phone`, `delivery_notes`
- `pickup_photos`, `delivery_photos` (arrays)
- `requires_help` (boolean)
- `customer_price`, `driver_payout`, `platform_fee` (numbers)
- `payment_type: 'CASH' | 'ONLINE_PAYMENT'`
- `scheduled_pickup` (ISO date string)

**Impact:** All order creation screens need complete restructuring.

---

### 4. **Order Mutations (`src/hooks/mutations/useOrderMutations.ts`)**

#### 4.1 Create Order Response - **STRUCTURE MISMATCH**
**Current:**
```typescript
const response = await apiClient.post<{ data: Job }>('/api/jobs', formData, ...);
return response.data;  // Returns Job directly
```

**Required:**
```typescript
const response = await apiClient.post<{
  success: boolean;
  data: Job;
  error?: string;
  reasons?: string[];  // Moderation reasons if banned
}>('/api/jobs', formData, ...);
return response.data;  // Still returns Job, but need to handle reasons
```

**Impact:** Need to handle moderation flags and banned status.

---

#### 4.2 Update Order Status - **RESPONSE STRUCTURE**
**Current:**
```typescript
const response = await apiClient.put<{ data: Job }>(`/api/jobs/${jobId}`, { status });
return response.data;
```

**Required:** (Same structure, but verify response includes full job with relations)

---

#### 4.3 Delete Order - **RESPONSE STRUCTURE**
**Current:**
```typescript
await apiClient.delete(`/api/jobs/${jobId}`);
```

**Required:**
```typescript
const response = await apiClient.delete<{ success: boolean }>(`/api/jobs/${jobId}`);
// Response: { success: boolean }
```

---

### 5. **Jobs Query (`src/hooks/queries/useJobsQuery.ts`)**

#### 5.1 GET /api/jobs Response - **STRUCTURE VERIFICATION**
**Current:**
```typescript
const response = await apiClient.get<PaginatedResponse<Job>>('/api/jobs', {
  params: { status, limit, offset }
});
return response.data;  // Returns Job[]
```

**Required:** Verify response structure matches:
```typescript
{
  data: Job[];  // ✅ Matches
  // May also have total, limit, offset in PaginatedResponse
}
```

**Note:** Current implementation looks correct, but verify pagination metadata.

---

## 🟡 IMPORTANT CHANGES (Should Add)

### 6. **Missing Payment Routes**

The app currently has no payment integration hooks. Need to create:

#### 6.1 Create Payment Intent Hook
**File:** `src/hooks/mutations/usePaymentMutations.ts`
```typescript
export const useCreatePaymentIntentMutation = () => {
  return useMutation({
    mutationFn: async ({ job_id, amount }: { job_id: string; amount: number }) => {
      const response = await apiClient.post<{
        client_secret: string;
        payment_intent_id: string;
      }>('/api/create-payment-intent', { job_id, amount });
      return response;
    },
  });
};
```

#### 6.2 Confirm Payment Hook
```typescript
export const useConfirmPaymentMutation = () => {
  return useMutation({
    mutationFn: async ({ payment_intent_id, job_id }: { payment_intent_id: string; job_id: string }) => {
      const response = await apiClient.post<{ success: boolean }>('/api/confirm-payment', {
        payment_intent_id,
        job_id,
      });
      return response;
    },
  });
};
```

#### 6.3 Capture Payment Hook
```typescript
export const useCapturePaymentMutation = () => {
  return useMutation({
    mutationFn: async (job_id: string) => {
      const response = await apiClient.post<{ success: boolean }>('/api/capture-payment', {
        job_id,
      });
      return response;
    },
  });
};
```

#### 6.4 Get Payment Query
**File:** `src/hooks/queries/usePaymentQuery.ts`
```typescript
export const usePaymentQuery = (jobId: string) => {
  return useQuery({
    queryKey: ['payment', jobId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Payment }>(`/api/payments/job/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });
};
```

#### 6.5 Refund Payment Hook
```typescript
export const useRefundPaymentMutation = () => {
  return useMutation({
    mutationFn: async ({ jobId, reason }: { jobId: string; reason?: string }) => {
      const response = await apiClient.post<{ success: boolean }>('/api/refund-payment', {
        jobId,
        reason,
      });
      return response;
    },
  });
};
```

---

### 7. **Error Handling**

#### 7.1 API Error Response Structure
**Current:** Assumes `{ message?: string }`

**Required:** Handle standard error format:
```typescript
{
  error: string;
  reasons?: string[];  // For moderation errors
}
```

Update `src/lib/api/client.ts` error interceptor to handle this structure.

---

## 📋 SUMMARY CHECKLIST

### Type Definitions
- [ ] Update `JobStatus` type to match API
- [ ] Replace `ItemType` with `JobPurpose` type
- [ ] Completely rewrite `Job` interface to match API structure
- [ ] Update `Payment` interface with correct status values
- [ ] Add `'admin'` to `UserRole` type

### Authentication
- [ ] Fix signup request: change `full_name` → `fullName` and add `role` field
- [ ] Handle nullable session in signup response
- [ ] Add top-level `role` field to login response type
- [ ] Update signup schema to include `role` and use `fullName`

### Order/Job Creation
- [ ] Completely rewrite order validation schemas
- [ ] Update all field names to match API (lat/lng, contact fields, etc.)
- [ ] Add missing fields (pickup/delivery contacts, photos, notes, etc.)
- [ ] Change job type from `ItemType` to `JobPurpose`
- [ ] Update order creation mutation to handle moderation response

### Payment Integration
- [ ] Create payment mutation hooks file
- [ ] Create payment query hooks file
- [ ] Implement all 5 payment-related API calls

### Error Handling
- [ ] Update error interceptor to handle `{ error: string, reasons?: string[] }` format
- [ ] Add handling for banned jobs (moderation reasons)

### Components & Screens
- [ ] Update all screens using Job type (HomeScreen, OrderDetailScreen, etc.)
- [ ] Update order creation screens to use new field structure
- [ ] Update status badges to use new status values
- [ ] Add payment flow screens/handlers

---

## 🚨 BREAKING CHANGES

These changes will break existing functionality and require updates to:

1. **All order creation screens** (NewOrderStep1-4Screen)
2. **All job listing/display screens** (HomeScreen, OrdersListScreen, OrderDetailScreen)
3. **All status-related UI components** (StatusBadge component)
4. **All job-related hooks and queries**
5. **Authentication screens** (SignupScreen needs role selection)

---

## 📝 NOTES

- The API uses snake_case for field names (`pickup_lat`, `customer_id`, etc.)
- The API supports both JSON and FormData for job creation
- Jobs can be automatically banned due to content moderation
- Payment routes are separate and need to be integrated
- The API filters jobs based on user role automatically

