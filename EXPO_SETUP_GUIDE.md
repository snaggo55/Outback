# 📱 Expo Project Setup Guide

Complete guide to setting up the React Native Outback app with Expo.

---

## Prerequisites

```bash
# Check Node version (must be 18+)
node --version
# v18.x or higher

# Check npm
npm --version
# 9.x or higher
```

---

## Step 1: Create Expo Project

```bash
# Navigate to project directory
cd /Users/AI-agents/Outback

# Create new Expo app with TypeScript template
npx create-expo-app Outback --template

# Alternative: Using TypeScript specifically
npx create-expo-app Outback --template typescript
```

### Project Structure After Creation

```
Outback/
├── app/              # Navigation structure (Expo Router)
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Business logic
│   └── locales/      # Translations
├── assets/           # App icons, fonts
├── app.json          # Expo configuration
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── babel.config.js   # Babel configuration
```

---

## Step 2: Install Core Dependencies

```bash
cd Outback

# Installation
npm install
npm install react-native-async-storage/async-storage
npm install i18next react-i18next
npm install expo-router expo-constants expo-font
npm install -D typescript @types/react @types/react-native

# Optional but recommended
npm install react-native-svg
npm install expo-haptics expo-notification
```

### Important Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react-native | latest | Core framework |
| expo | latest | Development tools |
| expo-router | latest | Navigation |
| @react-native-async-storage/async-storage | ^1.21 | Local storage |
| i18next | ^23 | Translations |
| react-i18next | ^13 | React bindings |

---

## Step 3: Configure App Structure

### app.json (Expo Configuration)

```json
{
  "expo": {
    "name": "Outback",
    "slug": "outback-battery-calculator",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.outback.battery",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.outback.battery",
      "versionCode": 1,
      "useNextNotificationFormat": true,
      "permissions": ["INTERNET", "ACCESS_FINE_LOCATION"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### babel.config.js

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@': './src',
        },
      }],
    ],
  };
};
```

---

## Step 4: Create Navigation Structure

### app/(auth)/index.tsx - Paywall Screen

```typescript
import React from 'react';
import { PaywallScreen } from '@/components/PaywallScreen';
import { useActivation } from '@/hooks/useActivation';

export default function AuthScreen() {
  const { isPaid, loading } = useActivation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isPaid) {
    return <PaywallScreen onActivated={() => {}} />;
  }

  // Redirect to app
  return null;
}
```

### app/(tabs)/_layout.tsx - Main App Navigation

```typescript
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
        }}
      />
      <Tabs.Screen
        name="presets"
        options={{
          title: 'Presets',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
```

### app/(tabs)/calculator.tsx - Main Calculator

```typescript
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { LocationCard } from '@/components/LocationCard';
import { BatteryCard } from '@/components/BatteryCard';
import { ConsumptionCard } from '@/components/ConsumptionCard';
import { SolarCard } from '@/components/SolarCard';
import { ResultPanel } from '@/components/ResultPanel';

export default function CalculatorScreen() {
  const [state, setState] = useState({
    location: null,
    battery: null,
    consumption: 0,
    solar: null,
  });

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <LocationCard />
        <BatteryCard />
        <ConsumptionCard />
        <SolarCard />
        <ResultPanel />
      </View>
    </ScrollView>
  );
}
```

---

## Step 5: Copy Components from Web App

### Port These Files

```bash
# From web project to React Native project

src/components/
├─ PaywallScreen.tsx        ← Already created ✓
├─ LocationCard.tsx         ← Copy & adjust (remove CSS)
├─ BatteryCard.tsx          ← Copy & adjust
├─ ConsumptionCard.tsx      ← Copy & adjust
├─ SolarCard.tsx            ← Copy & adjust
├─ SunExposureCard.tsx      ← Copy & adjust
├─ DateRangeCard.tsx        ← Copy & adjust
├─ ResultPanel.tsx          ← Copy & adjust
├─ PresetsManager.tsx       ← Copy & adjust
├─ ErrorBoundary.tsx        ← Copy & adjust
└─ ToastContainer.tsx       ← Copy & adjust

src/hooks/
├─ useActivation.ts         ← Already created ✓
├─ useToast.ts              ← Copy as-is
├─ usePresets.ts            ← Copy & adjust (AsyncStorage ready)

src/lib/
├─ simulation.ts            ← Copy as-is
├─ solar.ts                 ← Copy as-is
├─ geolocation.ts           ← Copy & adjust (native APIs)
└─ errorHandler.ts          ← Copy as-is

src/locales/
├─ de/translation.json      ← Copy as-is
└─ en/translation.json      ← Copy as-is

src/
├─ i18n.ts                  ← Copy & adjust for React Native
└─ types.ts                 ← Copy as-is
```

### Adjustment Tips

**For StyleSheet Migration:**
```typescript
// BEFORE (CSS)
<div className="container">
  <span className="label">Text</span>
</div>

// AFTER (React Native)
<View style={styles.container}>
  <Text style={styles.label}>Text</Text>
</View>

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, color: '#fff' },
});
```

---

## Step 6: Set Up Geolocation

### iOS & Android Permissions

**app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "The app accesses your location to calculate solar positions"
        }
      ]
    ]
  }
}
```

### Updated Geolocation Module

```typescript
// src/lib/geolocation.ts
import * as Location from 'expo-location';

export async function getUserLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
}
```

---

## Step 7: Testing Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest

# Run tests
npm test
```

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
```

---

## Step 8: Build & Deploy

### Development

```bash
# Start dev server
npm start

# Or with specific device
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### Production Build

```bash
# Create production build
eas build --platform ios
eas build --platform android

# Or local build
npm run build
```

---

## Quick Start Commands

```bash
# Initialize new project
npx create-expo-app Outback --template typescript

# Install dependencies
npm install
npm install react-native-async-storage/async-storage i18next react-i18next expo-router

# Start development
npm start

# Test on iOS
npm run ios

# Test on Android
npm run android

# Build for App Store
eas build --platform ios --type app-store

# Build for Google Play
eas build --platform android --type app-bundle
```

---

## File Checklist

Before moving to next step, ensure:

- [ ] `app.json` configured with app name and bundle IDs
- [ ] `tsconfig.json` with path aliases (@/)
- [ ] `babel.config.js` with module resolver
- [ ] Navigation structure (app/ folder)
- [ ] All components copied from web
- [ ] Hooks copied and adjusted
- [ ] Business logic (lib/) copied
- [ ] Translations (locales/) copied
- [ ] Geolocation permissions configured
- [ ] Testing setup complete
- [ ] Development server runs without errors

---

## Common Errors & Fixes

| Error | Solution |
|-------|----------|
| "Cannot find module '@/'" | Check babel.config.js has module-resolver |
| "Location permission denied" | Add plugins to app.json |
| "AsyncStorage not found" | Run `npm install @react-native-async-storage/async-storage` |
| "Expo CLI not found" | Run `npm install -g expo-cli` |
| "Build fails on EAS" | Update EAS: `eas update` and `eas build --auto-submit` |

---

## Next Steps

1. ✅ Create Expo project
2. ✅ Install dependencies
3. ✅ Copy components from web
4. ✅ Set up navigation
5. → **Test on device (iPhone/Android)**
6. → Configure IAP (iOS/Android)
7. → Submit to App Store
8. → Submit to Google Play

---

**Last Updated:** 2026-10-04
**Estimated Setup Time:** 4-6 hours
**Ready for:** Component Migration Phase
