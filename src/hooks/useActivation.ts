import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generiere deine Freunde-Codes hier
const FRIEND_ACTIVATION_KEYS = [
  'FREUND-OUTBACK-2024-001',
  'FREUND-OUTBACK-2024-002',
  'FREUND-OUTBACK-2024-003',
  'FREUND-OUTBACK-2024-004',
  'FREUND-OUTBACK-2024-005',
  'FREUND-OUTBACK-2024-006',
  'FREUND-OUTBACK-2024-007',
  'FREUND-OUTBACK-2024-008',
  'FREUND-OUTBACK-2024-009',
  'FREUND-OUTBACK-2024-010',
  // Weitere Codes können hier hinzugefügt werden
];

export interface ActivationState {
  isPaid: boolean;
  loading: boolean;
  error: string | null;
  activatedWith: 'purchase' | 'key' | null;
}

export function useActivation() {
  const [state, setState] = useState<ActivationState>({
    isPaid: false,
    loading: true,
    error: null,
    activatedWith: null,
  });

  // Check activation status on mount
  useEffect(() => {
    checkActivation();
  }, []);

  const checkActivation = async () => {
    try {
      // Überprüfe ob bereits aktiviert
      const activated = await AsyncStorage.getItem('outback_activated');
      const activatedWith = (await AsyncStorage.getItem('outback_activated_with')) as 'purchase' | 'key' | null;

      if (activated === 'true') {
        setState({
          isPaid: true,
          loading: false,
          error: null,
          activatedWith: activatedWith || 'purchase',
        });
        return;
      }

      // Check if has IAP purchase
      const hasPurchase = await checkInAppPurchase();
      if (hasPurchase) {
        await AsyncStorage.setItem('outback_activated', 'true');
        await AsyncStorage.setItem('outback_activated_with', 'purchase');
        setState({
          isPaid: true,
          loading: false,
          error: null,
          activatedWith: 'purchase',
        });
        return;
      }

      setState({
        isPaid: false,
        loading: false,
        error: null,
        activatedWith: null,
      });
    } catch (error) {
      console.error('Activation check failed:', error);
      setState({
        isPaid: false,
        loading: false,
        error: 'Activation check failed',
        activatedWith: null,
      });
    }
  };

  const validateActivationKey = async (key: string): Promise<{ success: boolean; message: string }> => {
    try {
      const normalizedKey = key.toUpperCase().trim();

      // Überprüfe ob Key gültig ist
      if (!FRIEND_ACTIVATION_KEYS.includes(normalizedKey)) {
        return {
          success: false,
          message: 'Ungültiger Aktivierungsschlüssel. Bitte überprüfe die Eingabe.',
        };
      }

      // Überprüfe ob Key bereits benutzt wurde
      const usedKeys = await AsyncStorage.getItem('outback_used_keys');
      const usedKeyList = usedKeys ? JSON.parse(usedKeys) : [];

      if (usedKeyList.includes(normalizedKey)) {
        return {
          success: false,
          message: 'Dieser Schlüssel wurde bereits verwendet.',
        };
      }

      // Aktiviere mit Key
      await AsyncStorage.setItem('outback_activated', 'true');
      await AsyncStorage.setItem('outback_activated_with', 'key');
      await AsyncStorage.setItem('outback_activation_key', normalizedKey);

      // Speichere als benutzt
      usedKeyList.push(normalizedKey);
      await AsyncStorage.setItem('outback_used_keys', JSON.stringify(usedKeyList));

      setState({
        isPaid: true,
        loading: false,
        error: null,
        activatedWith: 'key',
      });

      return {
        success: true,
        message: 'App erfolgreich aktiviert! Viel Spaß mit Outback!',
      };
    } catch (error) {
      console.error('Key validation failed:', error);
      return {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      };
    }
  };

  const checkInAppPurchase = async (): Promise<boolean> => {
    try {
      const hasPurchase = await AsyncStorage.getItem('outback_iap_purchased');
      return hasPurchase === 'true';
    } catch (error) {
      console.error('IAP check failed:', error);
      return false;
    }
  };

  const processPurchase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // In zukünftiger Version: react-native-iap Integration
      // Für MVP: Lokal speichern (zum Testen)

      const purchased = await AsyncStorage.getItem('outback_iap_purchased');
      if (purchased === 'true') {
        return {
          success: false,
          message: 'Du hast die App bereits gekauft.',
        };
      }

      // IAP Purchase simulieren für MVP
      await AsyncStorage.setItem('outback_activated', 'true');
      await AsyncStorage.setItem('outback_activated_with', 'purchase');
      await AsyncStorage.setItem('outback_iap_purchased', 'true');
      await AsyncStorage.setItem('outback_purchase_date', new Date().toISOString());

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
    } catch (error) {
      console.error('Purchase failed:', error);
      return {
        success: false,
        message: 'Kauf fehlgeschlagen. Bitte versuche es später erneut.',
      };
    }
  };

  const resetActivation = async () => {
    try {
      await AsyncStorage.removeItem('outback_activated');
      await AsyncStorage.removeItem('outback_activated_with');
      await AsyncStorage.removeItem('outback_activation_key');
      setState({
        isPaid: false,
        loading: false,
        error: null,
        activatedWith: null,
      });
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  return {
    ...state,
    validateActivationKey,
    processPurchase,
    checkActivation,
    resetActivation,
  };
}
