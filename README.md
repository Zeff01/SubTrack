# SubTrack - Smart Subscription Manager 📱

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-0.79.5-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-53.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-11.10.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</div>

<div align="center">
  <h3>Track, manage, and optimize your subscriptions with ease</h3>
  <p>A modern React Native app that helps you keep track of all your subscriptions, bills, and recurring payments in one place.</p>
</div>

---

## 🌟 Features

### Core Functionality
- **📊 Subscription Tracking**: Monitor all your subscriptions in one place
- **💰 Cost Analytics**: View monthly and yearly spending with averages
- **📅 Calendar View**: Visual representation of payment due dates
- **🔔 Smart Reminders**: Never miss a payment with customizable notifications
- **🎨 Color-Coded Organization**: Assign colors to subscriptions for easy identification
- **📱 Cross-Platform**: Works on both iOS and Android

### Advanced Features
- **⚡ Variable Cost Support**: Perfect for utility bills (electricity, water, etc.)
- **📈 Spending Insights**: Track spending trends and patterns
- **🏷️ Category Management**: Organize by Entertainment, Utilities, Productivity, etc.
- **🔒 Secure Authentication**: Firebase-powered user authentication
- **✨ Professional Animations**: Smooth transitions and micro-interactions
- **🌙 Modern UI**: Clean, intuitive interface with TailwindCSS styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zeff01/SubTrack.git
   cd SubTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📱 App Architecture

### Project Structure
```
SubTrack/
├── app/                      # Main application code
│   ├── (screens)/           # Authentication screens
│   ├── (tabs)/              # Main app screens
│   │   ├── (screens)/       # Tab screen components
│   │   └── *.tsx            # Tab navigators
│   ├── components/          # Reusable components
│   │   ├── animated/        # Animation components
│   │   ├── common/          # Common UI components
│   │   ├── forms/           # Form components
│   │   └── home/            # Home screen components
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation types
│   ├── providers/           # Context providers
│   └── _layout.tsx          # Root layout
├── assets/                  # Images and fonts
├── config/                  # Configuration files
├── services/                # API and Firebase services
├── types/                   # TypeScript type definitions
└── package.json            # Project dependencies
```

### Tech Stack
- **Frontend**: React Native + Expo
- **Styling**: TailwindCSS (NativeWind)
- **Navigation**: React Navigation + Expo Router
- **State Management**: React Context + Custom Hooks
- **Backend**: Firebase (Auth + Firestore)
- **Animations**: React Native Reanimated
- **Type Safety**: TypeScript
- **Forms**: Custom form hooks with validation

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add your app (iOS/Android)
5. Copy configuration values to `.env`

### Firestore Collections

**users**
```typescript
{
  uid: string
  email: string
  username: string
  created_at: string
  updated_at: string
}
```

**subscriptions**
```typescript
{
  id: string
  user_id: string
  app_name: string
  cost: number
  cost_type: 'fixed' | 'variable'
  average_cost?: number
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  due_date: string
  reminder: string
  color: string
  category: string
  status: 'active' | 'paused' | 'cancelled'
  created_at: string
  updated_at: string
}
```

## 📲 Features Guide

### Adding Subscriptions

#### Fixed Cost Subscription (e.g., Netflix)
1. Tap "Add Subscription"
2. Enter subscription name
3. Select category (Entertainment)
4. Keep "Variable Cost" toggle OFF
5. Enter fixed monthly cost
6. Select billing cycle
7. Choose due date
8. Set reminder preference
9. Pick a color
10. Save

#### Variable Cost Bill (e.g., Electricity)
1. Tap "Add Subscription"
2. Enter bill name
3. Select category (Utilities)
4. Turn ON "Variable Cost" toggle
5. Enter current bill amount
6. Optionally enter average (for yearly calculations)
7. Complete remaining fields
8. Save

### Understanding Cost Display
- **Fixed costs**: `₱500` (exact amount)
- **Variable costs**: `~₱500` (approximate/average)
- **Yearly total**: Sum of all annual subscription costs
- **Monthly average**: Yearly total ÷ 12

### Calendar Features
- **Colored dots**: Indicate payment due dates
- **Multiple dots**: Multiple payments on same day
- **Tap date**: View subscriptions due that day
- **Month navigation**: Swipe or use arrows

## 🎨 UI Components

### Animation Components
- **FadeInView**: Smooth opacity transitions
- **SlideInView**: Directional slide animations
- **ScaleButton**: Touch feedback with scaling

### Common Components
- **Loading**: Consistent loading states
- **ErrorMessage**: User-friendly error displays
- **EmptyState**: Helpful empty state messages

### Form Components
- **SubscriptionForm**: Base subscription form
- **EnhancedSubscriptionForm**: With variable cost support

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Code Style
- TypeScript for type safety
- Functional components with hooks
- TailwindCSS for styling
- Proper error handling
- Loading states for async operations

### Best Practices
1. Always use TypeScript interfaces
2. Implement proper loading/error states
3. Use custom hooks for logic reuse
4. Keep components small and focused
5. Add animations sparingly for better UX

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start -c
   ```

2. **iOS build failing**
   ```bash
   cd ios && pod install
   ```

3. **Android build issues**
   ```bash
   cd android && ./gradlew clean
   ```

4. **Type errors**
   ```bash
   npm run typecheck
   ```

## 🔒 Security

- Firebase credentials stored in environment variables
- Secure authentication with Firebase Auth
- User data isolation (users can only access their own data)
- Input validation and sanitization
- No sensitive data in git repository

## 📈 Future Enhancements

- [ ] Push notifications for payment reminders
- [ ] Data export (CSV/PDF)
- [ ] Budget limits and alerts
- [ ] Subscription sharing for families
- [ ] Dark mode support
- [ ] Multi-currency support
- [ ] Subscription recommendations
- [ ] Integration with bank APIs
- [ ] Widgets for home screen

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add appropriate comments
- Update documentation
- Test on both iOS and Android

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Zeff Adonis**
- GitHub: [@Zeff01](https://github.com/Zeff01)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development experience
- Firebase for reliable backend services
- All contributors and testers

---

<div align="center">
  <p>Made with ❤️ by Zeff</p>
  <p>If you found this helpful, please ⭐ the repository!</p>
</div>