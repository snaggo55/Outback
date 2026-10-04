import type { SunExposure } from '@/types';

interface Props {
  config: SunExposure;
  onChange: (config: SunExposure) => void;
}

const SHADE_PRESETS = [
  { label: 'Kein Schatten', value: 1.0 },
  { label: 'Leichter Schatten', value: 0.8 },
  { label: 'Mäßiger Schatten', value: 0.6 },
  { label: 'Starker Schatten', value: 0.4 },
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
  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">🌅</span> Sonneneinstrahlung
      </h2>

      <p className="card-hint">
        Zeitraum, in dem die Paneele tatsächlich Sonne bekommen
        (ohne Abschattung durch Bäume, Gebäude, etc.).
      </p>

      <div className="row">
        <div className="field">
          <label>Sonne von</label>
          <input
            type="time"
            value={decimalToTime(config.fromHour)}
            onChange={(e) =>
              onChange({ ...config, fromHour: timeToDecimal(e.target.value) })
            }
          />
        </div>
        <div className="field">
          <label>Sonne bis</label>
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
        <label>Schattenwurf auf Paneele</label>
        <p className="card-hint" style={{ marginBottom: '10px' }}>
          Wie viel Schatten fällt auf deine Solarpaneele durch Bäume, Gebäude oder andere Hindernisse?
        </p>
        <div className="presets">
          {SHADE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              className={Math.abs(config.locationFactor - preset.value) < 0.01 ? 'active' : ''}
              onClick={() =>
                onChange({ ...config, locationFactor: preset.value })
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="slider-value" style={{ marginTop: '8px' }}>
          → {Math.round(config.locationFactor * 100)}% Ertrag
        </div>
      </div>
    </div>
  );
}
