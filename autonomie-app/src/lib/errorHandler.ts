export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorMessages = {
  LOCATION_REQUIRED: 'Standort ist erforderlich',
  INVALID_DATE_RANGE: 'Ungültiger Datumsbereich',
  INVALID_CONSUMPTION: 'Ungültiger Verbrauch',
  GEOLOCATION_FAILED: 'Standorterkennung fehlgeschlagen',
  CALCULATION_FAILED: 'Berechnung fehlgeschlagen',
} as const;

export const ErrorMessagesEN = {
  LOCATION_REQUIRED: 'Location is required',
  INVALID_DATE_RANGE: 'Invalid date range',
  INVALID_CONSUMPTION: 'Invalid consumption',
  GEOLOCATION_FAILED: 'Location detection failed',
  CALCULATION_FAILED: 'Calculation failed',
} as const;

export function handleError(error: unknown, isGerman: boolean = true): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return isGerman ? 'Ein Fehler ist aufgetreten' : 'An error occurred';
}
