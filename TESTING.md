# Testing Guide - Outback

## Unit Tests

Tests befinden sich unter `src/__tests__/`.

```bash
npm run test
```

### Test Coverage

- `simulation.test.ts`: Autonomy calculation logic
  - Autonomy calculation for time periods
  - High consumption handling
  - Daily results generation

### Vitest Config

Tests verwenden Vitest (schneller als Jest).

```bash
npm run test -- --coverage
```

## Manual Testing

### Desktop (1920x1080)
- [ ] Language switcher works (DE/EN)
- [ ] All cards render correctly
- [ ] Buttons are responsive on click
- [ ] Form inputs accept values
- [ ] Calculate button shows results
- [ ] Results chart displays
- [ ] Presets save/load/delete

### Mobile (375x812)
- [ ] Layout is responsive
- [ ] Buttons are touch-friendly (>44px)
- [ ] Text is readable
- [ ] Form fields are accessible
- [ ] No horizontal scrolling
- [ ] Calculate button works
- [ ] Results display correctly

### Tablet (768x1024)
- [ ] Layout is readable
- [ ] Buttons are well-spaced
- [ ] Cards have proper width
- [ ] PWA mode works

## Feature Testing

### Presets
1. Save a configuration as "Standard Setup"
2. Verify preset appears in the list
3. Click Load to restore settings
4. Click Delete to remove preset
5. Create multiple presets (3+)
6. Verify they persist on refresh

### Calculation
1. Set location (auto or manual)
2. Configure battery (capacity, voltage)
3. Set consumption (50Ah)
4. Set date range (2 weeks)
5. Click "Autonomie berechnen"
6. Verify results panel appears
7. Verify chart is displayed

### Languages
1. Switch to English
2. All text should be in English
3. App title: "Outback"
4. Button texts updated
5. Error messages in English
6. Switch back to German
7. All text should be in German

### Error Handling
1. Try calculating without location
   - Should show: "Standort erforderlich"
2. Try invalid date range
   - Should show: "Ungültiger Datumsbereich"
3. Try very high consumption
   - Should handle gracefully

## Performance Testing

### Load Time
```bash
npm run build
# Check dist/index.html
```

Target:
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Total Bundle Size: < 200KB

### Memory Usage
- Open DevTools → Memory tab
- Record heap size
- Interact with app
- Verify no memory leaks
- Should stay < 50MB

### Network
- Throttle to 4G
- App should still be responsive
- Presets load from localStorage (offline)
- Service Worker should cache assets

## Browser Testing

### Desktop
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

### Mobile
- ✅ iOS 16+ (Safari)
- ✅ Android 12+ (Chrome)
- ✅ Samsung Internet 20+

## Accessibility Testing

### WCAG 2.1 Level AA
1. Run Lighthouse audit
2. Color contrast should be > 4.5:1
3. All interactive elements keyboard accessible
4. Form labels properly associated
5. Error messages clear and helpful

```bash
# In Chrome DevTools
# Lighthouse → Accessibility → Run
```

## E2E Testing Script

Manual E2E flow:

1. **Load App**
   - Visit http://localhost:5174
   - Should load < 2s
   - No console errors

2. **Set Configuration**
   - Click "Standort bestimmen" (get location)
   - Wait for location
   - Set battery: 200Ah @ 12V
   - Set consumption: 50Ah/day
   - Set solar: 400W flat
   - Set date range: 2 weeks

3. **Calculate**
   - Click "Autonomie berechnen"
   - Results should appear
   - Chart should display
   - Daily results should list

4. **Test Presets**
   - Click "+ Neues Preset speichern"
   - Name: "Test Config"
   - Click "Save"
   - Modify values
   - Click "Load" on preset
   - Values should restore

5. **Test Languages**
   - Click English button
   - Everything should be English
   - Click Deutsch button
   - Everything should be German

6. **Test Mobile**
   - Open DevTools → Device toolbar
   - Set to iPhone 15 (390x844)
   - Repeat all tests from #2-5
   - Ensure responsive

## Debug Mode

```bash
# Development with console logs
npm run dev

# Check browser console for debug info
# localStorage inspection for presets
# DevTools → Application → localStorage
```

## Continuous Integration

Tests run on:
- `git push` (GitHub Actions)
- Pull Requests
- Merge to main/improvements

## Known Issues

None currently documented.

## Future Testing

- [ ] Playwright E2E tests
- [ ] Visual regression testing
- [ ] Performance budget checks
- [ ] Accessibility audit automation
