import { useState, useRef } from 'react';
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
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    if (!location) {
      alert('Bitte Standort bestimmen oder Koordinaten eingeben.');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      alert('Bitte gültigen Zeitraum wählen.');
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
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  return (
    <div className="container">
      <header>
        <h1>Philipps Autonomie Rechner</h1>
        <p>LiFePO4 Batterie · Wohnmobil</p>
      </header>

      <LocationCard location={location} onChange={setLocation} />
      <BatteryCard config={battery} onChange={setBattery} />
      <ConsumptionCard value={consumption} onChange={setConsumption} />
      <SolarCard config={solar} onChange={setSolar} />
      <SunExposureCard config={sunExposure} onChange={setSunExposure} />
      <DateRangeCard
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      <button className="calc-btn" onClick={handleCalculate}>
        Autonomie berechnen
      </button>

      <div ref={resultRef}>
        {result && <ResultPanel result={result} />}
      </div>
    </div>
  );
}
