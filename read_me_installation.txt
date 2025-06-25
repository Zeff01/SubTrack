npm install @react-navigation/stack
npm install @react-native-community/datetimepicker
npm install @react-native-picker/picker
npm install react-native-calendars
npm install @react-native-async-storage/async-storage
npm install firebase @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @firebase/logger



















1. npx expo install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
2. npx expo install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11
3.npm install firebase
4. npm install @react-native-community/datetimepicker


install NativeWind
1. npm install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
2. npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11
3. npx tailwindcss init
4. tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
5.  npx react-native start --reset-cache



