export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
}

export interface BatteryConfig {
  capacityAh: number;
  voltage: 12 | 24 | 48;
  usablePercent: number; // LiFePO4 typically 0.95
}

export interface SolarConfig {
  peakWatts: number;
  mounting: 'flat' | 'angled';
  tiltAngle: number; // degrees, only relevant when mounting === 'angled'
}

export interface SunExposure {
  fromHour: number; // decimal hours, e.g. 8.5 = 08:30
  toHour: number;
  locationFactor: number; // 0..1, accounts for shading/orientation
}

export interface SimulationInput {
  location: GeoLocation;
  battery: BatteryConfig;
  solar: SolarConfig;
  sunExposure: SunExposure;
  dailyConsumptionAh: number;
  startDate: Date;
  endDate: Date;
}

export interface DayResult {
  date: Date;
  solarYieldAh: number;
  consumptionAh: number;
  netBalanceAh: number;
  batteryStateAh: number;
  effectiveSunHours: number;
  daylightHours: number;
  solarNoonAltitude: number;
}

export interface SimulationResult {
  autonomyDays: number;
  totalDays: number;
  averageSolarYieldAh: number;
  averageBalanceAh: number;
  usableBatteryAh: number;
  dailyResults: DayResult[];
  isFullyAutonomous: boolean;
}
