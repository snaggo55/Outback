# 🛍️ React Native In-App Purchase Setup Guide

Complete guide for integrating In-App Purchase with react-native-iap for iOS App Store and Google Play Store.

---

## Installation

### Step 1: Install Package

```bash
cd your-expo-project
expo install react-native-iap
```

### Step 2: Dependencies for Expo

```bash
expo install expo-modules-core expo-modules expo-dev-client
```

---

## iOS App Store Configuration

### Step 1: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+ New App"
3. Fill details:
   - **Name:** Outback
   - **Bundle ID:** com.outback.battery
   - **SKU:** outback-001
   - **Category:** Utilities

### Step 2: Configure Pricing & Availability

1. Click "Pricing and Availability"
2. Set availability for Germany (or worldwide)
3. Price tier: **Tier 1 (€0.99) or Custom (€4.99)**

### Step 3: Create IAP Product

1. Go to "Manage Your In-App Purchases"
2. Click "+ Create"
3. **Product Type:** Consumable (for one-time purchase)
4. Fill details:

```
Reference Name:    Lifetime License
Product ID:        com.outback.lifetime
Status:            Ready to Submit
Price:             €4.99 (or your tier)
Display Name:      Lifetime Access to Outback
Description:       Unlock all features of Outback Calculator
Tax Category:      Digital Service
Auto-Renewable:    NO
```

### Step 4: Set Up App Signing

1. Go to "Certificates, Identifiers & Profiles"
2. Create or update Certificate
3. Enable "In-App Purchase" capability

---

## Android Google Play Configuration

### Step 1: Create App in Google Play Console

1. Go to https://play.google.com/console
2. Create new project
3. Fill app details:
   - **Name:** Outback
   - **Package Name:** com.outback.battery
   - **Category:** Utilities

### Step 2: Create In-App Product

1. Go to "Products" → "In-App Products"
2. Click "Create Product"
3. Fill details:

```
Product ID:        outback.lifetime
Title:             Lifetime Access
Description:       Unlock all features of Outback Calculator
Price:             €4.99 (or adjust per region)
Status:            Draft (will activate on release)
```

### Step 3: Create Tester Account

1. Go to "Settings" → "License Testing"
2. Add Gmail accounts for testing
3. These accounts can test IAP without real charges

---

## Code Integration

### Update useActivation Hook

```typescript
import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';

const PRODUCT_IDS = Platform.select({
  ios: ['com.outback.lifetime'],
  android: ['outback.lifetime'],
});

export function useActivation() {
  const [state, setState] = useState<ActivationState>({
    isPaid: false,
    loading: true,
    error: null,
    activatedWith: null,
  });

  // Initialize IAP on mount
  useEffect(() => {
    initializeIAP();
    checkActivation();
  }, []);

  const initializeIAP = async () => {
    try {
      await RNIap.initConnection();
      console.log('IAP connection initialized');
    } catch (error) {
      console.error('IAP initialization failed:', error);
    }
  };

  const checkInAppPurchase = async (): Promise<boolean> => {
    try {
      // Check local storage first
      const hasPurchase = await AsyncStorage.getItem('outback_iap_purchased');
      if (hasPurchase === 'true') {
        return true;
      }

      // Check App Store / Google Play for purchases
      const purchases = await RNIap.getPurchaseHistory();
      const hasLifetime = purchases.some(
        (p) =>
          (p.productId === 'com.outback.lifetime' ||
            p.productId === 'outback.lifetime') &&
          p.transactionDate > Date.now() - 365 * 24 * 60 * 60 * 1000 // Last year
      );

      if (hasLifetime) {
        await AsyncStorage.setItem('outback_iap_purchased', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Purchase history check failed:', error);
      return false;
    }
  };

  const processPurchase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Request purchase from user
      const result = await RNIap.requestPurchase(
        Platform.select({
          ios: 'com.outback.lifetime',
          android: 'outback.lifetime',
        })
      );

      if (!result) {
        return {
          success: false,
          message: 'Kauf abgebrochen.',
        };
      }

      // Verify purchase with server (important for security!)
      // const verified = await verifyPurchaseWithServer(result);
      // if (!verified) {
      //   return { success: false, message: 'Kauf konnte nicht verifiziert werden.' };
      // }

      // Save purchase locally
      await AsyncStorage.setItem('outback_activated', 'true');
      await AsyncStorage.setItem('outback_activated_with', 'purchase');
      await AsyncStorage.setItem('outback_iap_purchased', 'true');
      await AsyncStorage.setItem('outback_purchase_date', new Date().toISOString());
      await AsyncStorage.setItem('outback_purchase_token', result.transactionId || '');

      setState({
        isPaid: true,
        loading: false,
        error: null,
        activatedWith: 'purchase',
      });

      return {
        success: true,
        message: 'Danke für deinen Kauf! Die App ist jetzt freigeschaltet.',
      };
    } catch (error: any) {
      if (error.code === 'E_USER_CANCELLED') {
        return {
          success: false,
          message: 'Kauf abgebrochen.',
        };
      }

      console.error('Purchase failed:', error);
      return {
        success: false,
        message: 'Kauf fehlgeschlagen. Bitte versuche es später erneut.',
      };
    }
  };

  // Rest of the hook remains the same...
  return {
    ...state,
    validateActivationKey,
    processPurchase,
    checkActivation,
    resetActivation,
  };
}
```

