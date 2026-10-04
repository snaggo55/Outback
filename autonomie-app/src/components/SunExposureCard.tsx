import type { SunExposure } from '@/types';

interface Props {
  config: SunExposure;
  onChange: (config: SunExposure) => void;
}

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
        (Abschattung durch Bäume, Gebäude etc. berücksichtigen).
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
        <div className="slider-value">
          {Math.round(config.locationFactor * 100)}%
        </div>
        <label>Standortfaktor (Verschattung, Ausrichtung)</label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={config.locationFactor * 100}
          onChange={(e) =>
            onChange({ ...config, locationFactor: Number(e.target.value) / 100 })
          }
        />
      </div>
    </div>
  );
}
