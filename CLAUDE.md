# Claude AI Assistant Context for SubTrack 🤖

This document provides context and guidelines for Claude AI when working on the SubTrack project.

## Project Overview

SubTrack is a React Native subscription management app that helps users track their recurring payments, including both fixed subscriptions (Netflix, Spotify) and variable bills (electricity, water). The app features a modern UI with professional animations and comprehensive cost analytics.

## Key Technical Details

### Tech Stack
- **Framework**: React Native 0.79.5 with Expo SDK 53
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS via NativeWind 4.1.23
- **Navigation**: React Navigation + Expo Router
- **Backend**: Firebase 11.10.0 (Auth + Firestore)
- **Animations**: React Native Reanimated 3.17.4
- **State Management**: React Context + Custom Hooks

### Project Structure
```
app/
├── (screens)/        # Auth screens (Login, Register, AccountRecovery)
├── (tabs)/          # Main app screens with tab navigation
├── components/      # Reusable components organized by type
├── hooks/          # Custom React hooks
├── navigation/     # Navigation type definitions
├── providers/      # Context providers (AuthProvider)
└── _layout.tsx     # Root layout with providers
```

## Important Context

### Recent Major Improvements (v2.0.0)
1. **Security**: Moved Firebase credentials to environment variables
2. **TypeScript**: Fully migrated from JavaScript
3. **Variable Costs**: Added support for utility bills with fluctuating costs
4. **Animations**: Professional UI animations throughout
5. **Code Quality**: Refactored large components into smaller, reusable pieces

### Key Features
- Fixed and variable subscription tracking
- Monthly and yearly cost analytics
- Calendar view with payment indicators
- Category-based organization
- Custom color coding
- Reminder settings

### Database Schema

**users collection**:
```typescript
{
  uid: string
  email: string
  username: string
  created_at: string
  updated_at: string
}
```

**subscriptions collection**:
```typescript
{
  id?: string
  user_id: string
  app_name: string
  cost: number
  cost_type: 'fixed' | 'variable'
  average_cost?: number
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  due_date: string  // Format: "DD/MM/YYYY"
  reminder: string
  color: string
  category: string
  status?: 'active' | 'paused' | 'cancelled'
}
```

## Development Guidelines

### Code Style
- Use TypeScript with proper interfaces
- Functional components with hooks only
- TailwindCSS classes for styling
- Custom hooks for logic reuse
- Small, focused components
- Proper error handling with loading states

### File Naming
- Components: PascalCase (e.g., `SubscriptionItem.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useSubscriptions.ts`)
- Services: camelCase (e.g., `authService.ts`)
- Types: PascalCase for interfaces

### Common Patterns

**Service Response Pattern**:
```typescript
interface ServiceResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
```

**Custom Hook Pattern**:
```typescript
const useCustomHook = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Logic here
  
  return { data, loading, error }
}
```

**Animation Component Pattern**:
```typescript
<FadeInView delay={200}>
  <YourComponent />
</FadeInView>
```

## Important Reminders

### Security
- Never commit `.env` file
- Always validate user input
- Use Firebase security rules
- Implement proper error messages that don't reveal sensitive info

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use FlatList/FlashList for long lists

### Testing Areas
- Authentication flow (register, login, password reset)
- Subscription CRUD operations
- Variable cost calculations
- Calendar functionality
- Navigation between screens

### Known Issues to Watch
- Navigation to "Plus" screen was fixed (now uses AddSubscription)
- Console.log statements have been removed
- TypeScript 'any' usage has been minimized
- Form validation duplication has been fixed with custom hooks

## Common Tasks

### Adding a New Feature
1. Create TypeScript interfaces in `types/index.ts`
2. Create service functions if needed
3. Create custom hook for logic
4. Build UI components
5. Add animations appropriately
6. Update documentation

### Fixing Bugs
1. Check error logs
2. Verify TypeScript types
3. Test on both iOS and Android
4. Ensure loading/error states work
5. Update tests if applicable

### UI Improvements
- Maintain color theme (#3AABCC primary)
- Use existing animation components
- Follow established patterns
- Keep accessibility in mind
- Test on different screen sizes

## Key Files to Know

- `app/_layout.tsx` - Root app setup
- `types/index.ts` - All TypeScript interfaces
- `services/userService.ts` - Subscription management
- `app/hooks/useSubscriptions.ts` - Main data hook
- `app/(tabs)/(screens)/Home.tsx` - Main dashboard
- `config/firebase.ts` - Firebase configuration

## Environment Setup

Required `.env` variables:
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Helpful Commands

```bash
# Development
npm start                    # Start Expo
npm run ios                 # Run on iOS
npm run android             # Run on Android
npm run lint                # Run ESLint
npx tsc --noEmit           # Type check

# Troubleshooting
npx expo start -c          # Clear cache
npx expo doctor            # Check setup
```

## Contact

**Project Owner**: Zeff Adonis
**GitHub**: @Zeff01

---

*This document helps Claude understand the project context, patterns, and best practices for providing accurate and consistent assistance.*