---

## Payment Receipt Validation

### Server-Side Validation (Important!)

For production, validate purchases with Apple and Google:

```typescript
// Backend example (Node.js)
const verifyAppleReceipt = async (receipt: string) => {
  const response = await fetch('https://buy.itunes.apple.com/verifyReceipt', {
    method: 'POST',
    body: JSON.stringify({
      'receipt-data': receipt,
      password: process.env.APPLE_SHARED_SECRET,
    }),
  });
  return response.json();
};

const verifyGoogleReceipt = async (packageName: string, productId: string, token: string) => {
  const response = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${token}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};
```

---

## Sandbox Testing

### iOS Sandbox Testing

1. **Create Sandbox Account:**
   - App Store Connect → Users → TestFlight
   - Create Sandbox tester account
   - Example: `outbacktester001@gmail.com`

2. **Test Purchase:**
   - On device/simulator: Settings → App Store
   - Logout & login with Sandbox account
   - Try purchase in app
   - No real charge

3. **Test Scenarios:**

```
✅ Successful Purchase
├─ Click "Jetzt kaufen"
├─ Enter Sandbox credentials
└─ Verify activation

⚠️ Declined Card
├─ Simulate by canceling in system dialog
└─ Test error handling

🔄 Restore Purchase
├─ Logout & login with same account
└─ Activation should restore
```

### Android Sandbox Testing

1. **License Tester Setup:**
   - Google Play Console → Settings → License Testers
   - Add test Gmail accounts
   - Wait 24 hours for activation

2. **Device Setup:**
   - On device: Settings → Google Play Apps
   - Sign in with test account
   - Test builds will show "TEST" label

3. **Test Purchase Flow:**

```
✅ Successful Purchase
├─ Click "Jetzt kaufen"
├─ Google Play billing dialog opens
└─ Verify activation (no charge)

⚠️ Billing Error
├─ Test account must be in country where app is available
└─ May need VPN to Germany/EU

🔄 Restore Purchase
├─ Same account on another device
└─ Activation should sync (if online)
```

---

## Testing Checklist

- [ ] iOS IAP Product created in App Store Connect
- [ ] Android IAP Product created in Google Play Console
- [ ] Sandbox tester accounts created (iOS)
- [ ] License tester accounts configured (Android)
- [ ] Purchase flow works on device (no errors)
- [ ] Activation saved to AsyncStorage
- [ ] Activation persists after app restart
- [ ] Error messages display correctly
- [ ] Restore purchase works (same account)
- [ ] Multiple purchase attempts handled

---

## Migration from MVP to Production

### Phase 1: MVP (Current)
```typescript
// Fake purchase for testing
const processPurchase = async () => {
  await AsyncStorage.setItem('outback_activated', 'true');
  // No real IAP
};
```

### Phase 2: Sandbox Testing
```typescript
// Real IAP with sandbox accounts
const processPurchase = async () => {
  const result = await RNIap.requestPurchase(PRODUCT_ID);
  // Real IAP but test accounts only
};
```

### Phase 3: Production
```typescript
// Real IAP with production accounts
// + Server-side receipt validation
// + Analytics tracking
// + Fraud detection
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No products found" | Wait 24h after creating product in console |
| "Purchase canceled" | User dismissed dialog - expected |
| "Invalid product ID" | Check exact product ID matches console |
| "Sandbox not working" | Ensure Sandbox tester account is active |
| "No internet error" | Requires internet connection for IAP |
| "Device not eligible" | Billing method required on device |

---

## Security Best Practices

1. **Never store receipt in client**
   - Always validate on server
   - Prevent fraud/spoofing

2. **Implement receipt validation**
   - Call Apple/Google API
   - Verify product ID
   - Check expiration

3. **Handle user-generated data**
   - Validate all inputs
   - Don't trust client state alone
   - Log suspicious activity

4. **Protect API keys**
   - Shared Secret (Apple) in .env
   - Service account (Google) in .env
   - Never commit secrets

---

## Next Steps

1. Create IAP products in both consoles
2. Update code with real product IDs
3. Test on device with sandbox accounts
4. Implement server-side validation
5. Submit to App Store (review: 1-3 days)
6. Submit to Google Play (review: 2-24 hours)
7. Monitor purchase analytics
8. Handle customer support

---

**Last Updated:** 2026-10-04
**Status:** Ready for Implementation
**Estimated Setup Time:** 2-3 hours per platform
