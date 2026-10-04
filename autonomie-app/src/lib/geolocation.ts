import type { GeoLocation } from '@/types';

export function requestLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation wird nicht unterstützt'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=de`,
    );
    const data = await res.json();
    if (data.display_name) {
      return data.display_name.split(',').slice(0, 3).join(',').trim();
    }
    return null;
  } catch {
    return null;
  }
}
