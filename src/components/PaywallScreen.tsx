import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useActivation } from '@/hooks/useActivation';

interface PaywallScreenProps {
  onActivated: () => void;
}

export function PaywallScreen({ onActivated }: PaywallScreenProps) {
  const { validateActivationKey, processPurchase } = useActivation();
  const [tab, setTab] = useState<'purchase' | 'key'>('purchase');
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidateKey = async () => {
    if (!keyInput.trim()) {
      setError('Bitte gib einen Aktivierungsschlüssel ein');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await validateActivationKey(keyInput);

    if (result.success) {
      setLoading(false);
      Alert.alert('Erfolg', result.message, [
        {
          text: 'OK',
          onPress: onActivated,
        },
      ]);
    } else {
      setLoading(false);
      setError(result.message);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    const result = await processPurchase();

    if (result.success) {
      setLoading(false);
      Alert.alert('Erfolg', result.message, [
        {
          text: 'OK',
          onPress: onActivated,
        },
      ]);
    } else {
      setLoading(false);
      setError(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌄 Outback</Text>
          <Text style={styles.subtitle}>LiFePO4 Batterie Autonomie Kalkulator</Text>
        </View>

        {/* Feature List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <FeatureItem icon="✓" text="Genaue Autonomieberechnungen" />
          <FeatureItem icon="✓" text="Solaranlage Simulation" />
          <FeatureItem icon="✓" text="Konfigurationen speichern" />
          <FeatureItem icon="✓" text="Offline Zugriff" />
          <FeatureItem icon="✓" text="Deutsch & Englisch" />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === 'purchase' && styles.tabActive]}
            onPress={() => {
              setTab('purchase');
              setError(null);
            }}
          >
            <Text style={[styles.tabText, tab === 'purchase' && styles.tabTextActive]}>
              💳 Kaufen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'key' && styles.tabActive]}
            onPress={() => {
              setTab('key');
              setError(null);
            }}
          >
            <Text style={[styles.tabText, tab === 'key' && styles.tabTextActive]}>
              🔑 Code eingeben
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {tab === 'purchase' ? (
          <View style={styles.content}>
            <Text style={styles.price}>€4.99</Text>
            <Text style={styles.priceDescription}>Einmalige Zahlung • Lifetime Access • Kein Abo</Text>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1a1a2e" />
              ) : (
                <Text style={styles.buttonText}>Jetzt kaufen</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Die Zahlung wird über den App Store abgewickelt. Alle Transaktionen sind sicher.
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.keyDescription}>
              Du hast einen Aktivierungsschlüssel erhalten? Gib ihn hier ein um die App freizuschalten.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Aktivierungsschlüssel"
              placeholderTextColor="#666"
              value={keyInput}
              onChangeText={setKeyInput}
              editable={!loading}
              autoCapitalize="characters"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleValidateKey}
              disabled={loading || !keyInput.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#1a1a2e" />
              ) : (
                <Text style={styles.buttonText}>Aktivieren</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Version 1.0.0 • © 2026 Outback
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  featuresSection: {
    marginBottom: 32,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    borderColor: '#ffa500',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  tabTextActive: {
    color: '#ffa500',
  },
  content: {
    marginBottom: 32,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffa500',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceDescription: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  keyDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#ffa500',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});
