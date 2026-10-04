import { describe, it, expect } from 'vitest';
import { runSimulation } from './simulation';

describe('Simulation', () => {
  const testLocation = { latitude: 48.137, longitude: 11.576 };
  const testBattery = { capacityAh: 200, voltage: 12, usablePercent: 0.95 };
  const testSolar = { peakWatts: 400, mounting: 'flat' as const, tiltAngle: 30 };
  const testSunExposure = { fromHour: 8, toHour: 18, locationFactor: 1 };

  it('should calculate autonomy for a given time period', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-15');

    const result = runSimulation({
      location: testLocation,
      battery: testBattery,
      solar: testSolar,
      sunExposure: testSunExposure,
      dailyConsumptionAh: 50,
      startDate,
      endDate,
    });

    expect(result).toHaveProperty('autonomyDays');
    expect(result).toHaveProperty('averageSolarYieldAh');
    expect(result).toHaveProperty('dailyResults');
    expect(result.autonomyDays).toBeGreaterThanOrEqual(0);
    expect(result.averageSolarYieldAh).toBeGreaterThanOrEqual(0);
  });

  it('should handle high consumption correctly', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-08');

    const result = runSimulation({
      location: testLocation,
      battery: testBattery,
      solar: testSolar,
      sunExposure: testSunExposure,
      dailyConsumptionAh: 500, // Very high
      startDate,
      endDate,
    });

    expect(result.autonomyDays).toBeLessThan(7);
  });

  it('should return daily results for each day', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-04');

    const result = runSimulation({
      location: testLocation,
      battery: testBattery,
      solar: testSolar,
      sunExposure: testSunExposure,
      dailyConsumptionAh: 50,
      startDate,
      endDate,
    });

    expect(result.dailyResults.length).toBe(3); // 3 days
    expect(result.dailyResults[0]).toHaveProperty('date');
    expect(result.dailyResults[0]).toHaveProperty('batteryStateAh');
  });
});
