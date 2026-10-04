import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GeoLocation } from '@/types';
import { requestLocation, reverseGeocode } from '@/lib/geolocation';

interface Props {
  location: GeoLocation | null;
  onChange: (loc: GeoLocation) => void;
}

export function LocationCard({ location, onChange }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  async function handleLocate() {
    setLoading(true);
    setError(null);
    try {
      const loc = await requestLocation();
      onChange(loc);
      const placeName = await reverseGeocode(loc.latitude, loc.longitude);
      if (placeName) {
        setName(placeName);
        onChange({ ...loc, name: placeName });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('location.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleManualChange(field: 'latitude' | 'longitude', value: string) {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const current = location ?? { latitude: 0, longitude: 0 };
    onChange({ ...current, [field]: num });
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">📍</span> {t('location.title')}
      </h2>

      <button
        className="location-btn"
        onClick={handleLocate}
        disabled={loading}
      >
        {loading ? `⏳ ${t('location.loading')}` : t('location.button')}
      </button>

      {error && <p className="field-error">{error}</p>}
      {name && <p className="location-name">{name}</p>}
      {location?.accuracy != null && (
        <p className="location-accuracy">
          {t('location.accuracy')}: {Math.round(location.accuracy)}m
        </p>
      )}

      <div className="row">
        <div className="field">
          <label>{t('location.latitude')}</label>
          <input
            type="number"
            step="0.001"
            placeholder="z.B. 48.137"
            value={location?.latitude ?? ''}
            onChange={(e) => handleManualChange('latitude', e.target.value)}
          />
        </div>
        <div className="field">
          <label>{t('location.longitude')}</label>
          <input
            type="number"
            step="0.001"
            placeholder="z.B. 11.576"
            value={location?.longitude ?? ''}
            onChange={(e) => handleManualChange('longitude', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
