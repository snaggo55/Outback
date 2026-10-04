import type { SimulationInput, SimulationResult, DayResult } from '@/types';
import { calculateDailySolar, getDayOfYear } from './solar';

export function runSimulation(input: SimulationInput): SimulationResult {
  const {
    location,
    battery,
    solar,
    sunExposure,
    dailyConsumptionAh,
    startDate,
    endDate,
  } = input;

  const usableBatteryAh = battery.capacityAh * battery.usablePercent;
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / 86400000,
  );

  let batteryState = usableBatteryAh;
  let autonomyDays = 0;
  let totalSolarAh = 0;
  const dailyResults: DayResult[] = [];

  for (let d = 0; d < totalDays; d++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + d);
    const doy = getDayOfYear(currentDate);

    const solarResult = calculateDailySolar(
      location.latitude,
      doy,
      solar.peakWatts,
      battery.voltage,
      solar.mounting,
      solar.tiltAngle,
      sunExposure.fromHour,
      sunExposure.toHour,
      sunExposure.locationFactor,
    );

    totalSolarAh += solarResult.yieldAh;
    const netBalance = solarResult.yieldAh - dailyConsumptionAh;
    batteryState = Math.min(usableBatteryAh, batteryState + netBalance);

    dailyResults.push({
      date: currentDate,
      solarYieldAh: solarResult.yieldAh,
      consumptionAh: dailyConsumptionAh,
      netBalanceAh: netBalance,
      batteryStateAh: Math.max(0, batteryState),
      effectiveSunHours: solarResult.effectiveHours,
      daylightHours: solarResult.daylightHrs,
      solarNoonAltitude: solarResult.noonAltitude,
    });

    if (batteryState > 0) {
      autonomyDays = d + 1;
    } else {
      break;
    }
  }

  const daysSimulated = dailyResults.length;
  const averageSolarYieldAh = totalSolarAh / daysSimulated;
  const averageBalanceAh = averageSolarYieldAh - dailyConsumptionAh;

  return {
    autonomyDays,
    totalDays,
    averageSolarYieldAh,
    averageBalanceAh,
    usableBatteryAh,
    dailyResults,
    isFullyAutonomous: autonomyDays >= totalDays,
  };
}
