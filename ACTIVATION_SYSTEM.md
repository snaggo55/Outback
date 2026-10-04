# 🔐 Outback Activation System

## Übersicht

Das Aktivierungssystem hat **zwei Wege** zum Freischalten der App:

1. **💳 In-App Purchase (Bezahlung)** - €4.99 für Lifetime Access
2. **🔑 Aktivierungschlüssel** - Kostenlose Codes für Freunde

---

## Architektur

### Hook: `useActivation`

**Location:** `src/hooks/useActivation.ts`

**Funktionen:**
- `checkActivation()` - Check ob App bereits aktiviert
- `validateActivationKey(key)` - Validiert Freunde-Codes
- `processPurchase()` - Startet In-App Purchase
- `resetActivation()` - Setzt Aktivierungsstatus zurück

**State Management:**
```typescript
interface ActivationState {
  isPaid: boolean;              // Aktiviert?
  loading: boolean;             // Loading state
  error: string | null;         // Error message
  activatedWith: 'purchase' | 'key' | null; // Aktivierungsmethode
}
```

**AsyncStorage Keys:**
- `outback_activated` - "true" wenn aktiviert
- `outback_activated_with` - Aktivierungsmethode ("purchase" oder "key")
- `outback_activation_key` - Der verwendete Schlüssel
- `outback_used_keys` - JSON Array bereits benutzter Codes
- `outback_iap_purchased` - "true" wenn IAP Kauf erfolgte

---

## UI: Paywall Screen

**Location:** `src/components/PaywallScreen.tsx`

**Features:**
- 💳 **Purchase Tab** - €4.99 Kauf Button
- 🔑 **Key Tab** - Aktivierungschlüssel Input
- Feature List - Marketing
- Dark Theme - Modern UI
- Error Handling - Benutzerfreundliche Fehlerausgabe

**Props:**
```typescript
interface PaywallScreenProps {
  onActivated: () => void;  // Callback wenn aktiviert
}
```

---

## Freunde-Codes (Hardcoded)

### Verfügbare Codes (2024)

```
FREUND-OUTBACK-2024-001
FREUND-OUTBACK-2024-002
FREUND-OUTBACK-2024-003
FREUND-OUTBACK-2024-004
FREUND-OUTBACK-2024-005
FREUND-OUTBACK-2024-006
FREUND-OUTBACK-2024-007
FREUND-OUTBACK-2024-008
FREUND-OUTBACK-2024-009
FREUND-OUTBACK-2024-010
```

### Weitere Codes Hinzufügen

Edit `src/hooks/useActivation.ts`:

```typescript
const FRIEND_ACTIVATION_KEYS = [
  'FREUND-OUTBACK-2024-001',
  'FREUND-OUTBACK-2024-002',
  // ... mehr Codes ...
  'FREUND-OUTBACK-2025-001',  // ← Neue Codes 2025
  'FREUND-OUTBACK-2025-002',
];
```

### Sicherheit

- **Lokal validiert** - Keine Backend Anfragen (Offline funktioniert)
- **Code-Sperre** - Jeder Code kann nur 1x benutzt werden
- **AsyncStorage** - Liste benutzer Codes persistent

---

## Integration in App.tsx

```typescript
import { PaywallScreen } from '@/components/PaywallScreen';
import { useActivation } from '@/hooks/useActivation';

export function App() {
  const { isPaid, loading } = useActivation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isPaid) {
    return <PaywallScreen onActivated={() => {}} />;
  }

  return <MainApp />;
}
```

---

## In-App Purchase Setup

### iOS (App Store Connect)

**1. Product ID erstellen:**
```
com.outback.lifetime
```

**2. Preis setzen:**
```
€4.99 (Deutschland) / $4.99 (USA)
```

**3. Beschreibung:**
```
Lifetime Access zu Outback Calculator
```

### Android (Google Play Console)

**1. SKU erstellen:**
```
outback.lifetime
```

**2. Preis setzen:**
```
€4.99 (Deutschland) / $4.99 (USA)
```

---

## Implementierung: React Native IAP

```bash
expo install react-native-iap
```

**useActivation.ts Update:**

```typescript
import * as RNIap from 'react-native-iap';

const processPurchase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await RNIap.initConnection();
    
    const result = await RNIap.requestPurchase('com.outback.lifetime');
    
    // IAP erfolgreiche
    await AsyncStorage.setItem('outback_activated', 'true');
    await AsyncStorage.setItem('outback_activated_with', 'purchase');
    await AsyncStorage.setItem('outback_iap_purchased', 'true');
    
    setState({ isPaid: true, activatedWith: 'purchase' });
    
    return {
      success: true,
      message: 'Danke für deinen Kauf!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Kauf fehlgeschlagen. Bitte versuche es später erneut.',
    };
  }
};
```

