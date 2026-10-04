import { useState, useEffect } from 'react';
import type { BatteryConfig, SolarConfig, SunExposure } from '@/types';

export interface Preset {
  name: string;
  battery: BatteryConfig;
  solar: SolarConfig;
  sunExposure: SunExposure;
  consumption: number;
  timestamp: number;
}

const STORAGE_KEY = 'outback_presets';

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
    setLoaded(true);
  }, []);

  const savePreset = (name: string, data: Omit<Preset, 'name' | 'timestamp'>) => {
    try {
      const newPreset: Preset = {
        ...data,
        name,
        timestamp: Date.now(),
      };
      const updated = [...presets, newPreset];
      setPresets(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to save preset:', error);
      return false;
    }
  };

  const loadPreset = (index: number): Preset | null => {
    return presets[index] || null;
  };

  const deletePreset = (index: number) => {
    try {
      const updated = presets.filter((_, i) => i !== index);
      setPresets(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to delete preset:', error);
      return false;
    }
  };

  return {
    presets,
    loaded,
    savePreset,
    loadPreset,
    deletePreset,
  };
}
