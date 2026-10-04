interface Props {
  value: number;
  onChange: (value: number) => void;
}

const PRESETS = [
  { label: 'Sparsam', ah: 30 },
  { label: 'Normal', ah: 50 },
  { label: 'Komfort', ah: 80 },
  { label: 'Hoch', ah: 120 },
] as const;

export function ConsumptionCard({ value, onChange }: Props) {
  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">⚡</span> Tagesverbrauch
      </h2>

      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.ah}
            className={value === p.ah ? 'active' : ''}
            onClick={() => onChange(p.ah)}
          >
            {p.label} {p.ah}Ah
          </button>
        ))}
      </div>

      <div className="field">
        <label>Tagesverbrauch</label>
        <input
          type="number"
          min={5}
          max={500}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="unit">Amperestunden pro Tag (Ah/Tag)</span>
      </div>
    </div>
  );
}
