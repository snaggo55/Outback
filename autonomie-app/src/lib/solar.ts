const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const SYSTEM_EFFICIENCY = 0.85;
const ATMOSPHERIC_TRANSMITTANCE = 0.75;
const AVERAGE_DAILY_FRACTION = 0.64;

function degToRad(deg: number): number {
  return deg * DEG_TO_RAD;
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export function solarDeclination(dayOfYear: number): number {
  return 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81)));
}

export function daylightHours(latitude: number, dayOfYear: number): number {
  const decl = solarDeclination(dayOfYear);
  const latRad = degToRad(latitude);
  const declRad = degToRad(decl);
  const cosHourAngle = -Math.tan(latRad) * Math.tan(declRad);
  if (cosHourAngle < -1) return 24; // midnight sun
  if (cosHourAngle > 1) return 0; // polar night
  const hourAngle = Math.acos(cosHourAngle) * RAD_TO_DEG;
  return (2 * hourAngle) / 15;
}

export function sunriseHour(latitude: number, dayOfYear: number): number {
  return 12 - daylightHours(latitude, dayOfYear) / 2;
}

export function sunsetHour(latitude: number, dayOfYear: number): number {
  return 12 + daylightHours(latitude, dayOfYear) / 2;
}

export function solarNoonAltitude(latitude: number, dayOfYear: number): number {
  const decl = solarDeclination(dayOfYear);
  return 90 - Math.abs(latitude - decl);
}

export function estimateDailyIrradiance(latitude: number, dayOfYear: number): number {
  const hours = daylightHours(latitude, dayOfYear);
  if (hours <= 0) return 0;
  const altitude = solarNoonAltitude(latitude, dayOfYear);
  if (altitude <= 0) return 0;
  const clearSkyPeak = 1000 * Math.sin(degToRad(altitude));
  return (clearSkyPeak * AVERAGE_DAILY_FRACTION * ATMOSPHERIC_TRANSMITTANCE * hours) / 1000;
}

export function tiltGainFactor(
  latitude: number,
  dayOfYear: number,
  tiltAngle: number,
): number {
  const decl = solarDeclination(dayOfYear);
  const altitude = solarNoonAltitude(latitude, dayOfYear);
  if (altitude <= 0) return 0;

  const flatIncidence = Math.sin(degToRad(altitude));
  const tiltedIncidence = Math.sin(degToRad(Math.min(90, altitude + tiltAngle)));
  if (flatIncidence <= 0) return 1;

  let factor = tiltedIncidence / flatIncidence;
  const optimalTilt = Math.abs(latitude - decl);
  if (Math.abs(tiltAngle - optimalTilt) > 30) {
    factor *= 0.85;
  }
  return Math.max(0.5, Math.min(1.5, factor));
}

export function effectiveSunHours(
  latitude: number,
  dayOfYear: number,
  userFrom: number,
  userTo: number,
): number {
  const sunrise = sunriseHour(latitude, dayOfYear);
  const sunset = sunsetHour(latitude, dayOfYear);
  const from = Math.max(userFrom, sunrise);
  const to = Math.min(userTo, sunset);
  return Math.max(0, to - from);
}

export interface DailySolarResult {
  yieldWh: number;
  yieldAh: number;
  effectiveHours: number;
  daylightHrs: number;
  noonAltitude: number;
}

export function calculateDailySolar(
  latitude: number,
  dayOfYear: number,
  peakWatts: number,
  voltage: number,
  mounting: 'flat' | 'angled',
  tiltAngle: number,
  userSunFrom: number,
  userSunTo: number,
  locationFactor: number,
): DailySolarResult {
  const dlHours = daylightHours(latitude, dayOfYear);
  const effHours = effectiveSunHours(latitude, dayOfYear, userSunFrom, userSunTo);
  const noonAlt = solarNoonAltitude(latitude, dayOfYear);

  const fullDayIrradiance = estimateDailyIrradiance(latitude, dayOfYear);
  const hourlyFraction = dlHours > 0 ? effHours / dlHours : 0;
  let irradiance = fullDayIrradiance * hourlyFraction;

  if (mounting === 'angled') {
    irradiance *= tiltGainFactor(latitude, dayOfYear, tiltAngle);
  }

  irradiance *= locationFactor;

  const yieldWh = peakWatts * irradiance * SYSTEM_EFFICIENCY;
  const yieldAh = yieldWh / voltage;

  return {
    yieldWh,
    yieldAh,
    effectiveHours: effHours,
    daylightHrs: dlHours,
    noonAltitude: noonAlt,
  };
}
