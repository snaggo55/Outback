import { useTranslation } from 'react-i18next';

interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function DateRangeCard({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">📅</span> {t('dateRange.title')}
      </h2>
      <div className="row">
        <div className="field">
          <label>{t('dateRange.start')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartChange(e.target.value)}
          />
        </div>
        <div className="field">
          <label>{t('dateRange.end')}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