---

## Überprüfung auf Device

### Test Purchase (Sandbox)

**iOS:**
1. Settings → [Your Name] → App Store
2. Sandbox Apple ID
3. Sandbox Purchases möglich

**Android:**
1. Google Play Console → Testing
2. Lizenztest Nutzer hinzufügen
3. Sandbox IAP möglich

### Test Aktivierungskeys

1. Simulator öffnen
2. PaywallScreen → Key Tab
3. `FREUND-OUTBACK-2024-001` eingeben
4. ✅ "App erfolgreich aktiviert!"

---

## Fehlerbehandlung

### Häufige Fehler

| Fehler | Lösung |
|--------|--------|
| "Ungültiger Code" | Code prüfen, Case-sensitive |
| "Code bereits benutzt" | Anderer Code oder App zurücksetzen |
| "Kauf fehlgeschlagen" | Internet? AppStore Sandbox? |
| "Connection error" | Backend später implementieren |

### Debug Mode

```typescript
// In useActivation.ts
const DEBUG = true;  // ← Change to true

if (DEBUG) {
  console.log('Activation State:', state);
  console.log('Used Keys:', usedKeyList);
}
```

---

## Migration vom Web

### Unterschiede Web ↔ Native

```
WEB:                          NATIVE (React Native):
├─ localStorage               ├─ AsyncStorage
├─ Browser Cache              ├─ App Container
├─ Payment: Stripe            ├─ In-App Purchase
└─ Offline: Service Worker    └─ Native Offline
```

### Aktivierungsstatus migrieren

Wenn Nutzer Web → Native App wechselt:

```typescript
// Option 1: Manueller Export
- QR Code mit Aktivierungschlüssel
- Nutzer scannt in Native App

// Option 2: OAuth/Login
- Nutzer logs in mit Email
- Aktivierungsstatus wird abgerufen

// Option 3: Deep Link
- Nutzer klickt Link aus Web
- Native App wird geöffnet + aktiviert
```

---

## Release Checklist

Vor App Store Submission:

- [ ] IAP Product IDs erstellt (iOS + Android)
- [ ] Sandbox Tester Accounts konfiguriert
- [ ] Purchase Flow auf Device getestet
- [ ] Freunde-Codes dokumentiert
- [ ] Privacy Policy aktualisiert
- [ ] In-App Receipts validiert
- [ ] Fallback Handling wenn IAP Fehler
- [ ] Encryption für Daten (optional)

---

## Analytics & Monitoring

### Metriken zum Trackback

```typescript
// Activation Tracking
const trackActivation = (method: 'purchase' | 'key') => {
  analytics.track('app_activated', {
    method,
    timestamp: new Date(),
    deviceId: getDeviceId(),
  });
};
```

### Wichtige Metriken

- Aktivierungen per Tag/Monat
- Purchase Success Rate
- Key Activation Rate
- Error Rate
- Churn Rate

---

## Zukunftserweiterung

### Backend Integration (v1.1)

```typescript
// In Zukunft: Server-basierte Validierung
const validateKeyWithServer = async (key: string) => {
  const response = await fetch('https://api.outback.app/validate', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
  return response.json();
};
```

### Monetarisierungsoptionen

```
v1.0 (Aktuell):    €4.99 One-Time
v1.1 (Geplant):    + Free Trial (7 Tage)
v1.2 (Geplant):    + Subscription (€0.99/Monat)
v2.0 (Future):     + Premium Features
```

---

## Support

### Häufig gestellte Fragen

**F: Wie viele Freunde-Codes kann ich generieren?**
A: Beliebig viele. Einfach in `FRIEND_ACTIVATION_KEYS` array hinzufügen.

**F: Kann ein Code zweimal verwendet werden?**
A: Nein. AsyncStorage speichert benutzte Codes und blockiert Wiederverwendung.

**F: Was wenn Nutzer die App deinstalliert?**
A: Aktivierungsstatus wird gelöscht. Mit IAP: Rückgängig machbar via App Store. Mit Code: Code ist verbraucht.

**F: Kann man das Passwort der App-Accounts zurücksetzen?**
A: Ja, über `resetActivation()` Hook. Damit kann Admin alte Aktivierungen clearen.

---

**Last Updated:** 2026-10-04
**Version:** 1.0
**Status:** Ready for Native App Integration
