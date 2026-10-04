import { useTranslation } from 'react-i18next';
import type { SunExposure } from '@/types';

interface Props {
  config: SunExposure;
  onChange: (config: SunExposure) => void;
}

const SHADE_PRESET_KEYS = [
  { key: 'sunExposure.noShadow', value: 1.0 },
  { key: 'sunExposure.lightShadow', value: 0.8 },
  { key: 'sunExposure.moderateShadow', value: 0.6 },
  { key: 'sunExposure.heavyShadow', value: 0.4 },
] as const;

function decimalToTime(dec: number): string {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function timeToDecimal(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

export function SunExposureCard({ config, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">🌅</span> {t('sunExposure.title')}
      </h2>

      <p className="card-hint">
        {t('sunExposure.hint')}
      </p>

      <div className="row">
        <div className="field">
          <label>{t('sunExposure.from')}</label>
          <input
            type="time"
            value={decimalToTime(config.fromHour)}
            onChange={(e) =>
              onChange({ ...config, fromHour: timeToDecimal(e.target.value) })
            }
          />
        </div>
        <div className="field">
          <label>{t('sunExposure.to')}</label>
          <input
            type="time"
            value={decimalToTime(config.toHour)}
            onChange={(e) =>
              onChange({ ...config, toHour: timeToDecimal(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="field">
        <label>{t('sunExposure.shadow')}</label>
        <p className="card-hint" style={{ marginBottom: '10px' }}>
          {t('sunExposure.shadowHint')}
        </p>
        <div className="presets">
          {SHADE_PRESET_KEYS.map((preset) => (
            <button
              key={preset.value}
              className={Math.abs(config.locationFactor - preset.value) < 0.01 ? 'active' : ''}
              onClick={() =>
                onChange({ ...config, locationFactor: preset.value })
              }
            >
              {t(preset.key)}
            </button>
          ))}
        </div>
        <div className="slider-value" style={{ marginTop: '8px' }}>
          → {Math.round(config.locationFactor * 100)}% {t('sunExposure.yield')}
        </div>
      </div>
    </div>
  );
}
