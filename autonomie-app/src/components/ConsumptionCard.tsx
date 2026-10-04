import { useTranslation } from 'react-i18next';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const PRESET_KEYS = [
  { key: 'consumption.economical', ah: 30 },
  { key: 'consumption.normal', ah: 50 },
  { key: 'consumption.comfort', ah: 80 },
  { key: 'consumption.high', ah: 120 },
] as const;

export function ConsumptionCard({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">⚡</span> {t('consumption.title')}
      </h2>

      <div className="presets">
        {PRESET_KEYS.map((p) => (
          <button
            key={p.ah}
            className={value === p.ah ? 'active' : ''}
            onClick={() => onChange(p.ah)}
          >
            {t(p.key)} {p.ah}Ah
          </button>
        ))}
      </div>

      <div className="field">
        <label>{t('consumption.daily')}</label>
        <input
          type="number"
          min={5}
          max={500}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="unit">{t('consumption.unit')}</span>
      </div>
    </div>
  );
}
