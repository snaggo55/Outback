import { useTranslation } from 'react-i18next';
import type { SolarConfig } from '@/types';

interface Props {
  config: SolarConfig;
  onChange: (config: SolarConfig) => void;
}

export function SolarCard({ config, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">☀️</span> {t('solar.title')}
      </h2>

      <div className="field">
        <label>{t('solar.power')}</label>
        <input
          type="number"
          min={50}
          max={2000}
          step={10}
          value={config.peakWatts}
          onChange={(e) =>
            onChange({ ...config, peakWatts: Number(e.target.value) })
          }
        />
        <span className="unit">Watt peak (Wp)</span>
      </div>

      <div className="field">
        <label>{t('solar.mounting')}</label>
        <div className="toggle-group">
          <button
            className={config.mounting === 'flat' ? 'active' : ''}
            onClick={() => onChange({ ...config, mounting: 'flat' })}
          >
            {t('solar.flat')}
          </button>
          <button
            className={config.mounting === 'angled' ? 'active' : ''}
            onClick={() => onChange({ ...config, mounting: 'angled' })}
          >
            {t('solar.angled')}
          </button>
        </div>
      </div>

      {config.mounting === 'angled' && (
        <div className="field">
          <label>{t('solar.tilt')}: {config.tiltAngle}°</label>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={config.tiltAngle}
            onChange={(e) =>
              onChange({ ...config, tiltAngle: Number(e.target.value) })
            }
          />
        </div>
      )}
    </div>
  );
}
