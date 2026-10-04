import type { BatteryConfig } from '@/types';

interface Props {
  config: BatteryConfig;
  onChange: (config: BatteryConfig) => void;
}

const VOLTAGES = [12, 24, 48] as const;

export function BatteryCard({ config, onChange }: Props) {
  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">🔋</span> Batterie
      </h2>

      <div className="field">
        <label>Batteriekapazität</label>
        <input
          type="number"
          min={50}
          max={1000}
          step={10}
          value={config.capacityAh}
          onChange={(e) =>
            onChange({ ...config, capacityAh: Number(e.target.value) })
          }
        />
        <span className="unit">
          Amperestunden (Ah) · LiFePO4 nutzbar: {config.usablePercent * 100}%
        </span>
      </div>

      <div className="field">
        <label>Systemspannung</label>
        <div className="toggle-group">
          {VOLTAGES.map((v) => (
            <button
              key={v}
              className={config.voltage === v ? 'active' : ''}
              onClick={() => onChange({ ...config, voltage: v })}
            >
              {v}V
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
