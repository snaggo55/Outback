# Outback - LiFePO4 Battery Autonomy Calculator

A modern web application for calculating battery autonomy for LiFePO4 systems in campervans and off-grid applications.

## Features

✅ **Multilingual Support** - German and English interfaces
✅ **Solar Simulation** - Accurate solar yield calculations based on location and date
✅ **Battery Management** - Configure battery capacity, voltage, and usable percentage
✅ **Consumption Tracking** - Real-time autonomy calculation based on daily consumption
✅ **Weather Aware** - Solar radiation calculations based on location and season
✅ **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool
- **i18next** - Internationalization
- **Tailwind CSS** - Styling

## Installation

```bash
npm install
npm run dev
```

## Usage

1. Set your location (automatic or manual GPS coordinates)
2. Configure your battery specs (capacity, voltage, usable %)
3. Enter your daily consumption in Ah
4. Set solar panel configuration (power, mounting, angle)
5. Define sun exposure hours and shadow factor
6. Select your travel date range
7. Click "Calculate" to see autonomy results

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

## Error Handling

The app includes comprehensive error handling for:
- Invalid location data
- Missing required fields
- Calculation errors
- Geolocation failures

## Performance

- Memoized components to prevent unnecessary re-renders
- Optimized solar calculations
- Efficient state management with React Hooks

## License

MIT
