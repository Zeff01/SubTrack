# Changelog

All notable changes to SubTrack will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-19

### 🎉 Major Release - Complete Refactor & Enhancement

### Added
- **Variable Cost Support** 
  - New `cost_type` field for fixed/variable subscriptions
  - Perfect for utility bills (electricity, water, etc.)
  - Average cost tracking for better yearly projections
  - Cost history capability for future analytics

- **Yearly Statistics**
  - Total yearly cost calculation on home screen
  - Monthly average display
  - Smart calculations for all billing cycles

- **Professional Animations**
  - Smooth fade-in and slide-in transitions
  - Micro-interactions (bell animation, button feedback)
  - Staggered list animations
  - Error shake animations
  - Loading states with skeletons

- **Enhanced Categories**
  - 6 subscription categories with emoji icons
  - Entertainment, Utilities, Productivity, Health, Education, Other
  - Visual category indicators on subscription items

- **Improved Components**
  - `FadeInView`, `SlideInView`, `ScaleButton` animation wrappers
  - `Loading`, `ErrorMessage`, `EmptyState` common components
  - `EnhancedSubscriptionForm` with variable cost toggle
  - Refactored Home screen into 5+ smaller components

- **Better Error Handling**
  - Consistent error messages
  - User-friendly error displays
  - Retry functionality
  - Loading indicators for all async operations

- **Development Tools**
  - Comprehensive TypeScript types
  - Custom hooks for logic reuse
  - API documentation
  - Quick start guide

### Changed
- **Complete TypeScript Migration**
  - Converted all JavaScript files to TypeScript
  - Added proper interfaces for all data structures
  - Fixed all `any` type usage
  - Proper navigation typing

- **Security Improvements**
  - Moved Firebase credentials to environment variables
  - Added `.env.example` for easy setup
  - Removed all hardcoded sensitive data
  - Removed test code from production

- **UI/UX Enhancements**
  - Updated subscription items with category icons
  - Variable cost indicator (~₱ prefix)
  - Better color contrast for text on colored backgrounds
  - Consistent spacing and sizing

- **Code Organization**
  - Broke down 548-line Home.tsx into manageable components
  - Created custom hooks for subscriptions and user data
  - Organized components into logical folders
  - Removed duplicate files

### Fixed
- Navigation to non-existent "Plus" screen
- Console.log statements in production
- Form validation code duplication
- TypeScript type safety issues
- Missing loading and error states

### Removed
- Test code from production files
- Duplicate `Calendar copy.tsx` file
- Hardcoded Firebase credentials
- Unnecessary console.log statements
- Old JavaScript service files

### Security
- Environment variables for Firebase configuration
- Input validation and sanitization
- Secure authentication flow
- User data isolation

## [1.0.0] - 2024-06-26

### Initial Release
- Basic subscription tracking
- Monthly cost calculation
- Calendar view
- User authentication
- Add/Edit/Delete subscriptions
- Color coding for subscriptions
- Basic reminder settings

---

## Upgrade Guide

### From 1.0.0 to 2.0.0

1. **Environment Setup Required**
   - Create `.env` file with Firebase credentials
   - See `.env.example` for required variables

2. **Database Migration**
   - New fields added: `cost_type`, `average_cost`, `category`
   - Existing subscriptions will default to `cost_type: 'fixed'`

3. **Breaking Changes**
   - Service functions now return `ServiceResponse` type
   - Navigation types have changed
   - Some component props updated

4. **New Dependencies**
   - react-native-reanimated (for animations)
   - Additional TypeScript types

For detailed migration instructions, see [IMPROVEMENTS.md](IMPROVEMENTS.md)