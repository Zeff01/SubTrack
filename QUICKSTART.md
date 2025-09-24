# SubTrack Quick Start Guide 🚀

## 🎯 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/Zeff01/SubTrack.git
cd SubTrack
npm install
```

### 2. Firebase Setup (One-time)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project "SubTrack"
3. Enable **Email/Password Authentication**
4. Create **Firestore Database** (start in test mode)
5. Click **Project Settings** → **General** → **Your apps** → **Web app**
6. Copy the config values

### 3. Environment Variables
Create `.env` file:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=subtrack-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=subtrack-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=subtrack-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Run the App
```bash
npx expo start
```
- Press `i` → iOS Simulator
- Press `a` → Android Emulator
- Scan QR → Physical device (install Expo Go first)

## 📱 First Time User Flow

### 1. Register Account
- Open app → "Sign Up"
- Enter username, email, password
- Tap "Create Account"

### 2. Add Your First Subscription
- From Home → "Add Subscription"
- Try these examples:

**Netflix (Fixed Cost)**
- Name: Netflix
- Category: 🎬 Entertainment
- Variable Cost: OFF
- Cost: 549
- Cycle: Monthly
- Due Date: 15th
- Color: Red

**Electric Bill (Variable Cost)**
- Name: Meralco Bill
- Category: 💡 Utilities  
- Variable Cost: ON
- Current Bill: 3500
- Average: 3000
- Cycle: Monthly
- Due Date: 25th
- Color: Yellow

### 3. Explore Features
- **Home**: See monthly/yearly totals
- **Calendar**: Tap dates to see due payments
- **Subscriptions**: View all, search, filter
- **Account**: Update profile, change password

## 🎨 App Screens Overview

### Home Screen
- Monthly spending summary
- Yearly total & average
- Upcoming payments list
- Quick add button

### Calendar Screen  
- Visual payment schedule
- Colored dots for due dates
- Tap to see day's subscriptions

### Subscriptions Screen
- Complete list with search
- Category icons
- Variable cost indicator (~₱)
- Tap to view/edit details

### Account Screen
- Profile management
- Password update
- Sign out option

## 💡 Pro Tips

1. **Variable Costs**: Perfect for utility bills that change monthly
2. **Colors**: Use consistent colors for categories (e.g., red for entertainment)
3. **Reminders**: Set 2-3 days before for bills that need preparation
4. **Categories**: Help track spending by type
5. **Calendar**: Great for planning monthly budget

## 🆘 Quick Troubleshooting

**App won't start?**
```bash
npx expo start -c  # Clear cache
```

**Firebase errors?**
- Check .env file exists
- Verify all values copied correctly
- Ensure Firebase project is active

**Can't see subscriptions?**
- Pull down to refresh
- Check internet connection
- Try logging out and back in

## 📚 Learn More

- [Full Documentation](README.md)
- [UI Improvements Guide](UI_IMPROVEMENTS.md)
- [Development Guide](IMPROVEMENTS.md)

---

**Need help?** Open an issue on [GitHub](https://github.com/Zeff01/SubTrack/issues)