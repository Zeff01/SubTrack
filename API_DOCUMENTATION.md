# SubTrack API Documentation 📚

## Overview
SubTrack uses Firebase services for backend functionality. This document outlines all service functions, data structures, and usage examples.

## Table of Contents
- [Authentication Services](#authentication-services)
- [User Services](#user-services)
- [Subscription Services](#subscription-services)
- [Custom Hooks](#custom-hooks)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

---

## Authentication Services
`services/authService.ts`

### `registerUser(user_info: RegisterInfo): Promise<AuthResponse>`
Creates a new user account.

**Parameters:**
```typescript
interface RegisterInfo {
  email: string;
  password: string;
  username: string;
}
```

**Response:**
```typescript
interface AuthResponse {
  success: boolean;
  message?: string;
  data?: User;
  error?: string;
}
```

**Example:**
```typescript
const response = await registerUser({
  email: "user@example.com",
  password: "securePassword123",
  username: "johndoe"
});
```

### `loginUser(credentials: LoginInfo): Promise<AuthResponse>`
Authenticates a user.

**Parameters:**
```typescript
interface LoginInfo {
  email: string;
  password: string;
}
```

**Example:**
```typescript
const response = await loginUser({
  email: "user@example.com",
  password: "securePassword123"
});
```

### `changePassword(current_user: User, newPassword: string): Promise<ServiceResponse>`
Updates user password.

**Example:**
```typescript
const response = await changePassword(currentUser, "newSecurePassword123");
```

### `changeProfile(current_user: User, user_info: ProfileInfo): Promise<ServiceResponse>`
Updates user profile information.

**Parameters:**
```typescript
interface ProfileInfo {
  email?: string;
  username?: string;
}
```

---

## User Services
`services/userService.ts`

### User Management

#### `createDocumentUser(user_info: UserData): Promise<ServiceResponse>`
Creates a new user document in Firestore.

**Parameters:**
```typescript
interface UserData {
  email: string;
  username: string;
  uid: string;
}
```

#### `getUsernameByEmail(email: string): Promise<string | null>`
Retrieves username by email address.

#### `checkIfUsernameExists(username: string): Promise<boolean>`
Checks if username is already taken.

#### `checkIfEmailExists(email: string): Promise<boolean>`
Checks if email is already registered.

### Subscription Management

#### `createDocumentSubscription(subscription_info: Subscription): Promise<ServiceResponse>`
Creates a new subscription.

**Parameters:**
```typescript
interface Subscription {
  user_id: string;
  app_name: string;
  cost: number;
  cost_type: 'fixed' | 'variable';
  average_cost?: number;
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  due_date: string;
  reminder: string;
  color: string;
  category: string;
}
```

**Example:**
```typescript
const response = await createDocumentSubscription({
  user_id: "user123",
  app_name: "Netflix",
  cost: 549,
  cost_type: "fixed",
  cycle: "monthly",
  due_date: "15/12/2024",
  reminder: "2 days before",
  color: "#E50914",
  category: "entertainment"
});
```

#### `retrieveAllDocumentSubscriptionSpecificUser(user_id: string): Promise<ServiceResponse<Subscription[]>>`
Gets all subscriptions for a specific user.

#### `retrieveAllDocumentSubscriptionMonthlySpecificUser(user_id: string, date_info: DateInfo): Promise<ServiceResponse<Subscription[]>>`
Gets subscriptions for a specific month.

**Parameters:**
```typescript
interface DateInfo {
  month: number; // 1-12
  year: number;  // e.g., 2024
}
```

#### `updateDocumentSubscription(docId: string, subscription_info: Partial<Subscription>): Promise<ServiceResponse>`
Updates an existing subscription.

#### `deleteDocumentSubscription(docId: string): Promise<ServiceResponse>`
Deletes a subscription.

---

## Custom Hooks

### `useAuth()`
Provides authentication context.

**Returns:**
```typescript
{
  user: User | null;
  authLoading: boolean;
}
```

**Usage:**
```typescript
const { user, authLoading } = useAuth();

if (authLoading) return <Loading />;
if (!user) return <Login />;
```

### `useSubscriptions()`
Manages subscription data and calculations.

**Returns:**
```typescript
{
  subscriptions: Subscription[];
  highlightedDays: HighlightedDay[];
  loading: boolean;
  error: string | null;
  getTotalMonthlyCost: (days: HighlightedDay[]) => number;
  getYearlyStats: (subs: Subscription[]) => { total: number; average: number };
  refetch: (userId: string) => Promise<void>;
}
```

**Usage:**
```typescript
const { 
  subscriptions, 
  loading, 
  error,
  getYearlyStats 
} = useSubscriptions();

const { total, average } = getYearlyStats(subscriptions);
```

### `useSubscriptionForm(props: UseSubscriptionFormProps)`
Handles subscription form state and validation.

**Parameters:**
```typescript
interface UseSubscriptionFormProps {
  initialData?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  mode: 'add' | 'edit';
}
```

**Returns:**
```typescript
{
  formData: SubscriptionFormData;
  errors: FormErrors;
  loading: boolean;
  showDatePicker: boolean;
  showColorModal: boolean;
  handleFieldChange: (field: string, value: any) => void;
  handleSubmit: () => Promise<void>;
  // ... other handlers
}
```

### `useUsername(user: User | null)`
Fetches username for authenticated user.

**Returns:**
```typescript
{
  username: string | null;
  loading: boolean;
}
```

---

## Type Definitions

### Core Types

```typescript
// User type from Firebase Auth
interface User {
  uid: string;
  email: string;
  // ... other Firebase user properties
}

// Subscription with all fields
interface Subscription {
  id?: string;
  user_id: string;
  app_name: string;
  cost: number;
  cost_type: 'fixed' | 'variable';
  average_cost?: number;
  cost_history?: CostHistoryEntry[];
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  due_date: string; // Format: "DD/MM/YYYY"
  reminder: string;
  color: string; // Hex color
  status?: 'active' | 'paused' | 'cancelled';
  category?: 'entertainment' | 'utilities' | 'productivity' | 'health' | 'education' | 'other';
  created_at?: string;
  updated_at?: string;
}

// For tracking variable cost history
interface CostHistoryEntry {
  date: string;
  amount: number;
}

// Service response wrapper
interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

---

## Error Handling

### Error Response Format
All service functions return a consistent error format:

```typescript
{
  success: false,
  error: "Descriptive error message"
}
```

### Common Error Scenarios

1. **Authentication Errors**
   - Invalid credentials
   - Email already exists
   - Username already taken
   - Weak password

2. **Validation Errors**
   - Missing required fields
   - Invalid email format
   - Invalid cost value

3. **Network Errors**
   - No internet connection
   - Firebase service unavailable

### Error Handling Example

```typescript
try {
  const response = await createDocumentSubscription(subscriptionData);
  
  if (response.success) {
    // Handle success
    Alert.alert("Success", "Subscription added!");
  } else {
    // Handle error
    Alert.alert("Error", response.error || "Something went wrong");
  }
} catch (error) {
  // Handle unexpected errors
  Alert.alert("Error", "An unexpected error occurred");
}
```

---

## Best Practices

1. **Always check response.success**
   ```typescript
   const response = await someService();
   if (!response.success) {
     // Handle error
     return;
   }
   ```

2. **Use TypeScript interfaces**
   ```typescript
   const subscription: Subscription = {
     // ... typed properties
   };
   ```

3. **Handle loading states**
   ```typescript
   const [loading, setLoading] = useState(false);
   setLoading(true);
   try {
     await someAsyncOperation();
   } finally {
     setLoading(false);
   }
   ```

4. **Validate before submission**
   ```typescript
   if (!formData.app_name || !formData.cost) {
     Alert.alert("Error", "Please fill all required fields");
     return;
   }
   ```

---

## Firebase Security Rules

Recommended Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own subscriptions
    match /subscriptions/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

---

For more information, see the [main documentation](README.md) or check the source code in the `services/` directory.