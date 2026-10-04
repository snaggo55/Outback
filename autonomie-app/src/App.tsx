import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { GeoLocation, BatteryConfig, SolarConfig, SunExposure, SimulationResult } from '@/types';
import { runSimulation } from '@/lib/simulation';
import { LocationCard } from '@/components/LocationCard';
import { BatteryCard } from '@/components/BatteryCard';
import { ConsumptionCard } from '@/components/ConsumptionCard';
import { SolarCard } from '@/components/SolarCard';
import { SunExposureCard } from '@/components/SunExposureCard';
import { DateRangeCard } from '@/components/DateRangeCard';
import { ResultPanel } from '@/components/ResultPanel';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function App() {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'timerange' | 'maxautonomy'>('timerange');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [battery, setBattery] = useState<BatteryConfig>({
    capacityAh: 200,
    voltage: 12,
    usablePercent: 0.95,
  });
  const [consumption, setConsumption] = useState(50);
  const [solar, setSolar] = useState<SolarConfig>({
    peakWatts: 400,
    mounting: 'flat',
    tiltAngle: 30,
  });
  const [sunExposure, setSunExposure] = useState<SunExposure>({
    fromHour: 8,
    toHour: 18,
    locationFactor: 1,
  });

  const today = new Date();
  const twoWeeks = new Date(today);
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(twoWeeks));
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [maxAutonomyData, setMaxAutonomyData] = useState<{ days: number; optimalConsumption: number } | null>(null);
  const [liveConsumption, setLiveConsumption] = useState(50);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculateTimerange() {
    if (!location) {
      alert(t('errors.noLocation'));
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      alert(t('errors.invalidDate'));
      return;
    }

    const simResult = runSimulation({
      location,
      battery,
      solar,
      sunExposure,
      dailyConsumptionAh: consumption,
      startDate: start,
      endDate: end,
    });
    setResult(simResult);
    setMaxAutonomyData(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleCalculateMaxAutonomy() {
    if (!location) {
      alert(t('errors.noLocation'));
      return;
    }

    const oneYear = new Date(today);
    oneYear.setFullYear(oneYear.getFullYear() + 1);

    const simResult = runSimulation({
      location,
      battery,
      solar,
      sunExposure,
      dailyConsumptionAh: consumption,
      startDate: today,
      endDate: oneYear,
    });

    setMaxAutonomyData({ days: simResult.autonomyDays, optimalConsumption: consumption });
    setLiveConsumption(consumption);
    setResult(simResult);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleLiveConsumptionChange(newConsumption: number) {
    setLiveConsumption(newConsumption);
    const oneYear = new Date(today);
    oneYear.setFullYear(oneYear.getFullYear() + 1);

    const simResult = runSimulation({
      location: location!,
      battery,
      solar,
      sunExposure,
      dailyConsumptionAh: newConsumption,
      startDate: today,
      endDate: oneYear,
    });

    setResult(simResult);
  }

  return (
    <div className="container">
      <header>
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
        <div className="language-switcher">
          <button
            onClick={() => i18n.changeLanguage('de')}
            className={i18n.language === 'de' ? 'active' : ''}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={i18n.language === 'en' ? 'active' : ''}
          >
            🇬🇧 English
          </button>
        </div>
      </header>

      <div className="mode-switcher">
        <button
          className={mode === 'timerange' ? 'active' : ''}
          onClick={() => setMode('timerange')}
        >
          {t('modes.timerange')}
        </button>
        <button
          className={mode === 'maxautonomy' ? 'active' : ''}
          onClick={() => setMode('maxautonomy')}
        >
          {t('modes.maxautonomy')}
        </button>
      </div>

      <LocationCard location={location} onChange={setLocation} />
      <BatteryCard config={battery} onChange={setBattery} />
      <ConsumptionCard value={consumption} onChange={setConsumption} />
      <SolarCard config={solar} onChange={setSolar} />
      <SunExposureCard config={sunExposure} onChange={setSunExposure} />

      {mode === 'timerange' && (
        <DateRangeCard
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      )}

      <button className="calc-btn" onClick={mode === 'timerange' ? handleCalculateTimerange : handleCalculateMaxAutonomy}>
        {mode === 'timerange' ? t('calculation') : t('modes.calculateMax')}
      </button>

      <div ref={resultRef}>
        {result && (
          <>
            <ResultPanel result={result} />
            {maxAutonomyData && (
              <div className="card" style={{ marginTop: '16px' }}>
                <h2 className="card-title">
                  <span className="icon">⚙️</span> {t('modes.adjustConsumption')}
                </h2>
                <p className="card-hint">
                  {t('modes.adjustHint')}
                </p>
                <div className="field">
                  <label>{t('consumption.daily')}: {liveConsumption}Ah</label>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={liveConsumption}
                    onChange={(e) => handleLiveConsumptionChange(Number(e.target.value))}
                  />
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface2)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '8px' }}>
                    {t('modes.atConsumption')}
                  </p>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent)' }}>
                    {result.autonomyDays} {t('results.days')}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px' }}>
                    {t('modes.maxAutonomy')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
